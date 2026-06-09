import { loadRazorpayScript } from "../utils/loadRazorpay";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [refundReason, setRefundReason] = useState({});
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError("Razorpay SDK failed to load. Check your internet connection.");
        setLoading(false);
        return;
      }

      const orderRes = await API.post(
        `/payments/razorpay/order/${booking._id}`
      );

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
          color: "#1d4ed8",
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
      setLoading(false);
    }
  };

  const handleDummyPayment = async (bookingId) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.patch(`/payments/dummy-success/${bookingId}`);
      setSuccess("Payment successful. QR coupon generated.");
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
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

  if (pageLoading) {
    return (
      <div className="p-6">
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">My Bookings</h1>

        <Link
          to="/student/meals"
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Book New Meal
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

      {bookings.length === 0 ? (
        <div className="bg-white shadow rounded p-6">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white shadow rounded p-5">
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Meal</p>
                  <h2 className="font-bold">{booking.mealName}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <h2 className="font-bold">
                    {formatDate(booking.mealDate)}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Amount</p>
                  <h2 className="font-bold">₹{booking.amount}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <h2 className="font-bold">{booking.bookingStatus}</h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-gray-100 px-3 py-1 rounded">
                  Payment: {booking.paymentStatus}
                </span>

                <span className="bg-gray-100 px-3 py-1 rounded">
                  Served: {booking.isServed ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {booking.paymentStatus === "PENDING_PAYMENT" &&
                  booking.bookingStatus !== "CANCELLED" && (
                    <>
                      <button
                        onClick={() => handleRazorpayPayment(booking)}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                      >
                        Pay with Razorpay
                      </button>

                  


                    </>
                  )}

                {booking.paymentStatus === "PENDING_PAYMENT" &&
                  booking.bookingStatus !== "CANCELLED" && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={loading}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      Cancel Booking
                    </button>
                  )}

                {booking.paymentStatus === "PAID" && booking.qrCode && (
                  <Link
                    to={`/student/coupon/${booking._id}`}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    View QR Coupon
                  </Link>
                )}
              </div>

              {booking.paymentStatus === "PAID" &&
                booking.bookingStatus === "CONFIRMED" &&
                !booking.isServed && (
                  <div className="mt-4 border-t pt-4">
                    <label className="block font-medium mb-2">
                      Refund Reason
                    </label>

                    <textarea
                      value={refundReason[booking._id] || ""}
                      onChange={(e) =>
                        handleRefundReasonChange(
                          booking._id,
                          e.target.value
                        )
                      }
                      className="w-full border px-3 py-2 rounded mb-2"
                      placeholder="Example: I paid but meal was not served..."
                      rows="2"
                    />

                    <button
                      onClick={() => handleRefundRequest(booking._id)}
                      disabled={loading}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
                    >
                      Request Refund
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;