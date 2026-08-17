import { Router } from "express";
import {
  createDeck,
  getDecks,
  getDeckById,
  updateDeck,
  deleteDeck,
  getAllDesksWithWords,
} from "../controllers/deckController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect); // Bảo vệ tất cả API của deck

router.route("/").get(getDecks).post(createDeck);

router.route("/:id").get(getDeckById).put(updateDeck).delete(deleteDeck);
router.route("/with-words/storage").get(getAllDesksWithWords);
export default router;
