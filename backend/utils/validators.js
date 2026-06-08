const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  if (!phone) return true;
  return /^[6-9]\d{9}$/.test(phone);
};

const isStrongPassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

const isValidMealName = (mealName) => {
  return ["Breakfast", "Lunch", "Snacks", "Dinner"].includes(mealName);
};

const isValidDateString = (dateString) => {
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidMealName,
  isValidDateString,
};