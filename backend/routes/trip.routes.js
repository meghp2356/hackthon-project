const express = require("express");

const {
  createTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controller/trip.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Create a new trip
router.post("/", protect, createTrip);

// Get all trips of logged-in user
router.get("/", protect, getMyTrips);

// Get one trip
router.get("/:id", protect, getTripById);

// Update trip
router.put("/:id", protect, updateTrip);

// Delete trip
router.delete("/:id", protect, deleteTrip);

module.exports = router;