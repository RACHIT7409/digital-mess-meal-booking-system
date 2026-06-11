import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock, FiCoffee } from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";

const AvailableMeals = () => {
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [loadingMealId, setLoadingMealId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 2);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const fetchMeals = async () => {
    try {
      const res = await API.get("/meals/available");
      setMeals(res.data.meals);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch meals");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDateChange = (mealId, value) => {
    setSelectedDates((prev) => ({
      ...prev,
      [mealId]: value,
    }));
  };

  const handleBookMeal = async (mealId) => {
    const mealDate = selectedDates[mealId];

    if (!mealDate) {
      setError("Please select meal date");
      return;
    }

    setError("");
    setSuccess("");
    setLoadingMealId(mealId);

    try {
      const res = await API.post("/bookings", {
  mealId,
  mealDate,
});

if (res.data.existingPendingBooking) {
  setSuccess(
    "You already have a pending payment booking. Please complete payment from My Bookings."
  );
} else {
  setSuccess("Meal booked successfully. Please complete payment.");
}

setTimeout(() => {
  navigate("/student/bookings");
}, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoadingMealId(null);
    }
  };

  if (pageLoading) {
    return (
      <main className="page-container">
        <div className="glass-card p-6">Loading available meals...</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <PageHeader
        title="Available Meals"
        subtitle="Choose a meal, select date, and book your coupon securely."
        rightContent={
          <button onClick={() => navigate("/student/dashboard")} className="btn-dark flex items-center gap-2">
            <FiArrowLeft />
            Back
          </button>
        }
      />

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-4">
          {error}
        </p>
      )}

      {success && (
        <p className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl mb-4">
          {success}
        </p>
      )}

      {meals.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <FiCoffee className="mx-auto text-4xl text-blue-700 mb-3" />
          <h2 className="text-xl font-extrabold">No meals available</h2>
          <p className="text-slate-500 mt-2">
            Please check again later or contact mess manager.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {meals.map((meal) => (
            <div key={meal._id} className="pro-card p-6 fade-in">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl mb-4">
                <FiCoffee />
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                {meal.mealName}
              </h2>

              <div className="space-y-2 text-sm text-slate-600 mb-5">
                <p className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">₹{meal.price}</span>
                  per meal
                </p>

                <p className="flex items-center gap-2">
                  <FiClock />
                  {meal.startTime} - {meal.endTime}
                </p>

                {meal.description && (
                  <p className="text-slate-500">{meal.description}</p>
                )}
              </div>

              <label className="block font-bold text-slate-700 mb-2">
                <FiCalendar className="inline mr-2" />
                Meal Date
              </label>

              <input
                type="date"
                min={today}
                max={maxDate}
                value={selectedDates[meal._id] || ""}
                onChange={(e) => handleDateChange(meal._id, e.target.value)}
                className="w-full mb-4"
              />

              <button
                onClick={() => handleBookMeal(meal._id)}
                disabled={loadingMealId === meal._id}
                className="btn-primary w-full"
              >
                {loadingMealId === meal._id ? "Booking..." : "Book Meal"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AvailableMeals;