const Booking = require("../models/Booking");
const Meal = require("../models/Meal");

const {
  normalizeDate,
  getBookingDeadline,
  getCancellationDeadline,
  isBeforeDeadline,
  hasMealStarted,
} = require("../utils/dateTimeUtils");

const { isValidDateString } = require("../utils/validators");

// Helper function to normalize date
// const normalizeDate = (date) => {
//   const newDate = new Date(date);
//   newDate.setHours(0, 0, 0, 0);
//   return newDate;
// };

// Student creates booking
const createBooking = async (req, res) => {
  try {
    const { mealId, mealDate } = req.body;

    if (!mealId || !mealDate) {
      return res.status(400).json({
        success: false,
        message: "Meal ID and meal date are required",
      });
    }

    if (!isValidDateString(mealDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal date",
      });
    }

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    if (!meal.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This meal is currently not available",
      });
    }

    const selectedDate = normalizeDate(mealDate);
    const today = normalizeDate(new Date());

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "You cannot book meal for a past date",
      });
    }

    // Allow booking only for today, tomorrow, or day after tomorrow
    const maxAllowedDate = normalizeDate(new Date());
    maxAllowedDate.setDate(maxAllowedDate.getDate() + 2);

    if (selectedDate > maxAllowedDate) {
      return res.status(400).json({
        success: false,
        message: "You can book meal only up to 2 days in advance",
      });
    }

    // Prevent booking if meal has already started
if (hasMealStarted(selectedDate, meal.startTime)) {
  return res.status(400).json({
    success: false,
    message: `${meal.mealName} booking is closed because meal time has already started`,
  });
}

// Check meal-specific booking deadline
const bookingDeadline = getBookingDeadline(
  selectedDate,
  meal.startTime,
  meal.bookingDeadlineHours
);

if (!isBeforeDeadline(bookingDeadline)) {
  return res.status(400).json({
    success: false,
    message: `Booking deadline passed for ${meal.mealName}. Last allowed booking time was ${bookingDeadline.toLocaleString(
      "en-IN"
    )}`,
  });
}

    // Check duplicate booking
    const existingBooking = await Booking.findOne({
      student: req.user._id,
      meal: mealId,
      mealDate: selectedDate,
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this meal for this date",
      });
    }

    const booking = await Booking.create({
      student: req.user._id,
      meal: meal._id,
      mealName: meal.mealName,
      mealDate: selectedDate,
      amount: meal.price,
      paymentStatus: "PENDING_PAYMENT",
      bookingStatus: "PENDING_PAYMENT",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    res.status(201).json({
      success: true,
      message: "Booking created successfully. Please complete payment.",
      booking: populatedBooking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate booking is not allowed",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating booking",
      error: error.message,
    });
  }
};

// Student gets own bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate("meal", "mealName price startTime endTime")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching your bookings",
      error: error.message,
    });
  }
};

// Admin/manager gets all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching all bookings",
      error: error.message,
    });
  }
};

// Admin/manager gets bookings by date and meal
const getBookingsByDateAndMeal = async (req, res) => {
  try {
    const { mealDate, mealName } = req.query;

    if (!mealDate) {
      return res.status(400).json({
        success: false,
        message: "Meal date is required",
      });
    }

    if (!isValidDateString(mealDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal date",
      });
    }

    const selectedDate = normalizeDate(mealDate);

    const filter = {
      mealDate: selectedDate,
    };

    if (mealName) {
      filter.mealName = mealName;
    }

    const bookings = await Booking.find(filter)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime")
      .sort({ mealName: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching filtered bookings",
      error: error.message,
    });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Student can see only own booking
    if (
      req.user.role === "student" &&
      booking.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching booking",
      error: error.message,
    });
  }
};

// Student can cancel pending payment booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can cancel only your own booking",
      });
    }

    if (booking.bookingStatus === "SERVED") {
      return res.status(400).json({
        success: false,
        message: "Served meal cannot be cancelled",
      });
    }


    const meal = await Meal.findById(booking.meal);

if (!meal) {
  return res.status(404).json({
    success: false,
    message: "Related meal not found",
  });
}

const cancellationDeadline = getCancellationDeadline(
  booking.mealDate,
  meal.startTime,
  meal.cancellationDeadlineHours
);

if (!isBeforeDeadline(cancellationDeadline)) {
  return res.status(400).json({
    success: false,
    message: `Cancellation deadline passed. Last allowed cancellation time was ${cancellationDeadline.toLocaleString(
      "en-IN"
    )}`,
  });
}



    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message:
          "Paid booking cannot be directly cancelled. Please request refund.",
      });
    }

    booking.bookingStatus = "CANCELLED";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking",
      error: error.message,
    });
  }
};

// Admin/manager marks a confirmed paid booking as not served
const markBookingNotServed = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Only paid bookings can be marked as not served",
      });
    }

    if (booking.bookingStatus === "SERVED" || booking.isServed) {
      return res.status(400).json({
        success: false,
        message: "Served booking cannot be marked as not served",
      });
    }

    if (booking.bookingStatus === "REFUNDED") {
      return res.status(400).json({
        success: false,
        message: "Refunded booking cannot be marked as not served",
      });
    }

    booking.bookingStatus = "NOT_SERVED";
    booking.notServedReason = reason || "Marked not served by manager/admin";
    booking.notServedMarkedBy = req.user._id;
    booking.notServedMarkedAt = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking marked as not served",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while marking booking as not served",
      error: error.message,
    });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingsByDateAndMeal,
  getBookingById,
  cancelBooking,
  markBookingNotServed,
};