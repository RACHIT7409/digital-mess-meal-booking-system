import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiCreditCard,
  FiEye,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [refundReason, setRefundReason] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentLoadingId, setPaymentLoadingId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");
      setBookings(res.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRazorpayPayment = async (booking) => {
    setError("");
    setSuccess("");
    setPaymentLoadingId(booking._id);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError("Razorpay SDK failed to load. Check your internet connection.");
        setPaymentLoadingId(null);
        return;
      }

      const orderRes = await API.post(`/payments/razorpay/order/${booking._id}`);

      const { order, key, booking: bookingInfo } = orderRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Mess Meal Booking",
        description: `${bookingInfo.mealName} Booking`,
        order_id: order.id,

        handler: async function (response) {
          try {
            await API.post(`/payments/razorpay/verify/${booking._id}`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setSuccess("Payment verified successfully. QR coupon generated.");
            fetchBookings();
          } catch (err) {
            setError(
              err.response?.data?.message || "Payment verification failed"
            );
          }
        },

        prefill: {
          name: bookingInfo.studentName,
          email: bookingInfo.email || "",
          contact: bookingInfo.phone || "",
        },

        notes: {
          bookingId: booking._id,
          mealName: bookingInfo.mealName,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setError(response.error.description || "Payment failed");
      });

      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start Razorpay payment");
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.patch(`/bookings/${bookingId}/cancel`);
      setSuccess("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRefundReasonChange = (bookingId, value) => {
    setRefundReason((prev) => ({
      ...prev,
      [bookingId]: value,
    }));
  };

  const handleRefundRequest = async (bookingId) => {
    const reason = refundReason[bookingId];

    if (!reason || reason.trim().length < 5) {
      setError("Please enter a proper refund reason");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post(`/refunds/request/${bookingId}`, {
        reason,
      });

      setSuccess("Refund request submitted successfully.");

      setRefundReason((prev) => ({
        ...prev,
        [bookingId]: "",
      }));

      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Refund request failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString("en-IN");
  };

  const canPay = (booking) => {
    return (
      booking.paymentStatus === "PENDING_PAYMENT" &&
      booking.bookingStatus !== "CANCELLED"
    );
  };

  const canViewCoupon = (booking) => {
    return booking.paymentStatus === "PAID" && booking.qrCode;
  };

  const canRequestRefund = (booking) => {
    return (
      booking.paymentStatus === "PAID" &&
      booking.bookingStatus === "CONFIRMED" &&
      !booking.isServed
    );
  };

  if (pageLoading) {
    return (
      <main className="page-container">
        <div className="glass-card p-6">Loading bookings...</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <PageHeader
        title="My Bookings"
        subtitle="Track your meal bookings, payments, QR coupons, and refunds."
        rightContent={
          <Link to="/student/meals" className="btn-primary flex items-center gap-2">
            <FiCalendar />
            Book New Meal
          </Link>
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
          <FiCalendar className="mx-auto text-4xl text-blue-700 mb-3" />
          <h2 className="text-xl font-extrabold">No bookings found</h2>
          <p className="text-slate-500 mt-2">
            Book your first meal to see it here.
          </p>

          <Link
            to="/student/meals"
            className="btn-primary inline-flex items-center gap-2 mt-5"
          >
            <FiCalendar />
            Book Meal
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div key={booking._id} className="pro-card p-6 fade-in">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-5">
                <div>
                  <p className="text-sm text-slate-500">Meal</p>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {booking.mealName}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Booking ID:{" "}
                    <span className="font-mono text-xs break-all">
                      {booking._id}
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
                  <p className="text-sm text-slate-500">Booked At</p>
                  <h3 className="font-extrabold mt-1">
                    {formatDateTime(booking.bookingTime)}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Served At</p>
                  <h3 className="font-extrabold mt-1">
                    {formatDateTime(booking.servedAt)}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-5">
                {canPay(booking) && (
                  <>
                    <button
                      onClick={() => handleRazorpayPayment(booking)}
                      disabled={paymentLoadingId === booking._id}
                      className="btn-success flex items-center gap-2"
                    >
                      <FiCreditCard />
                      {paymentLoadingId === booking._id
                        ? "Opening Payment..."
                        : "Pay with Razorpay"}
                    </button>

                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={loading}
                      className="btn-danger flex items-center gap-2"
                    >
                      <FiXCircle />
                      Cancel Booking
                    </button>
                  </>
                )}

                {canViewCoupon(booking) && (
                  <Link
                    to={`/student/coupon/${booking._id}`}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiEye />
                    View QR Coupon
                  </Link>
                )}
              </div>

              {booking.bookingStatus === "NOT_SERVED" && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-2xl mb-5">
                  <p className="font-bold">Marked as Not Served</p>
                  <p className="text-sm mt-1">
                    {booking.notServedReason || "Meal was not served."}
                  </p>
                </div>
              )}

              {canRequestRefund(booking) && (
                <div className="border-t border-slate-200 pt-5">
                  <label className="block font-bold text-slate-700 mb-2">
                    Refund Reason
                  </label>

                  <textarea
                    value={refundReason[booking._id] || ""}
                    onChange={(e) =>
                      handleRefundReasonChange(booking._id, e.target.value)
                    }
                    className="w-full mb-3"
                    placeholder="Example: I paid but meal was not served..."
                    rows="3"
                  />

                  <button
                    onClick={() => handleRefundRequest(booking._id)}
                    disabled={loading}
                    className="btn-danger flex items-center gap-2"
                  >
                    <FiRefreshCw />
                    Request Refund
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyBookings;