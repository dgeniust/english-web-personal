import { Router } from "express";
import {
  addWord,
  getDashboardStats,
  getReviewList,
  submitReviewResult,
} from "../controllers/wordController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     summary: Lấy thống kê cho Dashboard
 *     tags:
 *       - Words
 *     responses:
 *       200:
 *         description: Trả về số lượng tổng số từ và số từ cần ôn hôm nay.
 */
router.get("/dashboard", protect, getDashboardStats);

/**
 * @openapi
 * /api/words:
 *   post:
 *     summary: Thêm từ vựng mới (Tự động fetch IPA, nghĩa)
 *     tags:
 *       - Words
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - term
 *             properties:
 *               term:
 *                 type: string
 *                 example: "example"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["toeic-part-1", "IT-terms"]
 *               type:
 *                 type: string
 *                 enum: ["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection", "phrase", "other"]
 *                 example: "noun"
 *     responses:
 *       201:
 *         description: Thêm từ vựng thành công
 */
router.post("/words", protect, addWord);

/**
 * @openapi
 * /api/words/review:
 *   get:
 *     summary: Lấy danh sách các từ đến hạn ôn tập (Spaced Repetition)
 *     tags:
 *       - Words
 *     responses:
 *       200:
 *         description: Danh sách các từ cần ôn tập
 */
router.get("/words/review", protect, getReviewList);

/**
 * @openapi
 * /api/words/{wordId}/review:
 *   post:
 *     summary: Cập nhật kết quả sau khi ôn tập (Game/Flashcard)
 *     tags:
 *       - Words
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của từ vựng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grade
 *             properties:
 *               grade:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: "Điểm đánh giá (0-2: Khó/Quên, 3: Bình thường, 4-5: Dễ)"
 *                 example: 4
 *     responses:
 *       200:
 *         description: Cập nhật tiến độ thành công
 */
router.post("/:wordId/review", protect, submitReviewResult);

export default router;
