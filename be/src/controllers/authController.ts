import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { grantAchievement } from "../services/achievementService.js";
import { ACHIEVEMENT_IDS } from "../constants/achievements.js";

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Cảnh báo: JWT_SECRET chưa được cấu hình trong file .env!");
  }

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  } as SignOptions;

  return jwt.sign({ id }, secret, options);
};

export const register = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const totalUsers = await User.countDocuments();
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: "Email này đã được sử dụng!" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    let newlyUnlocked = [];

    // 3. Nếu là user đầu tiên, cấp thành tựu "FIRST_WEBSITE_USER"
    if (totalUsers === 0) {
      const achievement = await grantAchievement(
        user._id.toString(),
        ACHIEVEMENT_IDS.FIRST_WEBSITE_USER,
      );
      if (achievement) newlyUnlocked.push(achievement);
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(String(user._id)),
      unlockedAchievements: newlyUnlocked,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server khi đăng ký." });
  }
};

export const login = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Email hoặc mật khẩu không đúng!" });
      return;
    }
    let newlyUnlocked = [];

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Email hoặc mật khẩu không đúng!" });
      return;
    }
    const achievement = await grantAchievement(
      user._id.toString(),
      ACHIEVEMENT_IDS.FIRST_LOGIN,
    );
    if (achievement) newlyUnlocked.push(achievement);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(String(user._id)),
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server khi đăng nhập." });
  }
};
