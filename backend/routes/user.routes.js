import express from "express";

import {
  getProfile,
  updateProfile,
  checkEmailAvailability,
  getUserStats,
  getUserTrips,
  getUserExpenseSummary,
  changePassword,
  deleteAccount,
} from "../controller/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Check email availability
router.get(
  "/check-email",
  checkEmailAvailability
);

// Get profile
router.get(
  "/profile",
  protect,
  getProfile
);

// Update profile
router.put(
  "/profile",
  protect,
  updateProfile
);

// User statistics
router.get(
  "/stats",
  protect,
  getUserStats
);

// User trips
router.get(
  "/trips",
  protect,
  getUserTrips
);

// User expense summary
router.get(
  "/expenses/summary",
  protect,
  getUserExpenseSummary
);

// Change password
router.put(
  "/password",
  protect,
  changePassword
);

// Delete account
router.delete(
  "/account",
  protect,
  deleteAccount
);

export default router;