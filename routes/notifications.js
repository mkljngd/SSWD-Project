const express = require('express');
const {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications
} = require('../controllers/notificationsController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Get all notifications (Authenticated users only)
router.get('/', authMiddleware, getAllNotifications);

// Mark a notification as read (Authenticated users only)
router.put('/:id/read', authMiddleware, markNotificationAsRead);

// Delete a notification (Authenticated users only)
router.delete('/:id', authMiddleware, deleteNotification);

// Clear all notifications (Admin only)
router.delete('/', authMiddleware, roleMiddleware(['admin']), clearAllNotifications);

module.exports = router;