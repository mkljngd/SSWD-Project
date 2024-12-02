const express = require('express');
const {
    createMealPlan,
    getMealPlans,
    addRecipeToMealPlan,
    completeMealPlan
} = require('../controllers/mealPlansController');
const router = express.Router();

// Create a new meal plan
router.post('/', createMealPlan);

// Get all meal plans
router.get('/', getMealPlans);

// Add a recipe to a meal plan
router.post('/:id/recipes', addRecipeToMealPlan);

// Mark a meal plan as completed
router.post('/:id/complete', completeMealPlan);

module.exports = router;