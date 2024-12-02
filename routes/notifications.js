const express = require('express');
const {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications
} = require('../controllers/notificationsController');
const router = express.Router();

// Get all notifications
router.get('/', getAllNotifications);

// Mark a notification as read
router.put('/:id/read', markNotificationAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

// Clear all notifications
router.delete('/', clearAllNotifications);

module.exports = router;