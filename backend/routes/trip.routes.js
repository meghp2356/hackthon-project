import express from "express";

import {
  createTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controller/trip.controller.js";

import { protect } from "../middleware/auth.middleware.js";

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

export default router;