import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const TodayBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [mealName, setMealName] = useState("");
  const [notServedReasons, setNotServedReasons] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setPageLoading(true);
      setError("");

      const url = mealName
        ? `/dashboard/today-bookings?mealName=${mealName}`
        : "/dashboard/today-bookings";

      const res = await API.get(url);
      setBookings(res.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [mealName]);

  const handleReasonChange = (bookingId, value) => {
    setNotServedReasons((prev) => ({
      ...prev,
      [bookingId]: value,
    }));
  };

  const handleMarkNotServed = async (bookingId) => {
    const reason = notServedReasons[bookingId];

    if (!reason || reason.trim().length < 5) {
      setError("Please enter a proper reason before marking not served.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.patch(`/bookings/${bookingId}/not-served`, {
        reason,
      });

      setSuccess("Booking marked as NOT_SERVED successfully.");

      setNotServedReasons((prev) => ({
        ...prev,
        [bookingId]: "",
      }));

      fetchBookings();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to mark booking as not served"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleTimeString("en-IN");
  };

  const getStatusBadge = (status) => {
    if (status === "CONFIRMED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "SERVED") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "NOT_SERVED") {
      return "bg-orange-100 text-orange-700";
    }

    if (status === "REFUND_REQUESTED") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "REFUNDED") {
      return "bg-purple-100 text-purple-700";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const canMarkNotServed = (booking) => {
    return (
      booking.paymentStatus === "PAID" &&
      booking.bookingStatus === "CONFIRMED" &&
      !booking.isServed
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-blue-700">
          Today’s Bookings
        </h1>

        <div className="flex gap-3">
          <select
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snacks">Snacks</option>
            <option value="Dinner">Dinner</option>
          </select>

          <button
            onClick={fetchBookings}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>

          <Link
            to="/manager/dashboard"
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back
          </Link>
        </div>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      {success && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </p>
      )}

      {pageLoading ? (
        <p>Loading today’s bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white shadow rounded p-6">
          <p>No bookings found for today.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white shadow rounded p-5">
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Student</p>
                  <h2 className="font-bold">{booking.student?.name}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Roll Number</p>
                  <h2 className="font-bold">{booking.student?.rollNumber}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Hostel / Room</p>
                  <h2 className="font-bold">
                    {booking.student?.hostel || "-"} /{" "}
                    {booking.student?.roomNumber || "-"}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Meal</p>
                  <h2 className="font-bold">{booking.mealName}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Meal Date</p>
                  <h2 className="font-bold">{formatDate(booking.mealDate)}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Amount</p>
                  <h2 className="font-bold">₹{booking.amount}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Payment Status</p>
                  <h2 className="font-bold">{booking.paymentStatus}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Booking Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusBadge(
                      booking.bookingStatus
                    )}`}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Served</p>
                  <h2 className="font-bold">
                    {booking.isServed ? "Yes" : "No"}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Served At</p>
                  <h2 className="font-bold">{formatTime(booking.servedAt)}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Booking Time</p>
                  <h2 className="font-bold">
                    {new Date(booking.bookingTime).toLocaleString("en-IN")}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Booking ID</p>
                  <h2 className="font-bold break-all text-xs">
                    {booking._id}
                  </h2>
                </div>
              </div>

              {booking.bookingStatus === "NOT_SERVED" && (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded mb-4">
                  <p>
                    <strong>Not Served Reason:</strong>{" "}
                    {booking.notServedReason || "Marked as not served"}
                  </p>

                  {booking.notServedMarkedAt && (
                    <p className="text-sm text-gray-600 mt-1">
                      Marked at:{" "}
                      {new Date(booking.notServedMarkedAt).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  )}
                </div>
              )}

              {canMarkNotServed(booking) && (
                <div className="border-t pt-4">
                  <label className="block font-medium mb-2">
                    Reason for Not Served
                  </label>

                  <textarea
                    value={notServedReasons[booking._id] || ""}
                    onChange={(e) =>
                      handleReasonChange(booking._id, e.target.value)
                    }
                    className="w-full border px-3 py-2 rounded mb-3"
                    rows="2"
                    placeholder="Example: Student paid but meal was not available at the counter."
                  />

                  <button
                    onClick={() => handleMarkNotServed(booking._id)}
                    disabled={loading}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
                  >
                    Mark as NOT_SERVED
                  </button>
                </div>
              )}

              {!canMarkNotServed(booking) && (
                <div className="border-t pt-3 text-sm text-gray-600">
                  {booking.bookingStatus === "SERVED" &&
                    "This booking is already served."}

                  {booking.bookingStatus === "NOT_SERVED" &&
                    "This booking is already marked as not served."}

                  {booking.paymentStatus !== "PAID" &&
                    "Only paid bookings can be marked as not served."}

                  {booking.bookingStatus === "REFUND_REQUESTED" &&
                    "Refund request is already raised for this booking."}

                  {booking.bookingStatus === "REFUNDED" &&
                    "This booking is already refunded."}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayBookings;