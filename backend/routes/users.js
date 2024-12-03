const express = require('express');
const { createUser, getAllUsers, updateUserRole } = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Create a user (Admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);

// Get all users (Admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);

// Update user role (Admin only)
router.put('/:id/role', authMiddleware, roleMiddleware(['admin']), updateUserRole);

module.exports = router;