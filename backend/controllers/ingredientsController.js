const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create an ingredient
const createIngredient = async (req, res) => {
    const { name, unit, category } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO ingredients (name, unit, category) VALUES ($1, $2, $3) RETURNING *`,
            [name, unit, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all ingredients
const getAllIngredients = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ingredients');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an ingredient
const updateIngredient = async (req, res) => {
    const { id } = req.params;
    const { name, unit, category } = req.body;
    try {
        const result = await pool.query(
            `UPDATE ingredients SET name = $1, unit = $2, category = $3, updated_at = NOW() WHERE ingredient_id = $4 RETURNING *`,
            [name, unit, category, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an ingredient
const deleteIngredient = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ingredients WHERE ingredient_id = $1', [id]);
        res.status(200).json({ message: 'Ingredient deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get expiring ingredients
const getExpiringIngredients = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT i.ingredient_id, i.name, ii.quantity, ii.unit, ii.expiry_date 
            FROM ingredients i 
            JOIN inventory_items ii ON i.ingredient_id = ii.ingredient_id
            WHERE ii.expiry_date <= NOW() + INTERVAL '3 days'`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createIngredient,
    getAllIngredients,
    updateIngredient,
    deleteIngredient,
    getExpiringIngredients
};