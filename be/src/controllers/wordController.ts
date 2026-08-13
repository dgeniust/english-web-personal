import express from "express";
import Word, { WordType } from "../models/Word.js";
import axios from "axios";
import type { AuthRequest } from "../middleware/authMiddleware.js";

import { calculateNextReview } from "../utils/srsAlgorithm.js";
export const addWord = async (req: AuthRequest, res: express.Response) => {
  try {
    const { term, tags, deckIds, meaning, type } = req.body;
    const currentUserId = req.userId as string;
    let ipa = "";
    let englishMeaning = "";

    try {
      const dictResponse = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`,
      );
      const dictData = dictResponse.data[0];
      ipa =
        dictData.phonetics.find((p: { text: string }) => p.text)?.text || "";
      englishMeaning = dictData.meanings[0].definitions[0].definition;
    } catch (err) {
      console.warn(`Từ điển không tìm thấy dữ liệu cho từ "${term}".`);
    }
    const audioUrl = "https://your-storage.com/audio/sample.mp3"; // Mock URL

    // Lưu vào Database với ID người dùng
    const newWord = new Word({
      term,
      meaning,
      englishMeaning,
      type,
      ipa,
      audioUrl,
      tags: tags || [],
      deckIds: deckIds || [],
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
export const getWords = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId as string;
    const deckId = req.query.deckId as string | undefined;

    // 1. Nhận tham số phân trang từ query, gán giá trị mặc định nếu không truyền
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // 2. Tính toán số bản ghi cần bỏ qua (skip)
    const skip = (page - 1) * limit;

    const queryInfo: Record<string, any> = { userId };

    // Nếu có truyền ?deckId=... thì chỉ lấy từ trong kho đó
    if (deckId) {
      queryInfo.deckIds = deckId;
    }

    // 3. Chạy song song 2 Promise: Lấy dữ liệu và Đếm tổng số để tăng hiệu năng
    const [words, totalItems] = await Promise.all([
      Word.find(queryInfo)
        .sort({ createdAt: -1 })
        .skip(skip) // Bỏ qua các bản ghi của trang trước
        .limit(limit), // Giới hạn số lượng trả về

      Word.countDocuments(queryInfo), // Đếm tổng số bản ghi thỏa điều kiện
    ]);

    // 4. Tính tổng số trang
    const totalPages = Math.ceil(totalItems / limit);

    // 5. Trả về format chuẩn bao gồm data và metadata phân trang
    res.status(200).json({
      data: words,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi tải danh sách từ vựng" });
  }
};
export const updateWord = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId as string;
    const wordId = req.params.wordId;
    const updateData = req.body;
    const queryFilter: Record<string, any> = {
      _id: wordId,
      userId: userId,
    };
    const updateWord = await Word.findOneAndUpdate(queryFilter, updateData, {
      new: true,
    });
    if (!updateWord) {
      res.status(404).json({ error: "Không tìm thấy từ vựng" });
      return;
    }
    res
      .status(200)
      .json({ message: "Cập nhật từ vựng thành công", word: updateWord });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi cập nhật từ vựng" });
  }
};
export const deleteWord = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId as string;
    const wordId = req.params.id;
    const queryFilter: Record<string, any> = {
      _id: wordId,
      userId: userId,
    };
    const deletedWord = await Word.findOneAndDelete(queryFilter);

    if (!deletedWord) {
      res.status(404).json({ error: "Không tìm thấy từ vựng" });
      return;
    }

    res.status(200).json({ message: "Xóa từ vựng thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa từ vựng" });
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
