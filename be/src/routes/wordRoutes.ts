import { Router } from "express";
import {
  addWord,
  getDashboardStats,
  getReviewList,
  getWords,
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về số lượng tổng số từ và số từ cần ôn hôm nay.
 */
router.get("/dashboard", protect, getDashboardStats);

/**
 * @openapi
 * /api/words:
 *   get:
 *     summary: Lấy danh sách tất cả các từ vựng
 *     tags:
 *       - Words
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang hiện tại (mặc định 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng từ trên mỗi trang (mặc định 20)
 *       - in: query
 *         name: deckId
 *         schema:
 *           type: string
 *         description: ID của bộ từ (Tùy chọn)
 *     responses:
 *       200:
 *         description: Trả về danh sách tất cả các từ vựng.
 */
router.get("/", protect, getWords);

/**
 * @openapi
 * /api/words:
 *   post:
 *     summary: Thêm từ vựng mới (Tự động fetch IPA, nghĩa)
 *     tags:
 *       - Words
 *     security:
 *       - bearerAuth: []
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
 *               meaning:
 *                 type: string
 *                 example: "Ví dụ"
 *               inputSynonyms:
 *                 type: array
 *                 items:
 *                  type: string
 *                  example: ["sample", "instance"]
 *
 *     responses:
 *       201:
 *         description: Thêm từ vựng thành công
 */
router.post("/", protect, addWord);

/**
 * @openapi
 * /api/words/review:
 *   get:
 *     summary: Lấy danh sách các từ đến hạn ôn tập (Spaced Repetition)
 *     tags:
 *       - Words
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách các từ cần ôn tập
 */
router.get("/review", protect, getReviewList);

/**
 * @openapi
 * /api/words/{wordId}/review:
 *   post:
 *     summary: Cập nhật kết quả sau khi ôn tập (Game/Flashcard)
 *     tags:
 *       - Words
 *     security:
 *       - bearerAuth: []
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
