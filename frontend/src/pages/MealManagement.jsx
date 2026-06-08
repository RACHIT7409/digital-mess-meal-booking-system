import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const MealManagement = () => {
  const [meals, setMeals] = useState([]);
  const [editingMealId, setEditingMealId] = useState(null);

  const [formData, setFormData] = useState({
    mealName: "Breakfast",
    price: "",
    startTime: "",
    endTime: "",
    bookingDeadlineHours: 12,
    cancellationDeadlineHours: 6,
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMeals = async () => {
    try {
      const res = await API.get("/meals");
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

  const resetForm = () => {
    setEditingMealId(null);
    setFormData({
      mealName: "Breakfast",
      price: "",
      startTime: "",
      endTime: "",
      bookingDeadlineHours: 12,
      cancellationDeadlineHours: 6,
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "bookingDeadlineHours" ||
        name === "cancellationDeadlineHours"
          ? Number(value)
          : value,
    }));
  };

  const handleEdit = (meal) => {
    setEditingMealId(meal._id);

    setFormData({
      mealName: meal.mealName,
      price: meal.price,
      startTime: meal.startTime,
      endTime: meal.endTime,
      bookingDeadlineHours: meal.bookingDeadlineHours,
      cancellationDeadlineHours: meal.cancellationDeadlineHours,
      description: meal.description || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (editingMealId) {
        await API.put(`/meals/${editingMealId}`, formData);
        setSuccess("Meal updated successfully.");
      } else {
        await API.post("/meals", formData);
        setSuccess("Meal created successfully.");
      }

      resetForm();
      fetchMeals();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save meal");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (mealId) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.patch(`/meals/${mealId}/toggle-availability`);
      setSuccess("Meal availability changed successfully.");
      fetchMeals();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change availability");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this meal?"
    );

    if (!confirmDelete) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.delete(`/meals/${mealId}`);
      setSuccess("Meal deleted successfully.");
      fetchMeals();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete meal");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-6">
        <p>Loading meals...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Meal Management</h1>

        <Link
          to="/admin/dashboard"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      {success && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-5 mb-6"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingMealId ? "Update Meal" : "Create Meal"}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <select
            name="mealName"
            value={formData.mealName}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            disabled={!!editingMealId}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snacks">Snacks</option>
            <option value="Dinner">Dinner</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            className="border px-3 py-2 rounded"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="startTime"
            className="border px-3 py-2 rounded"
            value={formData.startTime}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="endTime"
            className="border px-3 py-2 rounded"
            value={formData.endTime}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="bookingDeadlineHours"
            placeholder="Booking Deadline Hours"
            className="border px-3 py-2 rounded"
            value={formData.bookingDeadlineHours}
            onChange={handleChange}
          />

          <input
            type="number"
            name="cancellationDeadlineHours"
            placeholder="Cancellation Deadline Hours"
            className="border px-3 py-2 rounded"
            value={formData.cancellationDeadlineHours}
            onChange={handleChange}
          />

          <input
            name="description"
            placeholder="Description"
            className="border px-3 py-2 rounded md:col-span-3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            disabled={loading}
            className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
          >
            {loading
              ? "Saving..."
              : editingMealId
              ? "Update Meal"
              : "Create Meal"}
          </button>

          {editingMealId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 text-white px-5 py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Meal</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Booking Deadline</th>
              <th className="p-3 text-left">Cancel Deadline</th>
              <th className="p-3 text-left">Available</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {meals.length === 0 ? (
              <tr>
                <td className="p-3 text-center" colSpan="7">
                  No meals found.
                </td>
              </tr>
            ) : (
              meals.map((meal) => (
                <tr key={meal._id} className="border-t">
                  <td className="p-3 font-medium">{meal.mealName}</td>
                  <td className="p-3">₹{meal.price}</td>
                  <td className="p-3">
                    {meal.startTime} - {meal.endTime}
                  </td>
                  <td className="p-3">{meal.bookingDeadlineHours} hrs</td>
                  <td className="p-3">{meal.cancellationDeadlineHours} hrs</td>
                  <td className="p-3">
                    {meal.isAvailable ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        Yes
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                        No
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(meal)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleToggleAvailability(meal._id)}
                      className="bg-orange-600 text-white px-3 py-1 rounded"
                    >
                      {meal.isAvailable ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealManagement;