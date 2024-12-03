const express = require("express");
const {
  createRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipesController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create a recipe (Authenticated users only)
router.post("/", authMiddleware, createRecipe);

// Get all recipes (Public)
router.get("/", getAllRecipes);

// Update a recipe (Admin role only)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateRecipe);

// Delete a recipe (Admin only)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteRecipe);

module.exports = router;
