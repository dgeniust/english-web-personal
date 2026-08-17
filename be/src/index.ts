import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
// Import router (Lưu ý: trong ESM của Node, bạn phải để đuôi .js khi import local files)
import wordRoutes from "./routes/wordRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import deckRoutes from "./routes/deckRoutes.js";
import gameSessionRoutes from "./routes/gameSessionRoutes.js";
import { swaggerSpec } from "./config/swagger.js";
import Word from "./models/Word.js";
dotenv.config();

const app = express();

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
const syncDataToCppEngine = async () => {
  try {
    const wordsFromDB = await Word.find({}, "term");
    const wordList = wordsFromDB.map((w) => w.term);
    const res = await fetch("http://localhost:8080/api/init_dictionary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words: wordList }),
    });
    if (res.ok) {
      console.log("Đã đồng bộ dữ liệu từ MongoDB sang C++ Engine thành công!");
    }
  } catch (error) {
    console.error("Lỗi khi đồng bộ dữ liệu sang C++:", error);
  }
};
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await syncDataToCppEngine();
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
app.use("/api/decks", deckRoutes);
app.use("/api/games", gameSessionRoutes);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Tìm kiếm từ vựng và tài liệu (Powered by C++ Engine)
 *     description: Chuyển tiếp truy vấn tìm kiếm sang C++ Algorithm Engine để xử lý Autocomplete (Trie), Fuzzy Search (Levenshtein) và tìm kiếm tài liệu (Inverted Index).
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Từ khóa cần tìm kiếm (Ví dụ "app", "macbook", "aple")
 *         example: "app"
 *     responses:
 *       200:
 *         description: Trả về kết quả tìm kiếm thành công từ C++ Engine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 query:
 *                   type: string
 *                   description: Từ khóa đã được chuẩn hóa.
 *                   example: "app"
 *                 cache_hit:
 *                   type: boolean
 *                   description: Trạng thái lấy dữ liệu từ LRU Cache.
 *                   example: false
 *                 is_fuzzy_search:
 *                   type: boolean
 *                   description: Trạng thái kích hoạt thuật toán sửa lỗi chính tả (Fuzzy Search).
 *                   example: false
 *                 suggestions:
 *                   type: array
 *                   description: Danh sách các từ vựng gợi ý.
 *                   items:
 *                     type: string
 *                   example: ["apple", "application", "apply"]
 *                 related_documents:
 *                   type: array
 *                   description: Danh sách tài liệu liên quan từ Inverted Index.
 *                   items:
 *                     type: string
 *                   example: ["doc1_tech.txt"]
 *                 execution_time_ms:
 *                   type: number
 *                   format: float
 *                   description: Thời gian C++ thực thi thuật toán (tính bằng mili-giây).
 *                   example: 1.25
 *       400:
 *         description: Lỗi thiếu tham số tìm kiếm (query 'q').
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Vui lòng cung cấp từ khóa tìm kiếm (query 'q')."
 *       500:
 *         description: Lỗi máy chủ hoặc C++ Engine không phản hồi (Crash/Chưa bật).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hệ thống thuật toán (C++) hiện không phản hồi."
 */
app.get("/api/search", async (req, res) => {
  const keyword = req.query.q as string;
  if (!keyword) {
    return res
      .status(400)
      .json({ error: "Vui lòng cung cấp từ khóa tìm kiếm (query 'q')." });
  }
  try {
    const cppEngineUrl = `http://localhost:8080/api/search/${encodeURIComponent(keyword)}`;
    const cppRes = await fetch(cppEngineUrl);
    if (!cppRes.ok) {
      throw new Error(`C++ Server trả về mã lỗi: ${cppRes.status}`);
    }
    const data = await cppRes.json();
    res.json(data);
  } catch (error) {
    console.error("Lỗi khi kết nối với C++ Engine:", error);
    res.status(500).json({
      error: "Hệ thống thuật toán (C++) hiện không phản hồi.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Main Backend listening on port ${PORT}`);
});
