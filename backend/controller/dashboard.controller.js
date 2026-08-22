import prisma from "../lib/prisma.js";

const quickActions = [
  {
    id: "plan-new-trip",
    label: "Plan New Trip",
    path: "/trips/new",
  },
  {
    id: "view-my-trips",
    label: "View My Trips",
    path: "/trips",
  },
  {
    id: "explore-destinations",
    label: "Explore Destinations",
    path: "/destinations",
  },
];

const getUserIdFromRequest = (req) => {
  return req.user?.id || req.params.userId || req.query.userId || null;
};

const tripSelect = {
  id: true,
  title: true,
  description: true,
  destinationCity: true,
  destinationCountry: true,
  startDate: true,
  endDate: true,
  plannedBudget: true,
  spentBudget: true,
  status: true,
};

const destinationSelect = {
  id: true,
  city: true,
  country: true,
  description: true,
  averageBudget: true,
  imageUrl: true,
};

const formatMoney = (value) => Number(value || 0);

const getDashboard = async (req, res, next) => {
  try {
    const userId = getUserIdFromRequest(req);
    const today = new Date();

    const user = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        })
      : null;

    const tripWhere = userId ? { userId } : {};

    const [
      recentTrips,
      upcomingTrips,
      recommendedDestinations,
      budgetTotals,
    ] = await Promise.all([
      prisma.trip.findMany({
        where: tripWhere,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: tripSelect,
      }),

      prisma.trip.findMany({
        where: {
          ...tripWhere,
          startDate: {
            gte: today,
          },
          status: "PLANNED",
        },
        orderBy: { startDate: "asc" },
        take: 5,
        select: tripSelect,
      }),

      prisma.destination.findMany({
        where: { isPopular: true },
        orderBy: { city: "asc" },
        take: 6,
        select: destinationSelect,
      }),

      userId
        ? prisma.trip.aggregate({
            where: tripWhere,
            _sum: {
              plannedBudget: true,
              spentBudget: true,
            },
          })
        : Promise.resolve({
            _sum: {
              plannedBudget: 0,
              spentBudget: 0,
            },
          }),
    ]);

    const plannedBudget = formatMoney(budgetTotals._sum.plannedBudget);
    const spentBudget = formatMoney(budgetTotals._sum.spentBudget);

    res.status(200).json({
      success: true,
      message: `Welcome${user?.name ? `, ${user.name}` : ""}!`,
      user,
      recentTrips,
      upcomingTrips,
      quickActions,
      recommendedDestinations,
      budgetHighlights: {
        plannedBudget,
        spentBudget,
        remainingBudget: plannedBudget - spentBudget,
        currency: "INR",
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getDashboard,
};