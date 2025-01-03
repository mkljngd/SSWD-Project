const express = require("express");
const {
    createProfile,
    getUserProfiles,
    getActiveProfile, // New route
    updateProfile,
    deleteProfile,
    setActiveProfile,
} = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new profile
router.post("/", authMiddleware, createProfile);

// Get all profiles for a user
router.get("/:user_id", authMiddleware, getUserProfiles);

// Get active profile for a user
router.get("/:user_id/active", authMiddleware, getActiveProfile);

// Update a profile
router.put("/:profile_id", authMiddleware, updateProfile);

// Delete a profile
router.delete("/:profile_id", authMiddleware, deleteProfile);

// Set a profile as active
router.put("/:profile_id/activate", authMiddleware, setActiveProfile);

module.exports = router;