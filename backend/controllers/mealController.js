const Meal = require("../models/Meal");

const { isValidMealName } = require("../utils/validators");

// Create meal - Admin/Manager only
const createMeal = async (req, res) => {
  try {
    const {
      mealName,
      price,
      startTime,
      endTime,
      bookingDeadlineHours,
      cancellationDeadlineHours,
      description,
    } = req.body;

    if (!mealName || price === undefined || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Meal name, price, start time and end time are required",
      });
    }

    if (!isValidMealName(mealName)) {
      return res.status(400).json({
        success: false,
        message: "Meal name must be Breakfast, Lunch, Snacks, or Dinner",
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Meal price must be greater than 0",
      });
    }

    if (bookingDeadlineHours < 0 || cancellationDeadlineHours < 0) {
      return res.status(400).json({
        success: false,
        message: "Deadline hours cannot be negative",
      });
    }

    const existingMeal = await Meal.findOne({ mealName });

    if (existingMeal) {
      return res.status(400).json({
        success: false,
        message: "Meal already exists",
      });
    }

    const meal = await Meal.create({
      mealName,
      price,
      startTime,
      endTime,
      bookingDeadlineHours,
      cancellationDeadlineHours,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating meal",
      error: error.message,
    });
  }
};

// Get all meals - Admin/Manager
const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: meals.length,
      meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching meals",
      error: error.message,
    });
  }
};

// Get available meals - Student side
const getAvailableMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ isAvailable: true }).sort({
      mealName: 1,
    });

    res.status(200).json({
      success: true,
      count: meals.length,
      meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching available meals",
      error: error.message,
    });
  }
};

// Get single meal by ID
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    res.status(200).json({
      success: true,
      meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching meal",
      error: error.message,
    });
  }
};

// Update meal - Admin/Manager only
const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      meal: updatedMeal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating meal",
      error: error.message,
    });
  }
};

// Delete meal - Admin only
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    await meal.deleteOne();

    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting meal",
      error: error.message,
    });
  }
};

// Enable/disable meal - Admin/Manager only
const toggleMealAvailability = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    meal.isAvailable = !meal.isAvailable;
    await meal.save();

    res.status(200).json({
      success: true,
      message: meal.isAvailable
        ? "Meal is now available"
        : "Meal is now unavailable",
      meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while changing meal availability",
      error: error.message,
    });
  }
};

module.exports = {
  createMeal,
  getAllMeals,
  getAvailableMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  toggleMealAvailability,
};