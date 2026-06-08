const Booking = require("../models/Booking");
const { generateQrToken, generateQrCode } = require("../utils/qrUtils");

const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");

// Dummy payment success
const completeDummyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only booking owner can complete payment
    if (booking.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can pay only for your own booking",
      });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cannot pay for cancelled booking",
      });
    }

    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment is already completed for this booking",
      });
    }

    const qrToken = generateQrToken();
    const qrCodeImage = await generateQrCode(qrToken);

    booking.paymentStatus = "PAID";
    booking.bookingStatus = "CONFIRMED";
    booking.qrToken = qrToken;
    booking.qrCode = qrCodeImage;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Dummy payment successful. QR coupon generated.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while completing payment",
      error: error.message,
    });
  }
};

// Student gets QR coupon for confirmed booking
const getMyCoupon = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can view only your own coupon",
      });
    }

    if (booking.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment is not completed yet",
      });
    }

    if (!booking.qrCode) {
      return res.status(400).json({
        success: false,
        message: "QR coupon not generated",
      });
    }

    res.status(200).json({
      success: true,
      coupon: {
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
  qrCode: booking.qrCode,
  qrToken: booking.qrToken,
},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching coupon",
      error: error.message,
    });
  }
};


// Create Razorpay order for a booking
const createRazorpayOrder = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("student", "name rollNumber email phone hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can pay only for your own booking",
      });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cannot pay for cancelled booking",
      });
    }

    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed for this booking",
      });
    }

    const options = {
      amount: booking.amount * 100, // Razorpay amount is in paise
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        studentId: booking.student._id.toString(),
        mealName: booking.mealName,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      order,
      key: process.env.RAZORPAY_KEY_ID,
      booking: {
        id: booking._id,
        amount: booking.amount,
        mealName: booking.mealName,
        studentName: booking.student.name,
        email: booking.student.email,
        phone: booking.student.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating Razorpay order",
      error: error.message,
    });
  }
};

// Verify Razorpay payment and generate QR
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment details are required",
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can verify payment only for your own booking",
      });
    }

    if (booking.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID does not match this booking",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay payment signature",
      });
    }

    const qrToken = generateQrToken();
    const qrCodeImage = await generateQrCode(qrToken);

    booking.paymentStatus = "PAID";
    booking.bookingStatus = "CONFIRMED";
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.qrToken = qrToken;
    booking.qrCode = qrCodeImage;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully. QR coupon generated.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while verifying Razorpay payment",
      error: error.message,
    });
  }
};


module.exports = {
  completeDummyPayment,
  getMyCoupon,
  createRazorpayOrder,
  verifyRazorpayPayment,
};