import { Router } from "express";
import {
  createGameSession,
  getGameSessionDetail,
  startGameSession,
  submitGameSession,
} from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Các route liên quan đến game session
router.post("/sessions", protect, createGameSession);
router.get("/sessions/:sessionId", protect, getGameSessionDetail);
router.patch("/sessions/:sessionId/start", protect, startGameSession);
router.post("/sessions/:sessionId/submit", protect, submitGameSession);

export default router;
