const express = require("express");

const {
  getBudgetSummary,
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controller/budget.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Get trip budget summary
router.get(
  "/:tripId",
  protect,
  getBudgetSummary
);

// Add expense
router.post(
  "/:tripId/expenses",
  protect,
  addExpense
);

// Update expense
router.put(
  "/expenses/:expenseId",
  protect,
  updateExpense
);

// Delete expense
router.delete(
  "/expenses/:expenseId",
  protect,
  deleteExpense
);

module.exports = router;    