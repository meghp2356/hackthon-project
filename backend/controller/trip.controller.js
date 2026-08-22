const prisma = require("../lib/prisma");

// Create Trip
const createTrip = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      title,
      description,
      coverPhoto,
      destinationCity,
      destinationCountry,
      startDate,
      endDate,
      plannedBudget,
    } = req.body;

    // Required fields
    if (!title || !destinationCity || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Title, destination city, start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date or end date",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    const budget = Number(plannedBudget || 0);

    if (budget < 0 || isNaN(budget)) {
      return res.status(400).json({
        success: false,
        message: "Invalid planned budget",
      });
    }

    const trip = await prisma.trip.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        coverPhoto: coverPhoto || null,

        destinationCity: destinationCity.trim(),
        destinationCountry:
          destinationCountry?.trim() || null,

        startDate: start,
        endDate: end,

        plannedBudget: budget,
        spentBudget: 0,

        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    next(error);
  }
};

// Get all trips of logged-in user
const getMyTrips = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const trips = await prisma.trip.findMany({
      where: {
        userId,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    next(error);
  }
};

// Get single trip
const getTripById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const trip = await prisma.trip.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    next(error);
  }
};

// Update Trip
const updateTrip = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const existingTrip = await prisma.trip.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const {
      title,
      description,
      coverPhoto,
      destinationCity,
      destinationCountry,
      startDate,
      endDate,
      plannedBudget,
      status,
    } = req.body;

    const data = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      data.title = title.trim();
    }

    if (description !== undefined) {
      data.description = description?.trim() || null;
    }

    if (coverPhoto !== undefined) {
      data.coverPhoto = coverPhoto || null;
    }

    if (destinationCity !== undefined) {
      if (!destinationCity.trim()) {
        return res.status(400).json({
          success: false,
          message: "Destination city cannot be empty",
        });
      }

      data.destinationCity = destinationCity.trim();
    }

    if (destinationCountry !== undefined) {
      data.destinationCountry =
        destinationCountry?.trim() || null;
    }

    if (startDate !== undefined) {
      const start = new Date(startDate);

      if (isNaN(start.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid start date",
        });
      }

      data.startDate = start;
    }

    if (endDate !== undefined) {
      const end = new Date(endDate);

      if (isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid end date",
        });
      }

      data.endDate = end;
    }

    // Check final date range
    const finalStartDate =
      data.startDate || existingTrip.startDate;

    const finalEndDate =
      data.endDate || existingTrip.endDate;

    if (finalEndDate < finalStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    if (plannedBudget !== undefined) {
      const budget = Number(plannedBudget);

      if (budget < 0 || isNaN(budget)) {
        return res.status(400).json({
          success: false,
          message: "Invalid planned budget",
        });
      }

      data.plannedBudget = budget;
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "PLANNED",
        "ONGOING",
        "COMPLETED",
        "CANCELLED",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid trip status",
        });
      }

      data.status = status;
    }

    const trip = await prisma.trip.update({
      where: {
        id,
      },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      trip,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Trip
const deleteTrip = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const existingTrip = await prisma.trip.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    await prisma.trip.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};