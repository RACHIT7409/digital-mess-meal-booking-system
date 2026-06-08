// Normalize a date to start of day
const normalizeDate = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Convert mealDate + time string into full Date object
// Example: mealDate = 2026-06-08, timeString = "12:30"
const combineDateAndTime = (mealDate, timeString) => {
  const date = new Date(mealDate);
  const [hours, minutes] = timeString.split(":").map(Number);

  date.setHours(hours, minutes, 0, 0);

  return date;
};

// Get booking deadline time
const getBookingDeadline = (mealDate, mealStartTime, deadlineHours) => {
  const mealStartDateTime = combineDateAndTime(mealDate, mealStartTime);

  const deadline = new Date(mealStartDateTime);
  deadline.setHours(deadline.getHours() - Number(deadlineHours || 0));

  return deadline;
};

// Get cancellation deadline time
const getCancellationDeadline = (mealDate, mealStartTime, deadlineHours) => {
  const mealStartDateTime = combineDateAndTime(mealDate, mealStartTime);

  const deadline = new Date(mealStartDateTime);
  deadline.setHours(deadline.getHours() - Number(deadlineHours || 0));

  return deadline;
};

// Check if current time is before a deadline
const isBeforeDeadline = (deadline) => {
  return new Date() <= deadline;
};

// Check if meal has ended
const hasMealEnded = (mealDate, mealEndTime) => {
  const mealEndDateTime = combineDateAndTime(mealDate, mealEndTime);
  return new Date() > mealEndDateTime;
};

// Check if meal has already started
const hasMealStarted = (mealDate, mealStartTime) => {
  const mealStartDateTime = combineDateAndTime(mealDate, mealStartTime);
  return new Date() >= mealStartDateTime;
};

module.exports = {
  normalizeDate,
  combineDateAndTime,
  getBookingDeadline,
  getCancellationDeadline,
  isBeforeDeadline,
  hasMealEnded,
  hasMealStarted,
};