const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// User Registration
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Fetch the user by email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!userResult.rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Fetch profiles associated with the user
        const profileResult = await pool.query(
            'SELECT profile_id FROM profiles WHERE user_id = $1',
            [user.user_id]
        );

        // Check if profiles exist
        if (!profileResult.rows.length) {
            return res.status(400).json({ message: 'No profiles associated with this user' });
        }

        // Set the first profile_id as the active profile
        const activeProfileId = profileResult.rows[0].profile_id;

        // Send response with the token, user_id, and active profile_id
        res.status(200).json({
            message: 'Login successful',
            token,
            user_id: user.user_id,
            active_profile_id: activeProfileId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user.rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ user_id: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        console.log(`Password reset link: http://localhost:${process.env.PORT}/api/auth/reset-password/${token}`);

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [hashedPassword, decoded.user_id]);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            res.status(400).json({ message: 'Reset token has expired' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

// Change Password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    try {
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (!user.rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [hashedPassword, userId]);

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword
};