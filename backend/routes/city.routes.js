const express = require("express");

const {
  getCities,
  getCityById,
  getPopularCities,
  getCountries,
} = require("../controller/city.controller");

const router = express.Router();

// Search / list cities
router.get("/", getCities);

// Popular cities
router.get("/popular", getPopularCities);

// Available countries
router.get("/countries", getCountries);

// Get one city
router.get("/:id", getCityById);

module.exports = router;