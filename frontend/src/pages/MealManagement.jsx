import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiCoffee,
  FiEdit,
  FiPlusCircle,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const MealManagement = () => {
  const [meals, setMeals] = useState([]);
  const [editingMealId, setEditingMealId] = useState(null);

  const [formData, setFormData] = useState({
    mealName: "Breakfast",
    price: "",
    startTime: "",
    endTime: "",
    bookingDeadlineHours: 0,
    cancellationDeadlineHours: 0,
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMeals = async () => {
    try {
      setPageLoading(true);
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
      bookingDeadlineHours: 0,
      cancellationDeadlineHours: 0,
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

    window.scrollTo({ top: 0, behavior: "smooth" });
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
      setSuccess("Meal availability updated successfully.");
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
      <main className="page-container">
        <div className="glass-card p-6">Loading meals...</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <PageHeader
        title="Meal Management"
        subtitle="Create, update, enable, disable, and manage mess meal timings."
        rightContent={
          <>
            <button
              onClick={fetchMeals}
              className="btn-primary flex items-center gap-2"
            >
              <FiRefreshCw />
              Refresh
            </button>

            <Link
              to="/admin/dashboard"
              className="btn-dark flex items-center gap-2"
            >
              <FiArrowLeft />
              Back
            </Link>
          </>
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

      <div className="grid xl:grid-cols-[1fr_420px] gap-6 items-start">
        <form onSubmit={handleSubmit} className="form-card p-7 md:p-9 fade-in">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg">
              {editingMealId ? <FiEdit /> : <FiPlusCircle />}
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {editingMealId ? "Update Meal" : "Create Meal"}
              </h2>
              <p className="text-slate-500 mt-1">
                Configure meal price, serving time, and deadline rules.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Meal Name
              </label>

              <div className="relative">
                <FiCoffee className="auth-icon" />
                <select
                  name="mealName"
                  value={formData.mealName}
                  onChange={handleChange}
                  className="auth-select"
                  disabled={!!editingMealId}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Price
              </label>

              <input
                type="number"
                name="price"
                placeholder="Example: 60"
                value={formData.price}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Start Time
              </label>

              <div className="relative">
                <FiClock className="auth-icon" />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                End Time
              </label>

              <div className="relative">
                <FiClock className="auth-icon" />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Booking Deadline Hours
              </label>

              <input
                type="number"
                name="bookingDeadlineHours"
                placeholder="Example: 1"
                value={formData.bookingDeadlineHours}
                onChange={handleChange}
                className="w-full"
              />

              <p className="text-xs text-slate-500 mt-2">
                Student can book before this many hours from meal start.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Cancellation Deadline Hours
              </label>

              <input
                type="number"
                name="cancellationDeadlineHours"
                placeholder="Example: 1"
                value={formData.cancellationDeadlineHours}
                onChange={handleChange}
                className="w-full"
              />

              <p className="text-xs text-slate-500 mt-2">
                Student can cancel before this many hours from meal start.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Example: Regular lunch meal for summer term students."
                value={formData.description}
                onChange={handleChange}
                className="w-full"
                rows="3"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-7">
            <button
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {editingMealId ? <FiEdit /> : <FiPlusCircle />}
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
                className="btn-dark"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <aside className="pro-card p-6 fade-in">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl mb-4">
            <FiClock />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-3">
            Meal Timing Guide
          </h2>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <h3 className="font-extrabold text-slate-900">
                Booking Deadline
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                If lunch starts at 12:30 and booking deadline is 1 hour,
                students can book until 11:30.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <h3 className="font-extrabold text-slate-900">
                Cancellation Deadline
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                If dinner starts at 19:30 and cancellation deadline is 1 hour,
                students can cancel until 18:30.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <h3 className="font-extrabold text-orange-700">Testing Tip</h3>
              <p className="text-sm text-orange-700 mt-1">
                During testing, keep deadline hours as 0 to avoid booking
                failure due to time rules.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FiCoffee />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Existing Meals
            </h2>
            <p className="text-slate-500 text-sm">
              Manage current meal availability and pricing.
            </p>
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <FiCoffee className="mx-auto text-4xl text-blue-700 mb-3" />
            <h2 className="text-xl font-extrabold">No meals found</h2>
            <p className="text-slate-500 mt-2">
              Create your first meal using the form above.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="table-card hidden lg:block">
              <table className="table-pro">
                <thead>
                  <tr>
                    <th>Meal</th>
                    <th>Price</th>
                    <th>Time</th>
                    <th>Booking Deadline</th>
                    <th>Cancel Deadline</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {meals.map((meal) => (
                    <tr key={meal._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                            <FiCoffee />
                          </div>
                          <span className="font-extrabold">
                            {meal.mealName}
                          </span>
                        </div>
                      </td>

                      <td className="font-bold">₹{meal.price}</td>
                      <td>
                        {meal.startTime} - {meal.endTime}
                      </td>
                      <td>{meal.bookingDeadlineHours} hrs</td>
                      <td>{meal.cancellationDeadlineHours} hrs</td>
                      <td>
                        <StatusBadge
                          status={meal.isAvailable ? "ACTIVE" : "INACTIVE"}
                        />
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(meal)}
                            className="btn-primary text-sm flex items-center gap-1"
                          >
                            <FiEdit />
                            Edit
                          </button>

                          <button
                            onClick={() => handleToggleAvailability(meal._id)}
                            className="btn-dark text-sm"
                          >
                            {meal.isAvailable ? "Disable" : "Enable"}
                          </button>

                          <button
                            onClick={() => handleDeleteMeal(meal._id)}
                            className="btn-danger text-sm flex items-center gap-1"
                          >
                            <FiTrash2 />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-5 lg:hidden">
              {meals.map((meal) => (
                <div key={meal._id} className="pro-card p-5 fade-in">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl">
                        <FiCoffee />
                      </div>

                      <div>
                        <h2 className="text-xl font-extrabold">
                          {meal.mealName}
                        </h2>
                        <p className="text-sm text-slate-500">
                          ₹{meal.price}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      status={meal.isAvailable ? "ACTIVE" : "INACTIVE"}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-sm text-slate-500">Time</p>
                      <h3 className="font-extrabold">
                        {meal.startTime} - {meal.endTime}
                      </h3>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-sm text-slate-500">
                        Booking Deadline
                      </p>
                      <h3 className="font-extrabold">
                        {meal.bookingDeadlineHours} hrs
                      </h3>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-sm text-slate-500">
                        Cancel Deadline
                      </p>
                      <h3 className="font-extrabold">
                        {meal.cancellationDeadlineHours} hrs
                      </h3>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-sm text-slate-500">Description</p>
                      <h3 className="font-bold">
                        {meal.description || "-"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(meal)}
                      className="btn-primary flex items-center gap-1"
                    >
                      <FiEdit />
                      Edit
                    </button>

                    <button
                      onClick={() => handleToggleAvailability(meal._id)}
                      className="btn-dark"
                    >
                      {meal.isAvailable ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="btn-danger flex items-center gap-1"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default MealManagement;