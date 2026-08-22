const express = require("express");

const {
  getItinerary,
  addStop,
  updateStop,
  deleteStop,
  reorderStops,
} = require("../controller/itinerary.controller");

const { protect } = require("../middleware/auth.middleware");

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

module.exports = router;