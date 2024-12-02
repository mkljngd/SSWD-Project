const express = require('express');
const { createUser, getAllUsers } = require('../controllers/usersController');
const router = express.Router();

// Create a user
router.post('/', createUser);

// Get all users
router.get('/', getAllUsers);

module.exports = router;