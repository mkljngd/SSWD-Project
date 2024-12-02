const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a meal plan
const createMealPlan = async (req, res) => {
    const { profile_id, start_date, end_date } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO meal_plans (profile_id, start_date, end_date) VALUES ($1, $2, $3) RETURNING *`,
            [profile_id, start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all meal plans
const getMealPlans = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM meal_plans');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a recipe to a meal plan
const addRecipeToMealPlan = async (req, res) => {
    const { id } = req.params; // meal_plan_id
    const { recipe_id, scheduled_date, meal_type } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id, scheduled_date, meal_type)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id, recipe_id, scheduled_date, meal_type]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark a meal plan as completed
const completeMealPlan = async (req, res) => {
    const { id } = req.params; // meal_plan_id
    try {
        // Fetch recipes in the meal plan
        const recipes = await pool.query(
            `SELECT recipe_id FROM meal_plan_recipes WHERE meal_plan_id = $1`,
            [id]
        );

        // Update inventory based on recipes (pseudo code, logic depends on your schema)
        for (const recipe of recipes.rows) {
            // Fetch recipe ingredients and deduct from inventory
            const ingredients = await pool.query(
                `SELECT ingredient_id, quantity FROM recipe_ingredients WHERE recipe_id = $1`,
                [recipe.recipe_id]
            );

            for (const ingredient of ingredients.rows) {
                await pool.query(
                    `UPDATE inventory_items
                     SET quantity = quantity - $1
                     WHERE ingredient_id = $2 AND quantity >= $1`,
                    [ingredient.quantity, ingredient.ingredient_id]
                );
            }
        }

        res.status(200).json({ message: 'Meal plan marked as completed, inventory updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createMealPlan,
    getMealPlans,
    addRecipeToMealPlan,
    completeMealPlan
};