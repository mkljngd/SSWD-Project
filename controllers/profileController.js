const { Pool } = require("pg");
const Joi = require("joi");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Validation schema for profile creation and updates
const profileSchema = Joi.object({
    profile_name: Joi.string().max(100).required(),
    dietary_preferences: Joi.object().optional(),
});

// Create a new profile
const createProfile = async (req, res) => {
    const { error } = profileSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { user_id, profile_name, dietary_preferences } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO profiles (user_id, profile_name, dietary_preferences)
             VALUES ($1, $2, $3) RETURNING *`,
            [user_id, profile_name, dietary_preferences || {}]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating profile:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

// Get all profiles for a user
const getUserProfiles = async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM profiles WHERE user_id = $1`,
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching profiles:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

// Update a profile
const updateProfile = async (req, res) => {
    const { error } = profileSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { profile_id } = req.params;
    const { profile_name, dietary_preferences } = req.body;
    try {
        const result = await pool.query(
            `UPDATE profiles
             SET profile_name = COALESCE($1, profile_name),
                 dietary_preferences = COALESCE($2, dietary_preferences),
                 updated_at = CURRENT_TIMESTAMP
             WHERE profile_id = $3 RETURNING *`,
            [profile_name, dietary_preferences, profile_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

// Delete a profile
const deleteProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM profiles WHERE profile_id = $1 RETURNING *`,
            [profile_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (err) {
        console.error("Error deleting profile:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

// Set a profile as active
const setActiveProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        // Reset active status for all profiles of the user
        await pool.query(
            `UPDATE profiles SET is_active = false WHERE user_id = (
                SELECT user_id FROM profiles WHERE profile_id = $1
            )`,
            [profile_id]
        );

        // Set the specified profile as active
        const result = await pool.query(
            `UPDATE profiles
             SET is_active = true
             WHERE profile_id = $1 RETURNING *`,
            [profile_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error setting active profile:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

module.exports = {
    createProfile,
    getUserProfiles,
    updateProfile,
    deleteProfile,
    setActiveProfile
};