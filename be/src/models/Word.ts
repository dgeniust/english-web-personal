// src/models/Word.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IWord extends Document {
  userId: mongoose.Types.ObjectId; // BẮT BUỘC: Để tạo kho từ cha riêng biệt
  deckIds: mongoose.Types.ObjectId[]; // Liên kết nhiều kho từ con (1 từ có thể ở nhiều kho)
  term: string;
  meaning: string;
  englishMeaning?: string;
  type?: WordType;
  ipa?: string;
  audioUrl?: string;
  tags: string[];
  repetition: number;
  interval: number;
  efactor: number;
  nextReviewDate: Date;
  createdAt: Date;
}
export enum WordType {
  NOUN = "noun",
  VERB = "verb",
  ADJECTIVE = "adjective",
  ADVERB = "adverb",
  PRONOUN = "pronoun",
  PREPOSITION = "preposition",
  CONJUNCTION = "conjunction",
  INTERJECTION = "interjection",
  PHRASE = "phrase",
  OTHER = "other", // Dùng cho trường hợp ngoại lệ
}
const wordSchema = new Schema<IWord>({
  // Liên kết User
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Liên kết các Kho từ con (Deck)
  deckIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck" }],

  term: { type: String, required: true, trim: true },
  meaning: { type: String, required: true },
  englishMeaning: { type: String },
  type: {
    type: String,
    enum: Object.values(WordType), // Chỉ cho phép các giá trị nằm trong WordType
    default: WordType.NOUN,
  },
  ipa: { type: String },
  audioUrl: { type: String },
  tags: [{ type: String }],

  repetition: { type: Number, default: 0 },
  interval: { type: Number, default: 0 },
  efactor: { type: Number, default: 2.5 },
  nextReviewDate: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now },
});

// Đánh Index để tăng tốc độ query lấy Flashcard/Quiz
wordSchema.index({ userId: 1, nextReviewDate: 1 }); // Tìm nhanh các từ đến hạn ôn tập của 1 user
wordSchema.index({ deckIds: 1 }); // Tìm nhanh các từ thuộc về 1 kho con

export default mongoose.model<IWord>("Word", wordSchema);
