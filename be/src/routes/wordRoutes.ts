import { Router } from "express";
import {
  addWord,
  addWordsToSingleDeck,
  getDashboardStats,
  getReviewList,
  getWords,
  submitReviewResult,
} from "../controllers/wordController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/dashboard", protect, getDashboardStats);

router.get("/", protect, getWords);

router.post("/", protect, addWord);

router.get("/review", protect, getReviewList);

router.post("/:wordId/review", protect, submitReviewResult);
router.post("/add-to-deck", protect, addWordsToSingleDeck);
export default router;
