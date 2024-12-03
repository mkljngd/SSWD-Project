const express = require('express');
const { createUser, getAllUsers } = require('../controllers/usersController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Create a user (Admin Only)
router.post('/', roleMiddleware(['admin']), createUser);

// Get all users (Admin Only)
router.get('/', roleMiddleware(['admin']), getAllUsers);

module.exports = router;