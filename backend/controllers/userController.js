const User = require("../models/User");

const {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
} = require("../utils/validators");

// Admin creates manager/admin account
const createStaffUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian phone number",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!["manager", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be manager or admin",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: `${role} account created successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating staff user",
      error: error.message,
    });
  }
};

// Admin gets all users
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};

// Admin gets single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
      error: error.message,
    });
  }
};

// Admin updates user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["student", "manager", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Valid role is required",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating user role",
      error: error.message,
    });
  }
};

// Admin activates/deactivates user
const toggleUserActiveStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Admin should not deactivate own account by mistake
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot activate/deactivate your own account",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isActive
        ? "User account activated successfully"
        : "User account deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while changing user status",
      error: error.message,
    });
  }
};

// Student/manager/admin updates own profile
const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, hostel, roomNumber } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian phone number",
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Hostel and room number are mainly useful for students
    if (hostel) user.hostel = hostel;
    if (roomNumber) user.roomNumber = roomNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        phone: user.phone,
        hostel: user.hostel,
        roomNumber: user.roomNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};



// Logged-in user changes own password
const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while changing password",
      error: error.message,
    });
  }
};


module.exports = {
  createStaffUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserActiveStatus,
  updateMyProfile,
  changeMyPassword,
};