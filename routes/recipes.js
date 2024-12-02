const express = require('express');
const {
    createRecipe,
    getAllRecipes,
    updateRecipe,
    deleteRecipe,
    suggestRecipes
} = require('../controllers/recipesController');
const router = express.Router();

// Create a recipe
router.post('/', createRecipe);

// Get all recipes
router.get('/', getAllRecipes);

// Update a recipe
router.put('/:id', updateRecipe);

// Delete a recipe
router.delete('/:id', deleteRecipe);

// Suggest recipes
router.get('/suggestions', suggestRecipes);

module.exports = router;