import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import mongoose from "mongoose";

// Create a review
export const createReview = async (req, res) => {
  try {
    const user = req.user;
    const { car: carId, rating, comment } = req.body;

    if (!carId || !rating) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // ensure the user has at least one confirmed booking for this car
    const booking = await Booking.findOne({
      car: carId,
      user: user._id,
      status: "confirmed",
    });

    if (!booking) {
      return res.json({
        success: false,
        message: "You must book this car before reviewing",
      });
    }

    // prevent duplicate reviews for same booking+user+car (optional)
    const existing = await Review.findOne({ car: carId, user: user._id });
    if (existing) {
      return res.json({
        success: false,
        message: "You have already reviewed this car",
      });
    }

    const review = await Review.create({
      car: carId,
      user: user._id,
      booking: booking._id,
      rating,
      comment,
    });

    return res.json({ success: true, review });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get all reviews for a car
export const getReviewsByCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const reviews = await Review.find({ car: carId }).populate(
      "user",
      "name email"
    );
    return res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get average rating for a car
export const getAverageRating = async (req, res) => {
  try {
    const { carId } = req.params;
    // validate ObjectId
    let matchId;
    try {
      matchId = new mongoose.Types.ObjectId(carId);
    } catch (e) {
      return res.json({ success: true, avgRating: 0, count: 0 });
    }

    const agg = await Review.aggregate([
      { $match: { car: matchId } },
      {
        $group: {
          _id: "$car",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = agg[0] || { avgRating: 0, count: 0 };
    const avg =
      typeof result.avgRating === "number"
        ? result.avgRating
        : Number(result.avgRating) || 0;
    const cnt = Number(result.count) || 0;
    return res.json({ success: true, avgRating: avg, count: cnt });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};
