import jwt from "jsonwebtoken";
import express from "express";
// Mở rộng interface Request của Express để TypeScript hiểu được req.userId
export interface AuthRequest extends express.Request {
  userId?: string;
}

interface JwtPayload {
  id: string;
}

export const protect = (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction,
): void => {
  let token;

  // Token thường được gửi trong header dưới dạng: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ error: "Không được phép truy cập, thiếu token!" });
    return; // Dừng thực thi
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // Gắn ID người dùng vào request để các Controller phía sau có thể sử dụng
    req.userId = decoded.id;

    next(); // Cho phép đi tiếp vào Controller
  } catch (error) {
    res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};
