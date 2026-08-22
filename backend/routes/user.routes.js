import express from "express";

import {
  createShareLink,
  getSharedTrip,
  disableShareLink,
} from "../controller/share.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create/regenerate share link
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

export default router;