import express from "express";
import Word, { WordType } from "../models/Word.js";
import axios from "axios";
import type { AuthRequest } from "../middleware/authMiddleware.js";

import { calculateNextReview } from "../utils/srsAlgorithm.js";
import { toWordResponseDto } from "../dtos/word.dto.js";
import SynonymGroup from "../models/SynonymGroup.js";
import User from "../models/User.js";
import { grantAchievement } from "../services/achievementService.js";
export const addWord = async (req: AuthRequest, res: express.Response) => {
  try {
    const { term, tags, meaning, type, inputSynonyms } = req.body;
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
    let newWord = new Word({
      term,
      meaning,
      englishMeaning,
      type,
      ipa,
      audioUrl,
      tags: tags || [],
      deckIds: [],
      userId: currentUserId,
      textSynonyms: [],
    });
    let existingWords: any[] = [];
    if (inputSynonyms && inputSynonyms.length > 0) {
      existingWords = await Word.find({
        term: { $in: inputSynonyms },
        userId: currentUserId,
      });
      const existingTerms = existingWords.map((w) => w.term);
      const ghostSynonyms = inputSynonyms.filter(
        (t: string) => !existingTerms.includes(t),
      );
      newWord.textSynonyms = ghostSynonyms;
    }
    const pastWordsWaitingForThis = await Word.find({
      textSynonyms: term,
      userId: currentUserId,
    });
    const allRelatedWords = [...existingWords, ...pastWordsWaitingForThis];
    if (allRelatedWords.length > 0) {
      let targetGroupId = null;

      // Dò xem trong đống từ liên kết này, có từ nào đã có group chưa?
      for (const w of allRelatedWords) {
        if (w.synonymGroupId) {
          targetGroupId = w.synonymGroupId;
          break; // Lấy group đầu tiên tìm thấy
        }
      }

      const allRelatedWordIds = allRelatedWords.map((w) => w._id);
      const allIdsForGroup = [newWord._id, ...allRelatedWordIds];

      if (targetGroupId) {
        // TRƯỜNG HỢP A: Đã có group -> Nhét tất cả ID vào group cũ
        await SynonymGroup.findByIdAndUpdate(targetGroupId, {
          $addToSet: { wordIds: { $each: allIdsForGroup } },
        });

        newWord.synonymGroupId = targetGroupId;

        // Cập nhật group ID cho các từ cũ (đề phòng vài từ chưa có)
        await Word.updateMany(
          { _id: { $in: allRelatedWordIds } },
          { $set: { synonymGroupId: targetGroupId } },
        );
      } else {
        // TRƯỜNG HỢP B: Chưa có group nào -> Tạo nhóm mới hoàn toàn
        const newGroup = await SynonymGroup.create({
          userId: currentUserId,
          wordIds: allIdsForGroup,
        });

        newWord.synonymGroupId = newGroup._id;

        // Cập nhật group ID cho các từ cũ
        await Word.updateMany(
          { _id: { $in: allRelatedWordIds } },
          { $set: { synonymGroupId: newGroup._id } },
        );
      }
    }

    // 6. XÓA chữ mới ra khỏi mảng textSynonyms của các từ quá khứ
    // (Vì bây giờ chúng nó đã chính thức nhận họ hàng qua SynonymGroup rồi)
    if (pastWordsWaitingForThis.length > 0) {
      await Word.updateMany(
        { _id: { $in: pastWordsWaitingForThis.map((w) => w._id) } },
        { $pull: { textSynonyms: term } },
      );
    }

    await newWord.save();
    try {
      await fetch("http://localhost:8080/api/add_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: newWord.term }),
      });
      console.log(`Đã đồng bộ từ "${newWord}" sang C++ Engine`);
    } catch (cppError) {
      console.error("C++ Engine chưa nhận được từ mới:", cppError);
      // Lưu ý: Không ném lỗi ở đây để tránh làm hỏng luồng trả về cho người dùng
      // vì từ đã được lưu vào DB thành công rồi.
    }
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $inc: { totalWordsAdded: 1 } }, // Tăng biến đếm lên 1 với hiệu suất cực cao
      { new: true },
    );
    if (updatedUser) {
      if (updatedUser.totalWordsAdded === 100) {
        grantAchievement(currentUserId, "100_WORDS");
      } else if (updatedUser.totalWordsAdded === 200) {
        grantAchievement(currentUserId, "200_WORDS");
      }
    }
    res.status(201).json({ message: "Thêm từ vựng thành công", word: newWord });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi thêm từ vựng hoặc từ không tồn tại." });
  }
};
export const addWordsToSingleDeck = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    const userId = req.userId as string;
    const { wordIds, deckId } = req.body; // client gửi mảng wordIds và 1 deckId

    await Word.updateMany(
      { _id: { $in: wordIds }, userId: userId },
      { $addToSet: { deckIds: deckId } },
    );

    res
      .status(200)
      .json({ message: "Đã thêm danh sách từ vào kho thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống." });
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
      data: words.map(toWordResponseDto),
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
