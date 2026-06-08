const crypto = require("crypto");
const Booking = require("../models/Booking");
const Refund = require("../models/Refund");
const { generateQrToken, generateQrCode } = require("../utils/qrUtils");

// Verify Razorpay webhook signature
const verifyWebhookSignature = (rawBody, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
};

// Razorpay webhook handler
const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Webhook signature missing",
      });
    }

    const rawBody = req.body.toString();

    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const event = JSON.parse(rawBody);

    const eventType = event.event;

    // Payment captured event
    if (eventType === "payment.captured") {
      const payment = event.payload.payment.entity;

      const bookingId = payment.notes?.bookingId;

      if (bookingId) {
        const booking = await Booking.findById(bookingId);

        if (booking && booking.paymentStatus !== "PAID") {
          const qrToken = generateQrToken();
          const qrCodeImage = await generateQrCode(qrToken);

          booking.paymentStatus = "PAID";
          booking.bookingStatus = "CONFIRMED";
          booking.razorpayPaymentId = payment.id;
          booking.razorpayOrderId = payment.order_id;
          booking.qrToken = qrToken;
          booking.qrCode = qrCodeImage;

          await booking.save();
        }
      }
    }

    // Payment failed event
    if (eventType === "payment.failed") {
      const payment = event.payload.payment.entity;

      const bookingId = payment.notes?.bookingId;

      if (bookingId) {
        const booking = await Booking.findById(bookingId);

        if (booking && booking.paymentStatus !== "PAID") {
          booking.paymentStatus = "FAILED";
          booking.bookingStatus = "PENDING_PAYMENT";

          await booking.save();
        }
      }
    }

    // Refund processed event
    if (eventType === "refund.processed") {
      const refundEntity = event.payload.refund.entity;

      const refundId = refundEntity.notes?.refundId;
      const bookingId = refundEntity.notes?.bookingId;

      if (refundId) {
        const refund = await Refund.findById(refundId);

        if (refund) {
          refund.razorpayRefundStatus = refundEntity.status;
          refund.status = "COMPLETED";

          await refund.save();
        }
      }

      if (bookingId) {
        const booking = await Booking.findById(bookingId);

        if (booking) {
          booking.paymentStatus = "REFUNDED";
          booking.bookingStatus = "REFUNDED";

          await booking.save();
        }
      }
    }

    // Refund failed event
    if (eventType === "refund.failed") {
      const refundEntity = event.payload.refund.entity;

      const refundId = refundEntity.notes?.refundId;

      if (refundId) {
        const refund = await Refund.findById(refundId);

        if (refund) {
          refund.razorpayRefundStatus = refundEntity.status;
          refund.failureReason =
            refundEntity.error_description ||
            refundEntity.failure_reason ||
            "Razorpay refund failed";

          await refund.save();
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Razorpay webhook error:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};

module.exports = {
  razorpayWebhook,
};