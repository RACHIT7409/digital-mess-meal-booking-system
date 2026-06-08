const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    mealName: {
      type: String,
      required: [true, "Meal name is required"],
      enum: ["Breakfast", "Lunch", "Snacks", "Dinner"],
    },

    price: {
      type: Number,
      required: [true, "Meal price is required"],
      min: [0, "Price cannot be negative"],
    },

    startTime: {
      type: String,
      required: [true, "Meal start time is required"],
    },

    endTime: {
      type: String,
      required: [true, "Meal end time is required"],
    },

    bookingDeadlineHours: {
      type: Number,
      default: 12,
    },

    cancellationDeadlineHours: {
      type: Number,
      default: 6,
    },

    description: {
      type: String,
      trim: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meal", mealSchema);