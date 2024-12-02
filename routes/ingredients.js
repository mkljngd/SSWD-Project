const express = require('express');
const {
    createIngredient,
    getAllIngredients,
    updateIngredient,
    deleteIngredient,
    getExpiringIngredients
} = require('../controllers/ingredientsController');
const router = express.Router();

// Create a new ingredient
router.post('/', createIngredient);

// Get all ingredients
router.get('/', getAllIngredients);

// Update an ingredient
router.put('/:id', updateIngredient);

// Delete an ingredient
router.delete('/:id', deleteIngredient);

// Get expiring ingredients
router.get('/alerts', getExpiringIngredients);

module.exports = router;