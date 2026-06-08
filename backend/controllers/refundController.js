const Refund = require("../models/Refund");
const Booking = require("../models/Booking");
const Meal = require("../models/Meal");

const razorpayInstance = require("../config/razorpay");
const { hasMealEnded } = require("../utils/dateTimeUtils");


// Student requests refund
const requestRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Refund reason is required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can request refund only for your own booking",
      });
    }

    if (booking.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Refund can be requested only for paid bookings",
      });
    }

    if (booking.bookingStatus === "SERVED") {
      return res.status(400).json({
        success: false,
        message: "Refund cannot be requested because meal is already served",
      });
    }

    // If manager/admin has already marked NOT_SERVED, refund request is valid
// Otherwise also valid after meal end time if student claims issue


    if (booking.bookingStatus === "REFUNDED") {
      return res.status(400).json({
        success: false,
        message: "This booking is already refunded",
      });
    }



    const meal = await Meal.findById(booking.meal);

if (!meal) {
  return res.status(404).json({
    success: false,
    message: "Related meal not found",
  });
}

if (!hasMealEnded(booking.mealDate, meal.endTime)) {
  return res.status(400).json({
    success: false,
    message: `Refund can be requested only after ${meal.mealName} end time (${meal.endTime})`,
  });
}



    const existingRefund = await Refund.findOne({ booking: booking._id });

    if (existingRefund) {
      return res.status(400).json({
        success: false,
        message: "Refund request already exists for this booking",
      });
    }

    const refund = await Refund.create({
      booking: booking._id,
      student: req.user._id,
      amount: booking.amount,
      reason,
      status: "REQUESTED",
    });

    booking.bookingStatus = "REFUND_REQUESTED";
    await booking.save();

    const populatedRefund = await Refund.findById(refund._id)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate({
        path: "booking",
        populate: {
          path: "meal",
          select: "mealName price startTime endTime",
        },
      });

    res.status(201).json({
      success: true,
      message: "Refund request submitted successfully",
      refund: populatedRefund,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while requesting refund",
      error: error.message,
    });
  }
};

// Student gets own refund requests
const getMyRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find({ student: req.user._id })
      .populate({
        path: "booking",
        populate: {
          path: "meal",
          select: "mealName price startTime endTime",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: refunds.length,
      refunds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching your refunds",
      error: error.message,
    });
  }
};

// Admin/manager gets all refund requests
const getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("processedBy", "name email role")
      .populate({
        path: "booking",
        populate: {
          path: "meal",
          select: "mealName price startTime endTime",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: refunds.length,
      refunds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching refund requests",
      error: error.message,
    });
  }
};

// Admin/manager gets single refund
const getRefundById = async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("processedBy", "name email role")
      .populate({
        path: "booking",
        populate: {
          path: "meal",
          select: "mealName price startTime endTime",
        },
      });

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }

    if (
      req.user.role === "student" &&
      refund.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this refund request",
      });
    }

    res.status(200).json({
      success: true,
      refund,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching refund request",
      error: error.message,
    });
  }
};

