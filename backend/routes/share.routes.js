const express = require("express");

const {
  createShareLink,
  getSharedTrip,
  disableShareLink,
} = require("../controller/share.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Create share link for user's trip
router.post(
  "/trips/:tripId",
  protect,
  createShareLink
);

// Public shared trip
router.get(
  "/:token",
  getSharedTrip
);

// Disable share link
router.delete(
  "/trips/:tripId",
  protect,
  disableShareLink
);

module.exports = router;