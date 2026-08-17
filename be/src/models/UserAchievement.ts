import mongoose, { Document, Schema } from "mongoose";

export interface IUserAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: string;
  unlockedAt: Date;
}

const userAchievementSchema = new Schema<IUserAchievement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  achievementId: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
});

// Đảm bảo 1 user không nhận 1 achievement 2 lần
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export default mongoose.model<IUserAchievement>(
  "UserAchievement",
  userAchievementSchema,
);
