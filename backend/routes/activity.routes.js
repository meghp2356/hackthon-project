const express = require("express");

const {
  getActivities,
  getActivityById,
  addActivityToTrip,
  getTripStopActivities,
  updateTripActivity,
  removeActivityFromTrip,
} = require("../controller/activity.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Search / filter activities
router.get("/", getActivities);

// Add activity to itinerary stop
router.post(
  "/stops/:tripStopId",
  protect,
  addActivityToTrip
);

// Get activities of itinerary stop
router.get(
  "/stops/:tripStopId/activities",
  protect,
  getTripStopActivities
);

// Update activity in itinerary
router.put(
  "/trip-activities/:tripActivityId",
  protect,
  updateTripActivity
);

// Remove activity from itinerary
router.delete(
  "/trip-activities/:tripActivityId",
  protect,
  removeActivityFromTrip
);

// Get one activity
router.get("/:id", getActivityById);

module.exports = router;