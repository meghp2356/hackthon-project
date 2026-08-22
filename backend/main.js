<<<<<<< Updated upstream
require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const tripRoutes = require("./routes/trip.routes");
const itineraryRoutes = require("./routes/itinerary.routes");
const cityRoutes = require("./routes/city.routes");

=======
>>>>>>> Stashed changes
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import itineraryRoutes from "./routes/itinerary.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/cities", cityRoutes);

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Backend server is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});