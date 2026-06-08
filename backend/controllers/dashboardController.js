const User = require("../models/User");
const Meal = require("../models/Meal");
const Booking = require("../models/Booking");
const Refund = require("../models/Refund");

// Helper function to normalize date
const normalizeDate = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Helper function to get next day
const getNextDate = (date) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
};

// Admin dashboard summary
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalManagers = await User.countDocuments({ role: "manager" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalMeals = await Meal.countDocuments();
    const activeMeals = await Meal.countDocuments({ isAvailable: true });

    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.countDocuments({ paymentStatus: "PAID" });
    const servedMeals = await Booking.countDocuments({ bookingStatus: "SERVED" });
    const pendingPaymentBookings = await Booking.countDocuments({
      paymentStatus: "PENDING_PAYMENT",
    });

    const pendingRefunds = await Refund.countDocuments({ status: "REQUESTED" });
    const approvedRefunds = await Refund.countDocuments({ status: "APPROVED" });
    const rejectedRefunds = await Refund.countDocuments({ status: "REJECTED" });

    const revenueData = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const refundedData = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "REFUNDED",
        },
      },
      {
        $group: {
          _id: null,
          totalRefundedAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalRefundedAmount =
      refundedData.length > 0 ? refundedData[0].totalRefundedAmount : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        users: {
          totalUsers,
          totalStudents,
          totalManagers,
          totalAdmins,
        },
        meals: {
          totalMeals,
          activeMeals,
        },
        bookings: {
          totalBookings,
          paidBookings,
          servedMeals,
          pendingPaymentBookings,
        },
        refunds: {
          pendingRefunds,
          approvedRefunds,
          rejectedRefunds,
          totalRefundedAmount,
        },
        revenue: {
          totalRevenue,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching admin dashboard",
      error: error.message,
    });
  }
};

// Manager dashboard summary
const getManagerDashboard = async (req, res) => {
  try {
    const today = normalizeDate(new Date());
    const tomorrow = getNextDate(today);

    const todayBookings = await Booking.countDocuments({
      mealDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const todayPaidBookings = await Booking.countDocuments({
      mealDate: {
        $gte: today,
        $lt: tomorrow,
      },
      paymentStatus: "PAID",
    });

    const todayServedMeals = await Booking.countDocuments({
      mealDate: {
        $gte: today,
        $lt: tomorrow,
      },
      bookingStatus: "SERVED",
    });

    const todayPendingMeals = await Booking.countDocuments({
      mealDate: {
        $gte: today,
        $lt: tomorrow,
      },
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
    });

    const todayRevenueData = await Booking.aggregate([
      {
        $match: {
          mealDate: {
            $gte: today,
            $lt: tomorrow,
          },
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const todayRevenue =
      todayRevenueData.length > 0 ? todayRevenueData[0].todayRevenue : 0;

    const todayMealWiseCount = await Booking.aggregate([
      {
        $match: {
          mealDate: {
            $gte: today,
            $lt: tomorrow,
          },
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: "$mealName",
          totalBookings: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          servedCount: {
            $sum: {
              $cond: [{ $eq: ["$bookingStatus", "SERVED"] }, 1, 0],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ["$bookingStatus", "CONFIRMED"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        todayBookings,
        todayPaidBookings,
        todayServedMeals,
        todayPendingMeals,
        todayRevenue,
        todayMealWiseCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching manager dashboard",
      error: error.message,
    });
  }
};

// Date-wise booking report
const getDateWiseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);
    end.setDate(end.getDate() + 1);

    const report = await Booking.aggregate([
      {
        $match: {
          mealDate: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: "$mealDate",
          totalBookings: { $sum: 1 },
          paidBookings: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PAID"] }, 1, 0],
            },
          },
          servedMeals: {
            $sum: {
              $cond: [{ $eq: ["$bookingStatus", "SERVED"] }, 1, 0],
            },
          },
          refundedBookings: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "REFUNDED"] }, 1, 0],
            },
          },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching date-wise report",
      error: error.message,
    });
  }
};

// Meal-wise booking report
const getMealWiseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      const start = normalizeDate(startDate);
      const end = normalizeDate(endDate);
      end.setDate(end.getDate() + 1);

      filter.mealDate = {
        $gte: start,
        $lt: end,
      };
    }

    const report = await Booking.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: "$mealName",
          totalBookings: { $sum: 1 },
          paidBookings: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PAID"] }, 1, 0],
            },
          },
          servedMeals: {
            $sum: {
              $cond: [{ $eq: ["$bookingStatus", "SERVED"] }, 1, 0],
            },
          },
          refundedBookings: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "REFUNDED"] }, 1, 0],
            },
          },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching meal-wise report",
      error: error.message,
    });
  }
};

// Today's detailed bookings
const getTodayBookings = async (req, res) => {
  try {
    const { mealName } = req.query;

    const today = normalizeDate(new Date());
    const tomorrow = getNextDate(today);

    const filter = {
      mealDate: {
        $gte: today,
        $lt: tomorrow,
      },
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
      message: "Server error while fetching today's bookings",
      error: error.message,
    });
  }
};

// Student-wise booking report
const getStudentWiseReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const bookings = await Booking.find({ student: studentId })
      .populate("student", "name rollNumber email hostel roomNumber")
      .populate("meal", "mealName price startTime endTime")
      .sort({ mealDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching student-wise report",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getManagerDashboard,
  getDateWiseReport,
  getMealWiseReport,
  getTodayBookings,
  getStudentWiseReport,
};