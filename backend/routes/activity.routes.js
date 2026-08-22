import express from "express";

import {
  getActivities,
  getActivityById,
  addActivityToTrip,
  getTripStopActivities,
  updateTripActivity,
  removeActivityFromTrip,
} from "../controller/activity.controller.js";

import { protect } from "../middleware/auth.middleware.js";

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

export default router;