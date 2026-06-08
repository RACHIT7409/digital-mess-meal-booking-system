const express = require("express");

const {
  completeDummyPayment,
  getMyCoupon,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Student creates Razorpay order
router.post(
  "/razorpay/order/:bookingId",
  protect,
  authorizeRoles("student"),
  createRazorpayOrder
);

// Student verifies Razorpay payment
router.post(
  "/razorpay/verify/:bookingId",
  protect,
  authorizeRoles("student"),
  verifyRazorpayPayment
);

// Student completes dummy payment
router.patch(
  "/dummy-success/:bookingId",
  protect,
  authorizeRoles("student"),
  completeDummyPayment
);

// Student gets own QR coupon
router.get(
  "/coupon/:bookingId",
  protect,
  authorizeRoles("student"),
  getMyCoupon
);

module.exports = router;