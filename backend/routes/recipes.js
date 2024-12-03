const express = require("express");
const {
    createRecipe,
    getAllRecipes,
    getRecipesByCuisine, 
    suggestRecipes, 
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    addFavoriteRecipe
} = require("../controllers/recipesController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create a recipe (Authenticated users only)
router.post("/", authMiddleware, createRecipe);

// Get all recipes (Public)
router.get("/", authMiddleware, getAllRecipes);

router.get('/:id', getRecipeById); // New route

// Get recipes filtered by cuisine (Public)
router.get("/cuisine/:cuisine_id",authMiddleware, getRecipesByCuisine);

// Get enhanced recipe suggestions (Authenticated users only)
router.get("/suggestions", authMiddleware, suggestRecipes);

// Update a recipe (Admin role only)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateRecipe);

// Delete a recipe (Admin only)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteRecipe);

router.post('/favorites', addFavoriteRecipe);

module.exports = router;
