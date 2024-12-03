const express = require('express');
const {
    createShoppingList,
    getShoppingLists,
    updateShoppingList,
    deleteShoppingList,
} = require('../controllers/shoppingListController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new shopping list
router.post('/', authMiddleware, createShoppingList);

// Get all shopping lists for a user
router.get('/', authMiddleware, getShoppingLists);

// Update a shopping list
router.put('/:shopping_list_id', authMiddleware, updateShoppingList);

// Delete a shopping list
router.delete('/:shopping_list_id', authMiddleware, deleteShoppingList);

module.exports = router;