import express from "express";
import Word from "../models/Word.js";
import axios from "axios";

// 1. TẠO INTERFACE MỞ RỘNG (Fix lỗi TypeScript)
export interface AuthRequest extends express.Request {
  userId?: string;
}

export const addWord = async (req: AuthRequest, res: express.Response) => {
  try {
    const { term, tags, deckIds } = req.body;
    const currentUserId = req.userId;

    // Fetch dữ liệu từ Dictionary API
    const dictResponse = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`,
    );
    const dictData = dictResponse.data[0];

    const ipa =
      dictData.phonetics.find((p: { text: string }) => p.text)?.text || "";
    const meaning = dictData.meanings[0].definitions[0].definition;
    const type = dictData.meanings[0].partOfSpeech;

    const audioUrl = "https://your-storage.com/audio/sample.mp3"; // Mock URL

    // Lưu vào Database với ID người dùng
    const newWord = new Word({
      term,
      meaning,
      type,
      ipa,
      audioUrl,
      tags,
      deckIds,
      userId: currentUserId,
    });

    await newWord.save();
    res.status(201).json({ message: "Thêm từ vựng thành công", word: newWord });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi thêm từ vựng hoặc từ không tồn tại." });
  }
};

export const getDashboardStats = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    const now = new Date();
    const currentUserId = req.userId as string; // Lấy ID user đang đăng nhập

    // FIX LOGIC: Chỉ đếm số từ của user này
    const totalWords = await Word.countDocuments({ userId: currentUserId });

    const wordsToReviewToday = await Word.countDocuments({
      userId: currentUserId,
      nextReviewDate: { $lte: now },
    });

    res.status(200).json({
      totalWords,
      wordsToReviewToday,
      message: "Dữ liệu Dashboard",
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy xuất dữ liệu" });
  }
};

export const getReviewList = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    const now = new Date();
    const currentUserId = req.userId;

    // Nhận thêm query ?deckId=... từ frontend nếu người dùng muốn ôn tập theo kho từ con
    const { deckId } = req.query;

    const queryInfo: any = {
      userId: currentUserId, // FIX LOGIC: Luôn luôn lọc theo user
      nextReviewDate: { $lte: now },
    };

    // Nếu có truyền deckId (Trường hợp 2 của bạn) -> Thêm vào điều kiện lọc
    if (deckId) {
      queryInfo.deckIds = deckId;
    }

    // Nếu không truyền deckId (Trường hợp 1) -> Sẽ lấy Master Deck (Tất cả từ)

    const reviewWords = await Word.find(queryInfo).limit(20);
    res.status(200).json(reviewWords);
  } catch (error) {
    res.status(500).json({ error: "Lỗi tải danh sách ôn tập" });
  }
};

import { calculateNextReview } from "../utils/srsAlgorithm.js";

export const submitReviewResult = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    const wordId = req.params.wordId as string;
    const { grade } = req.body;
    const currentUserId = req.userId as string;

    // Cập nhật bảo mật: Đảm bảo từ vựng được chấm điểm thuộc về đúng user đang đăng nhập
    const word = await Word.findOne({ _id: wordId, userId: currentUserId });

    if (!word)
      return res
        .status(404)
        .json({ error: "Không tìm thấy từ vựng hoặc không có quyền truy cập" });

    // Tính toán chỉ số Spaced Repetition mới
    const srsResult = calculateNextReview(
      grade,
      word.interval,
      word.repetition,
      word.efactor,
    );

    // Cập nhật vào DB
    word.interval = srsResult.interval;
    word.repetition = srsResult.repetition;
    word.efactor = srsResult.efactor;
    word.nextReviewDate = srsResult.nextReviewDate;

    await word.save();

    res.status(200).json({
      message: "Đã cập nhật tiến độ học",
      nextReviewDate: word.nextReviewDate,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật tiến độ" });
  }
};
