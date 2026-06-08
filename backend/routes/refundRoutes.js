const express = require("express");

const {
  requestRefund,
  getMyRefunds,
  getAllRefunds,
  getRefundById,
  approveRefund,
  approveManualRefund,
  rejectRefund,
} = require("../controllers/refundController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Student requests refund for a booking
router.post(
  "/request/:bookingId",
  protect,
  authorizeRoles("student"),
  requestRefund
);

// Student gets own refunds
router.get(
  "/my-refunds",
  protect,
  authorizeRoles("student"),
  getMyRefunds
);

// Admin/manager gets all refund requests
router.get(
  "/",
  protect,
  authorizeRoles("admin", "manager"),
  getAllRefunds
);

// Student/admin/manager gets single refund
router.get("/:id", protect, getRefundById);

// Admin/manager approves refund
router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("admin", "manager"),
  approveRefund
);

// Admin/manager manually approves dummy-payment refund
router.patch(
  "/:id/approve-manual",
  protect,
  authorizeRoles("admin", "manager"),
  approveManualRefund
);



// Admin/manager rejects refund
router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("admin", "manager"),
  rejectRefund
);

module.exports = router;