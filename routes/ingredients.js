const express = require("express");
const {
  createIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
  getExpiringIngredients,
} = require("../controllers/ingredientsController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create a new ingredient (Admin only)
router.post("/", authMiddleware, roleMiddleware(["admin"]), createIngredient);

// Get all ingredients (Public)
router.get("/", getAllIngredients);

// Update an ingredient (Admin only)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateIngredient);

// Delete an ingredient (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteIngredient
);

// Get expiring ingredients (Authenticated users only)
router.get("/alerts", authMiddleware, getExpiringIngredients);

module.exports = router;
