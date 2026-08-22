import crypto from "crypto";
import prisma from "../lib/prisma.js";

// Create or regenerate a share link
const createShareLink = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
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

    const shareToken = crypto
      .randomBytes(32)
      .toString("hex");

    await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        shareToken,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Share link created successfully",
      shareToken,
      shareUrl: `/api/share/${shareToken}`,
    });
  } catch (error) {
    next(error);
  }
};

// Get shared trip
const getSharedTrip = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.params;

    const trip = await prisma.trip.findUnique({
      where: {
        shareToken: token,
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverPhoto: true,
        destinationCity: true,
        destinationCountry: true,
        startDate: true,
        endDate: true,
        plannedBudget: true,
        status: true,

        stops: {
          orderBy: {
            stopOrder: "asc",
          },

          select: {
            id: true,
            city: true,
            country: true,
            startDate: true,
            endDate: true,
            stopOrder: true,
            notes: true,

            activities: {
              include: {
                activity: true,
              },
            },
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message:
          "Shared trip not found or link is invalid",
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

// Disable sharing
const disableShareLink = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
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

    await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        shareToken: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Share link disabled successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createShareLink,
  getSharedTrip,
  disableShareLink,
};