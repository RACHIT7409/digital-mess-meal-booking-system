import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AvailableMeals = () => {
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      await API.post("/bookings", {
        mealId,
        mealDate,
      });

      setSuccess("Booking created successfully. Please complete payment.");
      setTimeout(() => {
        navigate("/student/bookings");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-6">
        <p>Loading available meals...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          Available Meals
        </h1>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </p>
      )}

      {success && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </p>
      )}

      {meals.length === 0 ? (
        <div className="bg-white shadow rounded p-6">
          <p>No meals available right now.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {meals.map((meal) => (
            <div key={meal._id} className="bg-white shadow rounded p-5">
              <h2 className="text-xl font-bold mb-2">{meal.mealName}</h2>

              <p className="text-gray-700 mb-1">
                Price: <span className="font-semibold">₹{meal.price}</span>
              </p>

              <p className="text-gray-700 mb-1">
                Time: {meal.startTime} - {meal.endTime}
              </p>

              <p className="text-gray-600 text-sm mb-4">
                {meal.description}
              </p>

              <label className="block mb-1 font-medium">
                Select Meal Date
              </label>

              <input
                type="date"
                min={today}
                max={maxDate}
                value={selectedDates[meal._id] || ""}
                onChange={(e) => handleDateChange(meal._id, e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <button
                onClick={() => handleBookMeal(meal._id)}
                disabled={loading}
                className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
              >
                {loading ? "Booking..." : "Book Meal"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableMeals;