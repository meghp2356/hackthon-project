import prisma from "../lib/prisma.js";

// Search and get cities
const getCities = async (req, res, next) => {
  try {
    const {
      search,
      country,
      popular,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 20, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    // Search by city or country
    if (search && search.trim()) {
      where.OR = [
        {
          city: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Filter by country
    if (country && country.trim()) {
      where.country = {
        equals: country.trim(),
        mode: "insensitive",
      };
    }

    // Filter popular cities
    if (popular !== undefined) {
      if (popular === "true") {
        where.isPopular = true;
      } else if (popular === "false") {
        where.isPopular = false;
      }
    }

    const [cities, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        orderBy: [
          {
            isPopular: "desc",
          },
          {
            city: "asc",
          },
        ],
        skip,
        take: limitNumber,
      }),

      prisma.destination.count({
        where,
      }),
    ]);

    return res.status(200).json({
      success: true,
      count: cities.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      cities,
    });
  } catch (error) {
    next(error);
  }
};

// Get one city by ID
const getCityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const city = await prisma.destination.findUnique({
      where: {
        id,
      },
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    return res.status(200).json({
      success: true,
      city,
    });
  } catch (error) {
    next(error);
  }
};

// Get popular cities
const getPopularCities = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      50
    );

    const cities = await prisma.destination.findMany({
      where: {
        isPopular: true,
      },
      orderBy: {
        city: "asc",
      },
      take: limitNumber,
    });

    return res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    next(error);
  }
};

// Get available countries
const getCountries = async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      select: {
        country: true,
      },
      distinct: ["country"],
      orderBy: {
        country: "asc",
      },
    });

    const countries = destinations.map(
      (destination) => destination.country
    );

    return res.status(200).json({
      success: true,
      count: countries.length,
      countries,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new city
const createCity = async (req, res, next) => {
  try {
    const { city, country, isPopular = false } = req.body;

    if (!city || !country) {
      return res.status(400).json({
        success: false,
        message: "City and country are required",
      });
    }

    const cityName = city.trim();
    const countryName = country.trim();

    if (!cityName || !countryName) {
      return res.status(400).json({
        success: false,
        message: "City and country cannot be empty",
      });
    }

    // Prevent duplicate city + country
    const existingCity = await prisma.destination.findFirst({
      where: {
        city: {
          equals: cityName,
          mode: "insensitive",
        },
        country: {
          equals: countryName,
          mode: "insensitive",
        },
      },
    });

    if (existingCity) {
      return res.status(409).json({
        success: false,
        message: "City already exists",
      });
    }

    const destination = await prisma.destination.create({
      data: {
        city: cityName,
        country: countryName,
        isPopular: Boolean(isPopular),
      },
    });

    return res.status(201).json({
      success: true,
      message: "City created successfully",
      city: destination,
    });
  } catch (error) {
    next(error);
  }
};

// Update a city
const updateCity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { city, country, isPopular } = req.body;

    const existingCity = await prisma.destination.findUnique({
      where: {
        id,
      },
    });

    if (!existingCity) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    const data = {};

    if (city !== undefined) {
      if (!city.trim()) {
        return res.status(400).json({
          success: false,
          message: "City cannot be empty",
        });
      }

      data.city = city.trim();
    }

    if (country !== undefined) {
      if (!country.trim()) {
        return res.status(400).json({
          success: false,
          message: "Country cannot be empty",
        });
      }

      data.country = country.trim();
    }

    if (isPopular !== undefined) {
      data.isPopular = Boolean(isPopular);
    }

    const updatedCity = await prisma.destination.update({
      where: {
        id,
      },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "City updated successfully",
      city: updatedCity,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a city
const deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingCity = await prisma.destination.findUnique({
      where: {
        id,
      },
    });

    if (!existingCity) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    await prisma.destination.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Toggle popular status
const togglePopularCity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingCity = await prisma.destination.findUnique({
      where: {
        id,
      },
    });

    if (!existingCity) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    const updatedCity = await prisma.destination.update({
      where: {
        id,
      },
      data: {
        isPopular: !existingCity.isPopular,
      },
    });

    return res.status(200).json({
      success: true,
      message: `City marked as ${
        updatedCity.isPopular ? "popular" : "not popular"
      }`,
      city: updatedCity,
    });
  } catch (error) {
    next(error);
  }
};

// Get cities by country
const getCitiesByCountry = async (req, res, next) => {
  try {
    const { country } = req.params;

    if (!country || !country.trim()) {
      return res.status(400).json({
        success: false,
        message: "Country is required",
      });
    }

    const cities = await prisma.destination.findMany({
      where: {
        country: {
          equals: country.trim(),
          mode: "insensitive",
        },
      },
      orderBy: [
        {
          isPopular: "desc",
        },
        {
          city: "asc",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: cities.length,
      country: country.trim(),
      cities,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createCity,
  getCities,
  getCityById,
  getPopularCities,
  getCountries,
  updateCity,
  deleteCity,
  togglePopularCity,
  getCitiesByCountry,
};