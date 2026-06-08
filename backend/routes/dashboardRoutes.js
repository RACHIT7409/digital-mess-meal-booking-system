const express = require("express");

const {
  getAdminDashboard,
  getManagerDashboard,
  getDateWiseReport,
  getMealWiseReport,
  getTodayBookings,
  getStudentWiseReport,
} = require("../controllers/dashboardController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only dashboard
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

// Manager/admin dashboard
router.get(
  "/manager",
  protect,
  authorizeRoles("admin", "manager"),
  getManagerDashboard
);

// Today bookings
router.get(
  "/today-bookings",
  protect,
  authorizeRoles("admin", "manager"),
  getTodayBookings
);

// Date-wise report
router.get(
  "/date-wise",
  protect,
  authorizeRoles("admin", "manager"),
  getDateWiseReport
);

// Meal-wise report
router.get(
  "/meal-wise",
  protect,
  authorizeRoles("admin", "manager"),
  getMealWiseReport
);

// Student-wise report
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin", "manager"),
  getStudentWiseReport
);

module.exports = router;