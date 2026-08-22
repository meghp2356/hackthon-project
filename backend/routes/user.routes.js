import express from "express";

import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controller/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

// Change password
router.put("/password", protect, changePassword);

// Delete account
router.delete("/account", protect, deleteAccount);

export default router;