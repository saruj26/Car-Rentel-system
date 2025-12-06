import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createReview,
  getReviewsByCar,
  getAverageRating,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/car/:carId", getReviewsByCar);
router.get("/car/:carId/average", getAverageRating);

export default router;
