const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controller/user.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

// Change password
router.put("/password", protect, changePassword);

// Delete account
router.delete("/account", protect, deleteAccount);

module.exports = router;