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

const updateMealPlan = async (req, res) => {
    const { id } = req.params; // meal_plan_id
    const { start_date, end_date, recipes } = req.body;
    const userId = req.user.user_id; // Extracted from JWT via authMiddleware
    const userRole = req.user.role; // Extracted from JWT via authMiddleware

    try {
        // Fetch the existing meal plan to validate ownership/permissions
        const mealPlanQuery = await pool.query(
            `SELECT * FROM meal_plans WHERE meal_plan_id = $1`,
            [id]
        );
        const mealPlan = mealPlanQuery.rows[0];

        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        // Role-based access control
        if (userRole !== 'admin' && mealPlan.profile_id !== userId) {
            return res.status(403).json({ message: 'Access denied: You cannot edit this meal plan' });
        }

        // Update the meal plan's details
        const updatedPlan = await pool.query(
            `UPDATE meal_plans SET start_date = $1, end_date = $2, updated_at = NOW() WHERE meal_plan_id = $3 RETURNING *`,
            [start_date, end_date, id]
        );

        // Clear existing recipes for the meal plan (if new recipes provided)
        if (recipes && recipes.length > 0) {
            await pool.query(`DELETE FROM meal_plan_recipes WHERE meal_plan_id = $1`, [id]);

            // Insert new recipes
            const recipeQueries = recipes.map(({ recipe_id, scheduled_date, meal_type }) =>
                pool.query(
                    `INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id, scheduled_date, meal_type) VALUES ($1, $2, $3, $4)`,
                    [id, recipe_id, scheduled_date, meal_type]
                )
            );
            await Promise.all(recipeQueries);
        }

        res.status(200).json({
            message: 'Meal plan updated successfully',
            updatedMealPlan: updatedPlan.rows[0],
        });
    } catch (err) {
        console.error('Error updating meal plan:', err.message);
        res.status(500).json({ error: err.message });
    }
};
// Delete a meal plan (User-specific)
const deleteMealPlan = async (req, res) => {
    const { id } = req.params; // Meal plan ID
    const userId = req.user.user_id; // User ID from JWT

    try {
        // Check if the meal plan exists and belongs to the user
        const mealPlan = await pool.query(
            `SELECT * FROM meal_plans WHERE meal_plan_id = $1 AND profile_id IN (
                SELECT profile_id FROM profiles WHERE user_id = $2
            )`,
            [id, userId]
        );

        if (mealPlan.rows.length === 0) {
            return res.status(404).json({ message: "Meal plan not found or not owned by the user" });
        }

        // Delete the meal plan
        await pool.query(`DELETE FROM meal_plans WHERE meal_plan_id = $1`, [id]);

        res.status(200).json({ message: "Meal plan deleted successfully" });
    } catch (err) {
        console.error("Error deleting meal plan:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createMealPlan,
    getMealPlans,
    addRecipeToMealPlan,
    completeMealPlan,
    updateMealPlan,
    deleteMealPlan
};