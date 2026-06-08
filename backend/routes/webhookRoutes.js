const express = require("express");
const { razorpayWebhook } = require("../controllers/webhookController");

const router = express.Router();

// Razorpay needs raw body for signature verification
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

module.exports = router;