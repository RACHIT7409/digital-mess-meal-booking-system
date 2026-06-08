const express = require("express");

const {
  createMeal,
  getAllMeals,
  getAvailableMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  toggleMealAvailability,
} = require("../controllers/mealController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Student route
router.get("/available", protect, getAvailableMeals);

// Admin/Manager routes
router.post("/", protect, authorizeRoles("admin", "manager"), createMeal);

router.get("/", protect, authorizeRoles("admin", "manager"), getAllMeals);

router.get("/:id", protect, getMealById);

router.put("/:id", protect, authorizeRoles("admin", "manager"), updateMeal);

router.patch(
  "/:id/toggle-availability",
  protect,
  authorizeRoles("admin", "manager"),
  toggleMealAvailability
);

// Only admin can delete meal
router.delete("/:id", protect, authorizeRoles("admin"), deleteMeal);

module.exports = router;