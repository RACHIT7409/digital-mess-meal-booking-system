const express = require("express");

const {
  registerStudent,
  loginUser,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginUser);

// Logged-in user profile
router.get("/me", protect, getMe);

module.exports = router;