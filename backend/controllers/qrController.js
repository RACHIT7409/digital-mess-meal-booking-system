const Booking = require("../models/Booking");

// Helper: normalize date
const normalizeDate = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Manager verifies QR coupon
const verifyQrCoupon = async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({
        success: false,
        message: "QR token is required",
      });
    }

    const booking = await Booking.findOne({ qrToken })
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR coupon",
      });
    }

    if (booking.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment is not completed for this coupon",
      });
    }

    if (booking.bookingStatus === "SERVED" || booking.isServed) {
      return res.status(400).json({
        success: false,
        message: "This QR coupon has already been used",
        bookingDetails: {
          studentName: booking.student.name,
          rollNumber: booking.student.rollNumber,
          mealName: booking.mealName,
          mealDate: booking.mealDate,
          servedAt: booking.servedAt,
        },
      });
    }

    if (booking.bookingStatus !== "CONFIRMED") {
      return res.status(400).json({
        success: false,
        message: `Coupon is not valid. Current status: ${booking.bookingStatus}`,
      });
    }

    // Check meal date
    const today = normalizeDate(new Date());
    const bookedMealDate = normalizeDate(booking.mealDate);

    if (bookedMealDate.getTime() !== today.getTime()) {
      return res.status(400).json({
        success: false,
        message: "This QR coupon is not valid for today",
        bookingDetails: {
          studentName: booking.student.name,
          rollNumber: booking.student.rollNumber,
          mealName: booking.mealName,
          bookedMealDate: booking.mealDate,
        },
      });
    }

    booking.isServed = true;
    booking.servedAt = new Date();
    booking.scannedBy = req.user._id;
    booking.bookingStatus = "SERVED";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "QR verified successfully. Meal served.",
      bookingDetails: {
        bookingId: booking._id,
        studentName: booking.student.name,
        rollNumber: booking.student.rollNumber,
        hostel: booking.student.hostel,
        roomNumber: booking.student.roomNumber,
        mealName: booking.mealName,
        mealDate: booking.mealDate,
        amount: booking.amount,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.bookingStatus,
        servedAt: booking.servedAt,
        scannedBy: req.user.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while verifying QR coupon",
      error: error.message,
    });
  }
};

// Manager checks coupon details without marking served
const checkQrCoupon = async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({
        success: false,
        message: "QR token is required",
      });
    }

    const booking = await Booking.findOne({ qrToken })
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR coupon",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon details fetched successfully",
      bookingDetails: {
        bookingId: booking._id,
        studentName: booking.student.name,
        rollNumber: booking.student.rollNumber,
        hostel: booking.student.hostel,
        roomNumber: booking.student.roomNumber,
        mealName: booking.mealName,
        mealDate: booking.mealDate,
        amount: booking.amount,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.bookingStatus,
        isServed: booking.isServed,
        servedAt: booking.servedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while checking QR coupon",
      error: error.message,
    });
  }
};

module.exports = {
  verifyQrCoupon,
  checkQrCoupon,
};