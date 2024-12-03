const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a recipe
const createRecipe = async (req, res) => {
  const { user_id, cuisine_id, title, description, instructions, image_url } =
    req.body;
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
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT 
                recipes.recipe_id, 
                recipes.user_id, 
                cuisines.name AS cuisine, 
                recipes.title, 
                recipes.description, 
                recipes.instructions, 
                recipes.image_url, 
                recipes.source_url, 
                recipes.preparation_time, 
                recipes.rating, 
                recipes.created_at, 
                recipes.updated_at
            FROM recipes
            JOIN cuisines ON recipes.cuisine_id = cuisines.cuisine_id
            ORDER BY recipes.title ASC 
            LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    const totalRecipes = await pool.query(`SELECT COUNT(*) FROM recipes`);
    const totalPages = Math.ceil(totalRecipes.rows[0].count / limit);

    res.status(200).json({
      recipes: result.rows,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get a recipe by ID
const getRecipeById = async (req, res) => {
  const { id } = req.params; // Extract recipe_id from URL parameters
  const { profile_id } = req.query; // Extract profile_id from query parameters

  try {
    // Query to fetch recipe details
    const recipeQuery = `
      SELECT 
        recipes.recipe_id, 
        recipes.user_id, 
        cuisines.name AS cuisine, 
        recipes.title, 
        recipes.description, 
        recipes.instructions, 
        recipes.image_url, 
        recipes.source_url, 
        recipes.preparation_time, 
        recipes.rating, 
        recipes.created_at, 
        recipes.updated_at
      FROM recipes
      JOIN cuisines ON recipes.cuisine_id = cuisines.cuisine_id
      WHERE recipes.recipe_id = $1
    `;

    const recipeResult = await pool.query(recipeQuery, [id]);

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the recipe is a favorite of the user
    const favoriteQuery = `
      SELECT 1 
      FROM favorite_recipes 
      WHERE profile_id = $1 AND recipe_id = $2
    `;

    const favoriteResult = await pool.query(favoriteQuery, [profile_id, id]);
    const isFavorite = favoriteResult.rows.length > 0;

    // Include the `is_favorite` field in the response
    const recipe = {
      ...recipeResult.rows[0],
      is_favorite: isFavorite,
    };
    console.log("SENDING", recipe)

    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get recipes filtered by cuisine
const getRecipesByCuisine = async (req, res) => {
  const { cuisine_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM recipes WHERE cuisine_id = $1`,
      [cuisine_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const suggestRecipes = async (req, res) => {
  const { user_id } = req.query;
  try {
    // Fetch user's dietary preferences
    const { rows: profiles } = await pool.query(
      `SELECT dietary_preferences FROM profiles WHERE user_id = $1 AND is_active = true`,
      [user_id]
    );
    if (profiles.length === 0) {
      return res
        .status(400)
        .json({ message: "No active profile found for user" });
    }

    const { vegetarian, vegan, allergies } =
      profiles[0].dietary_preferences || {};

    // Build query filters based on dietary preferences
    const filters = [];
    if (vegetarian) filters.push(`recipes.is_vegetarian = true`);
    if (vegan) filters.push(`recipes.is_vegan = true`);
    if (allergies && allergies.length > 0) {
      filters.push(
        `NOT EXISTS (
                    SELECT 1 FROM recipe_ingredients ri
                    JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
                    WHERE ri.recipe_id = recipes.recipe_id AND i.name = ANY($1)
                )`
      );
    }

    const query = `
            SELECT DISTINCT recipes.*
            FROM recipes
            LEFT JOIN recipe_ingredients ri ON recipes.recipe_id = ri.recipe_id
            LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
            WHERE ${filters.length > 0 ? filters.join(" AND ") : "1=1"}
            LIMIT 10
        `;

    const result = await pool.query(query, allergies ? [allergies] : []);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, instructions, image_url, cuisine_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE recipes 
             SET title = $1, description = $2, instructions = $3, image_url = $4, cuisine_id = $5, updated_at = NOW()
             WHERE recipe_id = $6 RETURNING *`,
      [title, description, instructions, image_url, cuisine_id, id]
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
    await pool.query("DELETE FROM recipes WHERE recipe_id = $1", [id]);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addFavoriteRecipe = async (req, res) => {
  const { profile_id, recipe_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO favorite_recipes (profile_id, recipe_id) VALUES ($1, $2)`,
      [profile_id, recipe_id]
    );

    res.status(201).json({ message: "Recipe added to favorites successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get favorite recipes of a profile
const getFavoriteRecipes = async (req, res) => {
  const { profile_id, page = 1, limit = 10 } = req.query; // Pass profile_id as query parameter
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT 
                recipes.recipe_id, 
                recipes.user_id, 
                cuisines.name AS cuisine, 
                recipes.title, 
                recipes.description, 
                recipes.instructions, 
                recipes.image_url, 
                recipes.source_url, 
                recipes.preparation_time, 
                recipes.rating, 
                recipes.created_at, 
                recipes.updated_at
            FROM favorite_recipes
            JOIN recipes ON favorite_recipes.recipe_id = recipes.recipe_id
            JOIN cuisines ON recipes.cuisine_id = cuisines.cuisine_id
            WHERE favorite_recipes.profile_id = $1
            LIMIT $2 OFFSET $3`,
      [profile_id, parseInt(limit), parseInt(offset)]
    );

    const totalFavorites = await pool.query(
      `SELECT COUNT(*) FROM favorite_recipes WHERE profile_id = $1`,
      [profile_id]
    );
    const totalPages = Math.ceil(totalFavorites.rows[0].count / limit);

    res.status(200).json({
      recipes: result.rows,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const removeFavoriteRecipe = async (req, res) => {
  const { profile_id, recipe_id } = req.body;
  try {
    const result = await pool.query(
      `DELETE FROM favorite_recipes WHERE profile_id = $1 AND recipe_id = $2`,
      [profile_id, recipe_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Favorite recipe not found" });
    }

    res.status(200).json({ message: "Recipe removed from favorites successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipesByCuisine,
  suggestRecipes,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  addFavoriteRecipe,
  getFavoriteRecipes,
  removeFavoriteRecipe,
};