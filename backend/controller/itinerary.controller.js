const prisma = require("../lib/prisma");

// Get complete itinerary for a trip
const getItinerary = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check that the trip belongs to the logged-in user
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const stops = await prisma.tripStop.findMany({
      where: {
        tripId,
      },
      orderBy: {
        stopOrder: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      trip,
      stops,
    });
  } catch (error) {
    next(error);
  }
};


// Add a new stop to itinerary
const addStop = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const {
      city,
      country,
      startDate,
      endDate,
      notes,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!city || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "City, start date and end date are required",
      });
    }

    // Check trip ownership
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Find next order number
    const lastStop = await prisma.tripStop.findFirst({
      where: {
        tripId,
      },
      orderBy: {
        stopOrder: "desc",
      },
    });

    const stopOrder = lastStop
      ? lastStop.stopOrder + 1
      : 0;

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        city: city.trim(),
        country: country?.trim() || "India",
        startDate: start,
        endDate: end,
        stopOrder,
        notes: notes?.trim() || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Stop added successfully",
      stop,
    });
  } catch (error) {
    next(error);
  }
};


// Update an itinerary stop
const updateStop = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripId, stopId } = req.params;

    const existingStop = await prisma.tripStop.findFirst({
      where: {
        id: stopId,
        tripId,
        trip: {
          userId,
        },
      },
    });

    if (!existingStop) {
      return res.status(404).json({
        success: false,
        message: "Itinerary stop not found",
      });
    }

    const {
      city,
      country,
      startDate,
      endDate,
      notes,
    } = req.body;

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
      data.country = country?.trim() || "India";
    }

    if (notes !== undefined) {
      data.notes = notes?.trim() || null;
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

    const finalStartDate =
      data.startDate || existingStop.startDate;

    const finalEndDate =
      data.endDate || existingStop.endDate;

    if (finalEndDate < finalStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    const stop = await prisma.tripStop.update({
      where: {
        id: stopId,
      },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "Stop updated successfully",
      stop,
    });
  } catch (error) {
    next(error);
  }
};


// Delete a stop
const deleteStop = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripId, stopId } = req.params;

    const existingStop = await prisma.tripStop.findFirst({
      where: {
        id: stopId,
        tripId,
        trip: {
          userId,
        },
      },
    });

    if (!existingStop) {
      return res.status(404).json({
        success: false,
        message: "Itinerary stop not found",
      });
    }

    await prisma.tripStop.delete({
      where: {
        id: stopId,
      },
    });

    // Reorder remaining stops
    const remainingStops = await prisma.tripStop.findMany({
      where: {
        tripId,
      },
      orderBy: {
        stopOrder: "asc",
      },
    });

    await prisma.$transaction(
      remainingStops.map((stop, index) =>
        prisma.tripStop.update({
          where: {
            id: stop.id,
          },
          data: {
            stopOrder: index,
          },
        })
      )
    );

    return res.status(200).json({
      success: true,
      message: "Stop deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


// Reorder stops
const reorderStops = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;
    const { stopIds } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!Array.isArray(stopIds) || stopIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "stopIds must be a non-empty array",
      });
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const stops = await prisma.tripStop.findMany({
      where: {
        tripId,
      },
    });

    // Make sure every submitted stop belongs to this trip
    const existingStopIds = new Set(
      stops.map((stop) => stop.id)
    );

    const allValid = stopIds.every((id) =>
      existingStopIds.has(id)
    );

    if (!allValid || stopIds.length !== stops.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid stop order",
      });
    }

    await prisma.$transaction(
      stopIds.map((stopId, index) =>
        prisma.tripStop.update({
          where: {
            id: stopId,
          },
          data: {
            stopOrder: index,
          },
        })
      )
    );

    const updatedStops = await prisma.tripStop.findMany({
      where: {
        tripId,
      },
      orderBy: {
        stopOrder: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Stops reordered successfully",
      stops: updatedStops,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getItinerary,
  addStop,
  updateStop,
  deleteStop,
  reorderStops,
};