const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },

    mealName: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Snacks", "Dinner"],
    },

    mealDate: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING_PAYMENT", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING_PAYMENT",
    },

razorpayOrderId: {
  type: String,
},

razorpayPaymentId: {
  type: String,
},

razorpaySignature: {
  type: String,
},



    bookingStatus: {
      type: String,
      enum: [
        "PENDING_PAYMENT",
        "CONFIRMED",
        "CANCELLED",
        "SERVED",
        "NOT_SERVED",
        "REFUND_REQUESTED",
        "REFUNDED",
      ],
      default: "PENDING_PAYMENT",
    },

    bookingTime: {
      type: Date,
      default: Date.now,
    },

    isServed: {
      type: Boolean,
      default: false,
    },

    servedAt: {
      type: Date,
    },

    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

notServedReason: {
  type: String,
  trim: true,
},

notServedMarkedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

notServedMarkedAt: {
  type: Date,
},


    qrCode: {
      type: String,
    },

    qrToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// One student cannot book same meal for same date twice
bookingSchema.index(
  {
    student: 1,
    meal: 1,
    mealDate: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);