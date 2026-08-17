import mongoose, { Schema, Document, Types } from "mongoose";
export interface IGameSession extends Document {
  userId: Types.ObjectId;
  type: "quiz" | "remember-card" | "flash-card";
  words: Types.ObjectId[];
  status: "playing" | "completed" | "abandoned";
  score: number;
  startTime: Date;
  endTime: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
const gameSessionSchema = new Schema<IGameSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["quiz", "remember-card", "flash-card"],
      required: true,
    },
    words: [
      {
        type: Schema.Types.ObjectId,
        ref: "Word",
      },
    ],
    status: {
      type: String,
      enum: ["playing", "completed", "abandoned"],
      default: "playing",
    },
    score: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IGameSession>("GameSession", gameSessionSchema);
