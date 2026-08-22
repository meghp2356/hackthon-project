const prisma = require("../lib/prisma");

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


module.exports = {
  getCities,
  getCityById,
  getPopularCities,
  getCountries,
};