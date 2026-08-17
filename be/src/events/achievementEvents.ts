// src/events/achievementEvents.ts
import { EventEmitter } from "events";
import { grantAchievement } from "../services/achievementService.js";

export const achievementEmitter = new EventEmitter();

// Lắng nghe sự kiện (Chạy ngầm không ảnh hưởng API)
achievementEmitter.on("checkScoreAchievements", async (user) => {
  // Vì totalScore đã được cộng dồn ở schema User, ta chỉ việc check
  if (user.totalScore >= 100) {
    await grantAchievement(user._id, "SCORE_100");
  }
  if (user.highestScore >= 200) {
    await grantAchievement(user._id, "HIGH_SCORE_200");
  }
});
