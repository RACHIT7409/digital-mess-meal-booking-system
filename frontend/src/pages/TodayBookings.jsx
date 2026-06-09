import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiSearch,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const TodayBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [mealName, setMealName] = useState("");
  const [notServedReasons, setNotServedReasons] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

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

    const confirmAction = window.confirm(
      "Are you sure you want to mark this booking as NOT_SERVED?"
    );

    if (!confirmAction) return;

    setError("");
    setSuccess("");
    setLoadingId(bookingId);

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
      setLoadingId(null);
    }
  };

  const formatDate = (dateValue) => {
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleTimeString("en-IN");
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString("en-IN");
  };

  const canMarkNotServed = (booking) => {
    return (
      booking.paymentStatus === "PAID" &&
      booking.bookingStatus === "CONFIRMED" &&
      !booking.isServed
    );
  };

  if (pageLoading) {
    return (
      <main className="page-container">
        <div className="glass-card p-6">Loading today’s bookings...</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <PageHeader
        title="Today’s Bookings"
        subtitle="View today's students, meal status, payment status, and not-served cases."
        rightContent={
          <>
            <select
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="min-w-[160px]"
            >
              <option value="">All Meals</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>

            <button
              onClick={fetchBookings}
              className="btn-primary flex items-center gap-2"
            >
              <FiRefreshCw />
              Refresh
            </button>

            <Link
              to="/manager/dashboard"
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

      {bookings.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <FiSearch className="mx-auto text-4xl text-blue-700 mb-3" />
          <h2 className="text-xl font-extrabold">No bookings found</h2>
          <p className="text-slate-500 mt-2">
            There are no bookings for selected meal today.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div key={booking._id} className="pro-card p-6 fade-in">
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5 mb-5">
                <div>
                  <p className="text-sm text-slate-500">Student</p>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {booking.student?.name || "Student"}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Roll No:{" "}
                    <span className="font-bold text-slate-700">
                      {booking.student?.rollNumber || "-"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={booking.bookingStatus} />
                  <StatusBadge status={booking.paymentStatus} />

                  <span
                    className={`status-badge ${
                      booking.isServed ? "badge-blue" : "badge-gray"
                    }`}
                  >
                    Served: {booking.isServed ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Hostel / Room</p>
                  <h3 className="font-extrabold mt-1">
                    {booking.student?.hostel || "-"} /{" "}
                    {booking.student?.roomNumber || "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Meal</p>
                  <h3 className="font-extrabold mt-1">{booking.mealName}</h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Meal Date</p>
                  <h3 className="font-extrabold mt-1">
                    {formatDate(booking.mealDate)}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Amount</p>
                  <h3 className="font-extrabold mt-1">₹{booking.amount}</h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Booking Time</p>
                  <h3 className="font-extrabold mt-1">
                    {formatDateTime(booking.bookingTime)}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Served At</p>
                  <h3 className="font-extrabold mt-1">
                    {formatTime(booking.servedAt)}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:col-span-2">
                  <p className="text-sm text-slate-500">Booking ID</p>
                  <h3 className="font-mono text-xs font-bold break-all mt-1">
                    {booking._id}
                  </h3>
                </div>
              </div>

              {booking.bookingStatus === "NOT_SERVED" && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-2xl mb-5">
                  <p className="font-extrabold flex items-center gap-2">
                    <FiAlertTriangle />
                    Marked as Not Served
                  </p>

                  <p className="text-sm mt-1">
                    {booking.notServedReason || "Marked as not served"}
                  </p>

                  {booking.notServedMarkedAt && (
                    <p className="text-xs text-orange-600 mt-2">
                      Marked at: {formatDateTime(booking.notServedMarkedAt)}
                    </p>
                  )}
                </div>
              )}

              {canMarkNotServed(booking) && (
                <div className="border-t border-slate-200 pt-5">
                  <label className="block font-bold text-slate-700 mb-2">
                    Reason for Not Served
                  </label>

                  <textarea
                    value={notServedReasons[booking._id] || ""}
                    onChange={(e) =>
                      handleReasonChange(booking._id, e.target.value)
                    }
                    className="w-full mb-3"
                    rows="3"
                    placeholder="Example: Student paid but meal was not available at the counter."
                  />

                  <button
                    onClick={() => handleMarkNotServed(booking._id)}
                    disabled={loadingId === booking._id}
                    className="btn-danger flex items-center gap-2"
                  >
                    <FiAlertTriangle />
                    {loadingId === booking._id
                      ? "Updating..."
                      : "Mark as NOT_SERVED"}
                  </button>
                </div>
              )}

              {!canMarkNotServed(booking) && (
                <div className="border-t border-slate-200 pt-4 text-sm text-slate-500 flex items-center gap-2">
                  <FiClock />
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
    </main>
  );
};

export default TodayBookings;