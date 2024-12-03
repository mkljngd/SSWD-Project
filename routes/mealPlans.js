const express = require("express");
const {
  createMealPlan,
  getMealPlans,
  addRecipeToMealPlan,
  completeMealPlan,
  deleteMealPlan,
  updateMealPlan,
} = require("../controllers/mealPlansController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new meal plan
router.post("/", authMiddleware, createMealPlan);

// Get all meal plans
router.get("/", authMiddleware, getMealPlans);

// Add a recipe to a meal plan
router.post("/:id/recipes", authMiddleware, addRecipeToMealPlan);

// Mark a meal plan as completed
router.post("/:id/complete", authMiddleware, completeMealPlan);

// Update a meal plan
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["user", "admin"]),
  updateMealPlan
);

// Delete a meal plan (User-specific)
router.delete("/:id", authMiddleware, deleteMealPlan);

module.exports = router;
