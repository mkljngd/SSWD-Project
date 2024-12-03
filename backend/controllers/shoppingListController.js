const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a new shopping list
const createShoppingList = async (req, res) => {
    const { user_id, meal_plan_id, status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO shopping_lists (user_id, meal_plan_id, status)
             VALUES ($1, $2, COALESCE($3, 'pending')) RETURNING *`,
            [user_id, meal_plan_id, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating shopping list:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get all shopping lists for a user
const getShoppingLists = async (req, res) => {
    const { user_id } = req.query;
    try {
        const result = await pool.query(
            `SELECT * FROM shopping_lists WHERE user_id = $1 ORDER BY created_at DESC`,
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching shopping lists:', err);
        res.status(500).json({ error: err.message });
    }
};

// Update a shopping list
const updateShoppingList = async (req, res) => {
    const { shopping_list_id } = req.params;
    const { meal_plan_id, status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE shopping_lists
             SET meal_plan_id = COALESCE($1, meal_plan_id),
                 status = COALESCE($2, status),
                 updated_at = CURRENT_TIMESTAMP
             WHERE shopping_list_id = $3 RETURNING *`,
            [meal_plan_id, status, shopping_list_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating shopping list:', err);
        res.status(500).json({ error: err.message });
    }
};

// Delete a shopping list
const deleteShoppingList = async (req, res) => {
    const { shopping_list_id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM shopping_lists WHERE shopping_list_id = $1 RETURNING *`,
            [shopping_list_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }
        res.status(200).json({ message: 'Shopping list deleted successfully' });
    } catch (err) {
        console.error('Error deleting shopping list:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createShoppingList,
    getShoppingLists,
    updateShoppingList,
    deleteShoppingList,
};