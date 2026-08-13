import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
// Import router (Lưu ý: trong ESM của Node, bạn phải để đuôi .js khi import local files)
import wordRoutes from "./routes/wordRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { swaggerSpec } from "./config/swagger.js";
dotenv.config();

const app = express();

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

app.get("/api/health", (req, res) => {
  res.json({ status: "Node.js Backend is running" });
});

// Gắn routes vào app
app.use("/api/auth", authRoutes);
app.use("/api/words", wordRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Main Backend listening on port ${PORT}`);
});
