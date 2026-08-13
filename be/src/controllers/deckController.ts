import express from "express";
import Deck from "../models/Deck.js";
import Word from "../models/Word.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

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
    const deckId = req.params.id;
    const queryFilter: Record<string, any> = {
      _id: deckId,
      userId: userId,
    };
    const deck = await Deck.findOne(queryFilter);
    if (!deck) {
      res.status(404).json({ error: "Không tìm thấy kho từ" });
      return;
    }

    // Lấy tất cả từ vựng có chứa deckId này
    const wordsInDeck = await Word.find(queryFilter);

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
    const deckId = req.params.id;
    const { name, description } = req.body;
    const queryFilter: Record<string, any> = {
      _id: deckId,
      userId: userId,
    };
    const updatedDeck = await Deck.findOneAndUpdate(
      queryFilter,
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
    const deckId = req.params.id;

    const queryFilter: Record<string, any> = {
      _id: deckId,
      userId: userId,
    };

    const deck = await Deck.findOneAndDelete(queryFilter);
    if (!deck) {
      res.status(404).json({ error: "Không tìm thấy kho từ" });
      return;
    }

    // Gỡ deckId này khỏi tất cả các từ vựng đang chứa nó
    await Word.updateMany(queryFilter, { $pull: { deckIds: deckId } });

    res.status(200).json({ message: "Xóa kho từ thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa kho từ" });
  }
};
