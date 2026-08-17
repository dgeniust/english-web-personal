import mongoose from "mongoose";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import Word from "../models/Word.js";
import GameSession from "../models/GameSession.js";
import { z } from "zod";
import express from "express";
import GameRecord from "../models/GameRecord.js";
import type { WordResponseDto } from "../dtos/word.dto.js";
import User from "../models/User.js";
import { achievementEmitter } from "../events/achievementEvents.js";

// Schema Validation bằng Zod
const createSessionSchema = z.object({
  type: z.enum(["quiz", "remember-card", "flash-card"]),
  wordIds: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"))
    .optional(),
  isRandom: z.boolean().default(false),
  randomLimit: z.number().min(5).max(50).optional(),
});

export const createGameSession = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    // 1. Validate dữ liệu đầu vào
    const validationResult = createSessionSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: validationResult.error.issues,
      });
    }

    const { type, wordIds, isRandom, randomLimit } = validationResult.data;

    const userId = req.userId as string;

    let selectedWords: mongoose.Types.ObjectId[] = [];

    // 2. Xử lý logic chọn từ
    if (isRandom) {
      const limit = randomLimit ?? 10;

      const randomDocs = await Word.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $sample: { size: limit } },
      ]);

      selectedWords = randomDocs.map((doc: any) => doc._id);
    } else {
      if (!wordIds || wordIds.length === 0) {
        return res.status(400).json({
          message:
            "Vui lòng cung cấp danh sách từ vựng hoặc chọn chế độ random.",
        });
      }
      selectedWords = wordIds.map(
        (id: string) => new mongoose.Types.ObjectId(id),
      );
    }

    // 3. Tạo phiên trò chơi mới
    const newSession = new GameSession({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      words: selectedWords,
      status: "playing",
      startTime: new Date(),
    });

    await newSession.save();

    return res.status(201).json({
      message: "Tạo phiên trò chơi thành công",
      data: newSession,
    });
  } catch (error) {
    console.error("Lỗi khi tạo game session:", error);
    return res.status(500).json({ message: "Lỗi server nội bộ" });
  }
};
export const getGameSessionDetail = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId as string;

    const session = await GameSession.findOne({
      _id: sessionId as string,
      userId: userId,
    }).populate("words");

    if (!session) {
      return res.status(404).json({ message: "Không tìm thấy phiên trò chơi" });
    }

    // 2. Chuyển session thành plain object và map lại danh sách words
    const sessionObj = session.toObject();

    const formattedWords: WordResponseDto[] = (sessionObj.words as any[]).map(
      (word) => ({
        id: word._id,
        term: word.term,
        meaning: word.meaning,
        type: word.type,
        ipa: word.ipa,
        audioUrl: word.audioUrl,
        englishMeaning: word.englishMeaning,
        tags: word.tags,
        nextReviewDate: word.nextReviewDate,
      }),
    );

    // 3. Trả về object session với words đã được rút gọn
    return res.status(200).json({
      data: {
        ...sessionObj,
        words: formattedWords,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết game session:", error);
    return res.status(500).json({ message: "Lỗi server nội bộ" });
  }
};

// --- 2. BẮT ĐẦU TRÒ CHƠI ---
// API này giúp cập nhật lại startTime chính xác ngay khi user bấm "Play" trên UI
export const startGameSession = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    const { sessionId } = req.params;
    // const sessionId = (await GameSession.findById(sessionIdParams)) as string;
    const userId = req.userId as string;

    const session = await GameSession.findOne({
      _id: sessionId as string,
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("words");

    if (!session) {
      return res.status(404).json({ message: "Không tìm thấy phiên trò chơi" });
    }

    if (session.status !== "playing") {
      return res
        .status(400)
        .json({ message: "Trò chơi này đã kết thúc hoặc bị hủy" });
    }

    // Cập nhật lại thời gian bắt đầu
    session.startTime = new Date();
    await session.save();

    return res.status(200).json({
      message: "Bắt đầu trò chơi",
      data: session,
    });
  } catch (error) {
    console.error("Lỗi khi bắt đầu game:", error);
    return res.status(500).json({ message: "Lỗi server nội bộ" });
  }
};

// --- 3. KẾT THÚC TRÒ CHƠI & LƯU RECORD ---
const submitSessionSchema = z.object({
  score: z.number().min(0, "Điểm số không được âm"),
});

export const submitGameSession = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId as string;
    if (!sessionId || !userId) {
      return res.status(400).json({
        message: "Thiếu thông tin sessionId hoặc người dùng chưa xác thực",
      });
    }
    // Validate body (client gửi điểm số lên)
    const validationResult = submitSessionSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: validationResult.error.issues,
      });
    }

    const { score } = validationResult.data;

    const session = await GameSession.findOne({
      _id: sessionId as string,
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("words");

    if (!session) {
      return res.status(404).json({ message: "Không tìm thấy phiên trò chơi" });
    }

    if (session.status === "completed") {
      return res
        .status(400)
        .json({ message: "Trò chơi này đã được nộp bài trước đó" });
    }

    // Tính toán thời gian
    const endTime = new Date();
    // Tính duration bằng giây (Math.floor để làm tròn xuống)
    const durationInSeconds = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / 1000,
    );

    // Cập nhật session: Trạng thái, điểm, thời gian kết thúc
    session.status = "completed";
    session.score = score;
    session.endTime = endTime;
    await session.save();

    // Tạo record lưu lịch sử học tập / bảng xếp hạng
    const gameRecord = new GameRecord({
      userId: session.userId,
      gameType: session.type, // Map type từ session
      score: score,
      duration: durationInSeconds,
      playedAt: endTime,
    });
    await gameRecord.save();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { totalScore: score },
      },
      { new: true },
    );
    achievementEmitter.emit("checkScoreAchievements", updatedUser);
    return res.status(200).json({
      message: "Nộp bài thành công",
      data: {
        session,
        record: gameRecord,
      },
    });
  } catch (error) {
    console.error("Lỗi khi nộp bài:", error);
    return res.status(500).json({ message: "Lỗi server nội bộ" });
  }
};
