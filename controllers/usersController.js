const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a new user (Admin only)
const createUser = async (req, res) => {
  const { username, email, password_hash, role } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password_hash, role || "user"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, username, email, role, created_at FROM users"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE user_id = $2 RETURNING user_id, username, email, role",
      [role, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUserRole,
};
