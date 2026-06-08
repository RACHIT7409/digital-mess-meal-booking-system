const express = require("express");

const {
  createStaffUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserActiveStatus,
  updateMyProfile,
  changeMyPassword,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Logged-in user can update own profile
router.patch("/profile", protect, updateMyProfile);

// Logged-in user can change own password
router.patch("/change-password", protect, changeMyPassword);

// Admin creates manager/admin
router.post(
  "/staff",
  protect,
  authorizeRoles("admin"),
  createStaffUser
);

// Admin gets all users
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

// Admin gets single user
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getUserById
);

// Admin updates user role
router.patch(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);

// Admin activates/deactivates user
router.patch(
  "/:id/toggle-status",
  protect,
  authorizeRoles("admin"),
  toggleUserActiveStatus
);

module.exports = router;


