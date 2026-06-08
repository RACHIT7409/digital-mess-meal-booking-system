const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: [true, "Refund reason is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["REQUESTED", "APPROVED", "REJECTED", "COMPLETED"],
      default: "REQUESTED",
    },

    adminRemark: {
      type: String,
      trim: true,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    processedAt: {
      type: Date,
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

razorpayRefundId: {
  type: String,
},

razorpayRefundStatus: {
  type: String,
},

refundMethod: {
  type: String,
  enum: ["MANUAL", "RAZORPAY"],
  default: "MANUAL",
},

failureReason: {
  type: String,
  trim: true,
},






  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Refund", refundSchema);