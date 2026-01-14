const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// Get profile
router.get("/:id", getProfile);

// Update profile
router.put("/:id", updateProfile);

module.exports = router;
