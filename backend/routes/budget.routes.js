import express from "express";

import {
  getBudgetSummary,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../controller/budget.controller.js";

import { protect } from "../middleware/auth.middleware.js";

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

export default router;