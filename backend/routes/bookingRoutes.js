const express = require("express");

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingsByDateAndMeal,
  getBookingById,
  cancelBooking,
  markBookingNotServed,
} = require("../controllers/bookingController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Student creates booking
router.post("/", protect, authorizeRoles("student"), createBooking);

// Student gets own bookings
router.get("/my-bookings", protect, authorizeRoles("student"), getMyBookings);

// Admin/manager gets filtered bookings
router.get(
  "/filter",
  protect,
  authorizeRoles("admin", "manager"),
  getBookingsByDateAndMeal
);

// Admin/manager gets all bookings
router.get("/", protect, authorizeRoles("admin", "manager"), getAllBookings);

// Admin/manager marks booking as not served
router.patch(
  "/:id/not-served",
  protect,
  authorizeRoles("admin", "manager"),
  markBookingNotServed
);

// Student/admin/manager gets single booking
router.get("/:id", protect, getBookingById);

// Student cancels unpaid booking
router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("student"),
  cancelBooking
);

module.exports = router;