const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a recipe
const createRecipe = async (req, res) => {
    const { user_id, cuisine_id, title, description, instructions, image_url } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO recipes (user_id, cuisine_id, title, description, instructions, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, cuisine_id, title, description, instructions, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a recipe
const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, instructions, image_url } = req.body;
    try {
        const result = await pool.query(
            `UPDATE recipes SET title = $1, description = $2, instructions = $3, image_url = $4, updated_at = NOW()
            WHERE recipe_id = $5 RETURNING *`,
            [title, description, instructions, image_url, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM recipes WHERE recipe_id = $1', [id]);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Suggest recipes
const suggestRecipes = async (req, res) => {
    const { ingredients, preferences } = req.query;
    try {
        const result = await pool.query(
            `SELECT recipe_id, title, description, image_url 
            FROM recipes 
            WHERE EXISTS (
                SELECT 1 FROM recipe_ingredients 
                WHERE recipe_ingredients.recipe_id = recipes.recipe_id
                AND recipe_ingredients.ingredient_id = ANY($1::uuid[])
            ) AND ($2 IS NULL OR preferences @> $2::jsonb)
            LIMIT 10`,
            [ingredients ? ingredients.split(',') : [], preferences ? JSON.stringify(preferences.split(',')) : null]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createRecipe,
    getAllRecipes,
    updateRecipe,
    deleteRecipe,
    suggestRecipes
};