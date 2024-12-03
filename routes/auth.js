const express = require('express');
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Registration
router.post('/register', register);

// Login
router.post('/login', login);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password/:token', resetPassword);

// Change Password
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;