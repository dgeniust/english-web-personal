import mongoose, { Document, Schema } from "mongoose";

export interface IGameRecord extends Document {
  userId: mongoose.Types.ObjectId; // Liên kết với User
  gameType: string;                // Ví dụ: 'quiz', 'flash-card'
  score: number;
  duration: number;                // Thời gian chơi (giây)
  playedAt: Date;
}

const gameRecordSchema = new Schema<IGameRecord>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  gameType: { type: String, required: true },
  score: { type: Number, required: true },
  duration: { type: Number, default: 0 },
  playedAt: { type: Date, default: Date.now },
});


gameRecordSchema.index({ userId: 1, playedAt: -1 }); 
gameRecordSchema.index({ gameType: 1, score: -1 });

export default mongoose.model<IGameRecord>("GameRecord", gameRecordSchema);