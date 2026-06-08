const express = require("express");

const {
  verifyQrCoupon,
  checkQrCoupon,
} = require("../controllers/qrController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Manager/admin checks QR details without marking served
router.post(
  "/check",
  protect,
  authorizeRoles("admin", "manager"),
  checkQrCoupon
);

// Manager/admin verifies QR and marks meal as served
router.post(
  "/verify",
  protect,
  authorizeRoles("admin", "manager"),
  verifyQrCoupon
);

module.exports = router;