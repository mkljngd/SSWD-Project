const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Add an inventory item
const addInventoryItem = async (req, res) => {
    const { profile_id, ingredient_id, quantity, unit, expiry_date, low_stock_threshold } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO inventory_items (profile_id, ingredient_id, quantity, unit, expiry_date, low_stock_threshold)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [profile_id, ingredient_id, quantity, unit, expiry_date, low_stock_threshold || 5]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fetch low-stock items
const getLowStockItems = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ii.inventory_item_id, i.name, ii.quantity, ii.unit, ii.low_stock_threshold
             FROM inventory_items ii
             JOIN ingredients i ON ii.ingredient_id = i.ingredient_id
             WHERE ii.quantity <= ii.low_stock_threshold`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all inventory items
const getAllInventoryItems = async (req, res) => {
    const { profileId } = req.params; // Pass profile_id as query parameter
    try {
        const result = await pool.query(
            `SELECT ii.*, i.name
            FROM inventory_items ii
            JOIN ingredients i ON ii.ingredient_id = i.ingredient_id
            WHERE ii.profile_id = $1
            ORDER BY ii.expiry_date ASC NULLS LAST`, 
            [profileId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an inventory item
const updateInventoryItem = async (req, res) => {
    const { id } = req.params;
    const { quantity, expiry_date } = req.body;
    try {
        const result = await pool.query(
            `UPDATE inventory_items
             SET quantity = COALESCE($1, quantity), expiry_date = COALESCE($2, expiry_date), updated_at = NOW()
             WHERE inventory_item_id = $3 RETURNING *`,
            [quantity, expiry_date, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an inventory item
const deleteInventoryItem = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(`DELETE FROM inventory_items WHERE inventory_item_id = $1`, [id]);
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get expiring items
const getExpiringItems = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ii.inventory_item_id, i.name, ii.quantity, ii.unit, ii.expiry_date
             FROM inventory_items ii
             JOIN ingredients i ON ii.ingredient_id = i.ingredient_id
             WHERE ii.expiry_date <= NOW() + INTERVAL '3 days' AND ii.quantity > 0`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addInventoryItem,
    getAllInventoryItems,
    updateInventoryItem,
    deleteInventoryItem,
    getExpiringItems,
    getLowStockItems // New method
};