// Admin/manager approves refund
const approveRefund = async (req, res) => {
  try {
    const { adminRemark } = req.body;

    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }

    if (refund.status !== "REQUESTED") {
      return res.status(400).json({
        success: false,
        message: `Refund cannot be approved. Current status: ${refund.status}`,
      });
    }

    const booking = await Booking.findById(refund.booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Related booking not found",
      });
    }

    if (booking.bookingStatus === "SERVED") {
      return res.status(400).json({
        success: false,
        message: "Refund cannot be approved because meal is already served",
      });
    }

    if (booking.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Only paid bookings can be refunded",
      });
    }

    if (!booking.razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay payment ID not found. This booking may be a dummy payment. Use manual refund for dummy payments.",
      });
    }

    // Create Razorpay refund
    const razorpayRefund = await razorpayInstance.payments.refund(
      booking.razorpayPaymentId,
      {
        amount: booking.amount * 100, // amount in paise
        notes: {
          bookingId: booking._id.toString(),
          refundId: refund._id.toString(),
          studentId: booking.student.toString(),
          reason: refund.reason,
        },
      }
    );

    refund.status = "APPROVED";
    refund.adminRemark = adminRemark || "Refund approved";
    refund.processedAt = new Date();
    refund.processedBy = req.user._id;
    refund.refundMethod = "RAZORPAY";
    refund.razorpayRefundId = razorpayRefund.id;
    refund.razorpayRefundStatus = razorpayRefund.status;

    booking.bookingStatus = "REFUNDED";
    booking.paymentStatus = "REFUNDED";

    await refund.save();
    await booking.save();

    const populatedRefund = await Refund.findById(refund._id)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("processedBy", "name email role")
      .populate({
        path: "booking",
        populate: {
          path: "meal",
          select: "mealName price startTime endTime",
        },
      });

    res.status(200).json({
      success: true,
      message: "Razorpay refund initiated successfully",
      razorpayRefund,
      refund: populatedRefund,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while approving Razorpay refund",
      error: error.message,
    });
  }
};

// Admin/manager rejects refund
const rejectRefund = async (req, res) => {
  try {
    const { adminRemark } = req.body;

    if (!adminRemark) {
      return res.status(400).json({
        success: false,
        message: "Admin remark is required for rejecting refund",
      });
    }

    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }

    if (refund.status !== "REQUESTED") {
      return res.status(400).json({
        success: false,
        message: `Refund cannot be rejected. Current status: ${refund.status}`,
      });
    }

    const booking = await Booking.findById(refund.booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Related booking not found",
      });
    }

    refund.status = "REJECTED";
    refund.adminRemark = adminRemark;
    refund.processedAt = new Date();
    refund.processedBy = req.user._id;

    booking.bookingStatus = "CONFIRMED";

    await refund.save();
    await booking.save();

    const populatedRefund = await Refund.findById(refund._id)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("processedBy", "name email role")
      .populate({
        path: "booking",
        populate: {
          path: "meal",
          select: "mealName price startTime endTime",
        },
      });

    res.status(200).json({
      success: true,
      message: "Refund rejected successfully",
      refund: populatedRefund,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while rejecting refund",
      error: error.message,
    });
  }
};


// Admin/manager manually approves refund for dummy payments
const approveManualRefund = async (req, res) => {
  try {
    const { adminRemark } = req.body;

    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }

    if (refund.status !== "REQUESTED") {
      return res.status(400).json({
        success: false,
        message: `Refund cannot be approved. Current status: ${refund.status}`,
      });
    }

    const booking = await Booking.findById(refund.booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Related booking not found",
      });
    }

    if (booking.bookingStatus === "SERVED") {
      return res.status(400).json({
        success: false,
        message: "Refund cannot be approved because meal is already served",
      });
    }

    if (booking.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Only paid bookings can be refunded",
      });
    }

    refund.status = "APPROVED";
    refund.adminRemark = adminRemark || "Manual refund approved";
    refund.processedAt = new Date();
    refund.processedBy = req.user._id;
    refund.refundMethod = "MANUAL";

    booking.bookingStatus = "REFUNDED";
    booking.paymentStatus = "REFUNDED";

    await refund.save();
    await booking.save();

    const populatedRefund = await Refund.findById(refund._id)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("processedBy", "name email role")
      .populate({
        path: "booking",
        populate: {
          path: "meal",
          select: "mealName price startTime endTime",
        },
      });

    res.status(200).json({
      success: true,
      message: "Manual refund approved successfully",
      refund: populatedRefund,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while approving manual refund",
      error: error.message,
    });
  }
};


module.exports = {
  requestRefund,
  getMyRefunds,
  getAllRefunds,
  getRefundById,
  approveRefund,
  approveManualRefund,
  rejectRefund,
};