import express from "express";

import {
  getItinerary,
  addStop,
  updateStop,
  deleteStop,
  reorderStops,
} from "../controller/itinerary.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get complete itinerary
router.get("/:tripId", protect, getItinerary);

// Add stop
router.post("/:tripId/stops", protect, addStop);

// Update stop
router.put("/:tripId/stops/:stopId", protect, updateStop);

// Delete stop
router.delete("/:tripId/stops/:stopId", protect, deleteStop);

// Reorder stops
router.put("/:tripId/stops/reorder", protect, reorderStops);

export default router;