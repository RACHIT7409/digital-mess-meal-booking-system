const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
} = require("../utils/validators");

// Register student
const registerStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, phone, hostel, roomNumber, password } =
      req.body;

    if (!name || !rollNumber || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, roll number, email and password are required",
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

    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or roll number",
      });
    }

    const user = await User.create({
      name,
      rollNumber,
      email,
      phone,
      hostel,
      roomNumber,
      password,
      role: "student",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled. Contact admin.",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// Get logged-in user profile
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};

module.exports = {
  registerStudent,
  loginUser,
  getMe,
};