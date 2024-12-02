const express = require('express');
const {
    addInventoryItem,
    getAllInventoryItems,
    updateInventoryItem,
    deleteInventoryItem,
    getExpiringItems
} = require('../controllers/inventoryController');
const router = express.Router();

// Add a new inventory item
router.post('/', addInventoryItem);

// Get all inventory items
router.get('/', getAllInventoryItems);

// Update an inventory item
router.put('/:id', updateInventoryItem);

// Delete an inventory item
router.delete('/:id', deleteInventoryItem);

// Get expiring items
router.get('/alerts', getExpiringItems);

module.exports = router;