import express from "express";
import Deck from "../models/Deck.js";
import Word from "../models/Word.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";
// Lấy danh sách tất cả các kho từ của người dùng
export const getDecks = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId as string;
    const decks = await Deck.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ error: "Lỗi tải danh sách kho từ" });
  }
};

// Tạo kho từ mới
export const createDeck = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId as string;
    const { name, description } = req.body;

    const newDeck = new Deck({ userId, name, description });
    await newDeck.save();

    res.status(201).json({ message: "Tạo kho từ thành công", deck: newDeck });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo kho từ" });
  }
};

// Xem chi tiết kho từ (Kèm danh sách từ vựng bên trong)
export const getDeckById = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId as string;
    const deckId = req.params.id as string;

    if (!deckId) {
      res.status(400).json({ error: "Thiếu ID kho từ" });
      return;
    }

    // Truy vấn Deck (tìm theo _id của Deck)
    const deck = await Deck.findOne({
      _id: deckId,
      userId: userId,
    });

    if (!deck) {
      res.status(404).json({ error: "Không tìm thấy kho từ" });
      return;
    }

    // Truy vấn Word (tìm theo trường deckIds)
    const wordsInDeck = await Word.find({
      deckIds: deckId,
      userId: userId,
    });

    res.status(200).json({
      deck,
      totalWords: wordsInDeck.length,
      words: wordsInDeck,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi tải chi tiết kho từ" });
  }
};

// Cập nhật thông tin kho từ
export const updateDeck = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId as string;
    const deckId = req.params.id as string;
    const { name, description } = req.body;

    const updatedDeck = await Deck.findOneAndUpdate(
      { _id: deckId, userId },
      { name, description },
      { new: true },
    );

    if (!updatedDeck) {
      res.status(404).json({ error: "Không tìm thấy kho từ" });
      return;
    }
    res.status(200).json({ message: "Cập nhật thành công", deck: updatedDeck });
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật kho từ" });
  }
};

// Xóa kho từ (Chỉ xóa Deck, KHÔNG xóa Word, tự động gỡ liên kết khỏi Word)
export const deleteDeck = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId as string;
    const deckId = req.params.id as string;

    const deck = await Deck.findOneAndDelete({ _id: deckId, userId });
    if (!deck) {
      res.status(404).json({ error: "Không tìm thấy kho từ" });
      return;
    }

    // Gỡ deckId khỏi mảng deckIds của Word
    await Word.updateMany(
      { deckIds: deckId, userId },
      { $pull: { deckIds: deckId } },
    );

    res.status(200).json({ message: "Xóa kho từ thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa kho từ" });
  }
};
export const getAllDesksWithWords = async (
  req: AuthRequest,
  res: express.Response,
) => {
  try {
    const userId = req.userId as string;
    const decksWithWords = await Deck.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "words",
          localField: "_id",
          foreignField: "deckIds",
          as: "words",
        },
      },
      {
        $addFields: {
          totalWords: { $size: "$words" },
        },
      },
      {
        $sort: {
          createAt: -1,
        },
      },
    ]);
    res.status(200).json({
      message: "Tải danh sách các kho từ và từ vựng thành công",
      data: decksWithWords,
    });
  } catch (error) {
    console.error("Lỗi getAllDecksWithWords:", error);
    res.status(500).json({ error: "Lỗi tải danh sách kho từ và từ vựng" });
  }
};
