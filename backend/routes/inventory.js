const express = require('express');
const {
    addInventoryItem,
    getAllInventoryItems,
    updateInventoryItem,
    deleteInventoryItem,
    getExpiringItems,
    getLowStockItems // New import
} = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Add a new inventory item (Authenticated users only)
router.post('/', authMiddleware, addInventoryItem);

// Get all inventory items (Authenticated users only)
router.get('/:profileId', authMiddleware, getAllInventoryItems);

// Update an inventory item (Authenticated users only)
router.put('/:id', authMiddleware, updateInventoryItem);

// Delete an inventory item (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteInventoryItem);

// Get expiring items (Authenticated users only)
router.get('/alerts', authMiddleware, getExpiringItems);

// Fetch low-stock items
router.get('/low-stock', authMiddleware, getLowStockItems);

module.exports = router;