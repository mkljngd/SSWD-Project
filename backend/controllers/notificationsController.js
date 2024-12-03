const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get all notifications
const getAllNotifications = async (req, res) => {
    const { user_id } = req.query;
    try {
        const result = await pool.query(
            `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            `UPDATE notifications SET is_read = TRUE WHERE notification_id = $1`,
            [id]
        );
        res.status(200).json({ message: 'Notification marked as read successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(`DELETE FROM notifications WHERE notification_id = $1`, [id]);
        res.status(200).json({ message: 'Notification deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Clear all notifications
const clearAllNotifications = async (req, res) => {
    const { user_id } = req.query;
    try {
        await pool.query(`DELETE FROM notifications WHERE user_id = $1`, [user_id]);
        res.status(200).json({ message: 'All notifications cleared successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications
};