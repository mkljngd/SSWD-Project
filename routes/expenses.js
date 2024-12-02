const express = require('express');
const {
    addExpense,
    getExpenses,
    setBudget,
    getBudgets,
    generateExpenseReport
} = require('../controllers/expensesController');
const router = express.Router();

// Add an expense
router.post('/', addExpense);

// Get all expenses
router.get('/', getExpenses);

// Set a budget
router.post('/budgets', setBudget);

// Get all budgets
router.get('/budgets', getBudgets);

// Generate an expense report
router.get('/report', generateExpenseReport);

module.exports = router;