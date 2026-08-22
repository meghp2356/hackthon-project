import prisma from "../lib/prisma.js";

// Get/search activities
const getActivities = async (req, res, next) => {
  try {
    const {
      search,
      type,
      destinationId,
      minCost,
      maxCost,
      maxDuration,
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

    // Search activity name/description
    if (search && search.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Filter by activity type
    if (type && type.trim()) {
      where.type = {
        equals: type.trim(),
        mode: "insensitive",
      };
    }

    // Filter by destination
    if (destinationId) {
      where.destinationId = destinationId;
    }

    // Minimum cost
    if (minCost !== undefined) {
      const value = Number(minCost);

      if (!Number.isNaN(value) && value >= 0) {
        where.cost = {
          ...(where.cost || {}),
          gte: value,
        };
      }
    }

    // Maximum cost
    if (maxCost !== undefined) {
      const value = Number(maxCost);

      if (!Number.isNaN(value) && value >= 0) {
        where.cost = {
          ...(where.cost || {}),
          lte: value,
        };
      }
    }

    // Maximum duration
    if (maxDuration !== undefined) {
      const value = Number(maxDuration);

      if (!Number.isNaN(value) && value > 0) {
        where.durationMinutes = {
          lte: value,
        };
      }
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          destination: true,
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: limitNumber,
      }),

      prisma.activity.count({
        where,
      }),
    ]);

    return res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      activities,
    });
  } catch (error) {
    next(error);
  }
};


// Get activity by ID
const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const activity = await prisma.activity.findUnique({
      where: {
        id,
      },
      include: {
        destination: true,
      },
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    next(error);
  }
};


// Add activity to itinerary
const addActivityToTrip = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripStopId } = req.params;

    const {
      activityId,
      activityDate,
      startTime,
      cost,
      notes,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!activityId) {
      return res.status(400).json({
        success: false,
        message: "activityId is required",
      });
    }

    // Check that the stop belongs to the logged-in user
    const tripStop = await prisma.tripStop.findFirst({
      where: {
        id: tripStopId,
        trip: {
          userId,
        },
      },
    });

    if (!tripStop) {
      return res.status(404).json({
        success: false,
        message: "Itinerary stop not found",
      });
    }

    // Check activity exists
    const activity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Prevent duplicate activity
    const existing = await prisma.tripActivity.findUnique({
      where: {
        tripStopId_activityId: {
          tripStopId,
          activityId,
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Activity is already added to this stop",
      });
    }

    const activityCost =
      cost !== undefined ? Number(cost) : Number(activity.cost);

    if (Number.isNaN(activityCost) || activityCost < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity cost",
      });
    }

    let parsedActivityDate = null;

    if (activityDate) {
      parsedActivityDate = new Date(activityDate);

      if (Number.isNaN(parsedActivityDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid activity date",
        });
      }
    }

    const tripActivity = await prisma.tripActivity.create({
      data: {
        tripStopId,
        activityId,
        activityDate: parsedActivityDate,
        startTime: startTime || null,
        cost: activityCost,
        notes: notes?.trim() || null,
      },
      include: {
        activity: true,
        tripStop: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Activity added to itinerary",
      tripActivity,
    });
  } catch (error) {
    next(error);
  }
};


// Get activities for a trip stop
const getTripStopActivities = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripStopId } = req.params;

    const tripStop = await prisma.tripStop.findFirst({
      where: {
        id: tripStopId,
        trip: {
          userId,
        },
      },
    });

    if (!tripStop) {
      return res.status(404).json({
        success: false,
        message: "Itinerary stop not found",
      });
    }

    const activities = await prisma.tripActivity.findMany({
      where: {
        tripStopId,
      },
      include: {
        activity: true,
      },
      orderBy: {
        activityDate: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    next(error);
  }
};


// Update activity in itinerary
const updateTripActivity = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripActivityId } = req.params;

    const existing = await prisma.tripActivity.findFirst({
      where: {
        id: tripActivityId,
        tripStop: {
          trip: {
            userId,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Trip activity not found",
      });
    }

    const {
      activityDate,
      startTime,
      cost,
      notes,
    } = req.body;

    const data = {};

    if (activityDate !== undefined) {
      if (activityDate === null || activityDate === "") {
        data.activityDate = null;
      } else {
        const date = new Date(activityDate);

        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid activity date",
          });
        }

        data.activityDate = date;
      }
    }

    if (startTime !== undefined) {
      data.startTime = startTime || null;
    }

    if (cost !== undefined) {
      const activityCost = Number(cost);

      if (Number.isNaN(activityCost) || activityCost < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid activity cost",
        });
      }

      data.cost = activityCost;
    }

    if (notes !== undefined) {
      data.notes = notes?.trim() || null;
    }

    const updated = await prisma.tripActivity.update({
      where: {
        id: tripActivityId,
      },
      data,
      include: {
        activity: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Trip activity updated successfully",
      tripActivity: updated,
    });
  } catch (error) {
    next(error);
  }
};


// Remove activity from itinerary
const removeActivityFromTrip = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripActivityId } = req.params;

    const existing = await prisma.tripActivity.findFirst({
      where: {
        id: tripActivityId,
        tripStop: {
          trip: {
            userId,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Trip activity not found",
      });
    }

    await prisma.tripActivity.delete({
      where: {
        id: tripActivityId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Activity removed from itinerary",
    });
  } catch (error) {
    next(error);
  }
};


export {
  getActivities,
  getActivityById,
  addActivityToTrip,
  getTripStopActivities,
  updateTripActivity,
  removeActivityFromTrip,
};