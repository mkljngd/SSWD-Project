const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Add an expense
const addExpense = async (req, res) => {
    const { user_id, budget_id, amount, category, description, date } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO expenses (user_id, budget_id, amount, category, description, date)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, budget_id, amount, category, description, date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all expenses
const getExpenses = async (req, res) => {
    const { user_id, budget_id } = req.query;
    try {
        const result = await pool.query(
            `SELECT * FROM expenses
             WHERE ($1::uuid IS NULL OR user_id = $1)
             AND ($2::uuid IS NULL OR budget_id = $2)`,
            [user_id || null, budget_id || null]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Set a budget
const setBudget = async (req, res) => {
    const { user_id, category, amount, start_date, end_date } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO budget (user_id, category, amount, start_date, end_date)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, category, amount, start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all budgets
const getBudgets = async (req, res) => {
    const { user_id } = req.query;
    try {
        const result = await pool.query(
            `SELECT * FROM budget WHERE user_id = $1`,
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate an expense report
const generateExpenseReport = async (req, res) => {
    const { user_id, start_date, end_date } = req.query;
    try {
        const result = await pool.query(
            `SELECT category, SUM(amount) AS total_spent
             FROM expenses
             WHERE user_id = $1 AND date BETWEEN $2 AND $3
             GROUP BY category`,
            [user_id, start_date, end_date]
        );
        const totalSpent = result.rows.reduce((sum, expense) => sum + parseFloat(expense.total_spent), 0);
        res.status(200).json({ total_spent: totalSpent, expenses: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    setBudget,
    getBudgets,
    generateExpenseReport
};