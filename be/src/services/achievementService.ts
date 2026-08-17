// src/services/achievementService.ts

import { ACHIEVEMENT_DETAILS } from "../constants/achievements.js";
import UserAchievement from "../models/UserAchievement.js";

export const grantAchievement = async (
  userId: string,
  achievementId: string,
) => {
  try {
    // Thử tạo một record thành tựu mới cho user
    await UserAchievement.create({ userId, achievementId });

    // Nếu thành công (chưa có), trả về chi tiết thành tựu để mang đi thông báo
    return ACHIEVEMENT_DETAILS[
      achievementId as keyof typeof ACHIEVEMENT_DETAILS
    ];
  } catch (error: any) {
    // Bắt lỗi Duplicate Key của MongoDB (mã 11000) do index unique
    if (error.code === 11000) {
      return null; // User đã có thành tựu này, không làm gì cả
    }
    throw error;
  }
};
