// src/models/Deck.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IDeck extends Document {
  userId: mongoose.Types.ObjectId; // Thuộc về người dùng nào
  name: string; // Tên kho từ (VD: "Vocab Toeic 2022 V1", "Từ vựng ngày 15/08")
  description?: string; // Mô tả thêm (tùy chọn)
  createdAt: Date;
}

const deckSchema = new Schema<IDeck>({
  // Liên kết chặt chẽ với bảng User
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true, trim: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Đảm bảo truy vấn nhanh khi load danh sách Deck của 1 user
deckSchema.index({ userId: 1 });

export default mongoose.model<IDeck>("Deck", deckSchema);
