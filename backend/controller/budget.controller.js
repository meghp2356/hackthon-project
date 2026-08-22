import prisma from "../lib/prisma.js";

// Get complete budget summary
const getBudgetSummary = async (req, res, next) => {
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

    const expenses = await prisma.expense.findMany({
      where: {
        tripId,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });

    const totalSpent = expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );

    const plannedBudget = Number(trip.plannedBudget);

    const remainingBudget = plannedBudget - totalSpent;

    // Category breakdown
    const categoryBreakdown = {};

    expenses.forEach((expense) => {
      const category = expense.category;

      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = 0;
      }

      categoryBreakdown[category] += Number(expense.amount);
    });

    return res.status(200).json({
      success: true,

      budget: {
        plannedBudget,
        totalSpent,
        remainingBudget,
        isOverBudget: totalSpent > plannedBudget,
      },

      categoryBreakdown,

      expenses,
    });
  } catch (error) {
    next(error);
  }
};


// Add expense
const addExpense = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const {
      title,
      category,
      amount,
      description,
      expenseDate,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!title || !category || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, category and amount are required",
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

    const validCategories = [
      "ACCOMMODATION",
      "TRANSPORT",
      "FOOD",
      "ACTIVITIES",
      "SHOPPING",
      "OTHER",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense category",
      });
    }

    const expenseAmount = Number(amount);

    if (
      Number.isNaN(expenseAmount) ||
      expenseAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    let parsedDate = new Date();

    if (expenseDate) {
      parsedDate = new Date(expenseDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense date",
        });
      }
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        title: title.trim(),
        category,
        amount: expenseAmount,
        description: description?.trim() || null,
        expenseDate: parsedDate,
      },
    });

    // Update spent budget
    const totalSpent = await prisma.expense.aggregate({
      where: {
        tripId,
      },
      _sum: {
        amount: true,
      },
    });

    await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        spentBudget: totalSpent._sum.amount || 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    next(error);
  }
};


// Update expense
const updateExpense = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { expenseId } = req.params;

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        trip: {
          userId,
        },
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const {
      title,
      category,
      amount,
      description,
      expenseDate,
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

    if (category !== undefined) {
      const validCategories = [
        "ACCOMMODATION",
        "TRANSPORT",
        "FOOD",
        "ACTIVITIES",
        "SHOPPING",
        "OTHER",
      ];

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense category",
        });
      }

      data.category = category;
    }

    if (amount !== undefined) {
      const expenseAmount = Number(amount);

      if (
        Number.isNaN(expenseAmount) ||
        expenseAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }

      data.amount = expenseAmount;
    }

    if (description !== undefined) {
      data.description =
        description?.trim() || null;
    }

    if (expenseDate !== undefined) {
      const date = new Date(expenseDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense date",
        });
      }

      data.expenseDate = date;
    }

    const expense = await prisma.expense.update({
      where: {
        id: expenseId,
      },
      data,
    });

    // Recalculate spent budget
    const totalSpent = await prisma.expense.aggregate({
      where: {
        tripId: existingExpense.tripId,
      },
      _sum: {
        amount: true,
      },
    });

    await prisma.trip.update({
      where: {
        id: existingExpense.tripId,
      },
      data: {
        spentBudget: totalSpent._sum.amount || 0,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    next(error);
  }
};


// Delete expense
const deleteExpense = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { expenseId } = req.params;

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        trip: {
          userId,
        },
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    // Recalculate spent budget
    const totalSpent = await prisma.expense.aggregate({
      where: {
        tripId: existingExpense.tripId,
      },
      _sum: {
        amount: true,
      },
    });

    await prisma.trip.update({
      where: {
        id: existingExpense.tripId,
      },
      data: {
        spentBudget: totalSpent._sum.amount || 0,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export {
  getBudgetSummary,
  addExpense,
  updateExpense,
  deleteExpense,
};