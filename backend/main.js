<<<<<<< HEAD
require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
=======
import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
>>>>>>> b95f660 (auth comepleeeeeeee)

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

=======
// Health
>>>>>>> b95f660 (auth comepleeeeeeee)
app.get("/", (req, res) => {
  res.json({
    message: "Backend server is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});