import express from "express";

import {
  createCity,
  getCities,
  getCityById,
  getPopularCities,
  getCountries,
  updateCity,
  deleteCity,
  togglePopularCity,
  getCitiesByCountry,
} from "../controller/city.controller.js";

const router = express.Router();

// Create city
router.post("/", createCity);

// Search / list cities
router.get("/", getCities);

// Popular cities
router.get("/popular", getPopularCities);

// Available countries
router.get("/countries", getCountries);

// Cities by country
router.get("/country/:country", getCitiesByCountry);

// Toggle popular
router.patch("/:id/popular", togglePopularCity);

// Update city
router.put("/:id", updateCity);

// Delete city
router.delete("/:id", deleteCity);

// Get one city
router.get("/:id", getCityById);

export default router;