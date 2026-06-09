import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiCoffee, FiShield } from "react-icons/fi";
import API from "../api/api";
import StatusBadge from "../components/StatusBadge";

const MyCoupon = () => {
  const { bookingId } = useParams();

  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const fetchCoupon = async () => {
    try {
      const res = await API.get(`/payments/coupon/${bookingId}`);
      setCoupon(res.data.coupon);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch coupon");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [bookingId]);

  const formatDate = (dateValue) => {
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  if (pageLoading) {
    return (
      <main className="page-container">
        <div className="glass-card p-6">Loading coupon...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-4">
          {error}
        </p>

        <Link to="/student/bookings" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft />
          Back to Bookings
        </Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="flex justify-center">
        <div className="form-card max-w-lg w-full p-6 md:p-8 fade-in">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg mb-4">
              <FiCoffee />
            </div>

            <h1 className="text-3xl font-extrabold text-blue-700">
              Digital Meal Coupon
            </h1>

            <p className="text-slate-500 mt-2">
              Show this QR code at mess entry. It can be used only once.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
            <img
              src={coupon.qrCode}
              alt="Meal QR Coupon"
              className="mx-auto w-64 h-64 object-contain"
            />
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <span className="text-slate-500">Name</span>
              <strong>{coupon.studentName}</strong>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <span className="text-slate-500">Roll Number</span>
              <strong>{coupon.rollNumber}</strong>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <span className="text-slate-500">Meal</span>
              <strong>{coupon.mealName}</strong>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <span className="text-slate-500">Date</span>
              <strong>{formatDate(coupon.mealDate)}</strong>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <span className="text-slate-500">Amount</span>
              <strong>₹{coupon.amount}</strong>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <span className="text-slate-500">Payment</span>
              <StatusBadge status={coupon.paymentStatus} />
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Status</span>
              <StatusBadge status={coupon.bookingStatus} />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl flex items-start gap-2 mb-6">
            <FiShield className="mt-1" />
            <p className="text-sm">
              This QR coupon is secure and single-use. Do not share it with others.
            </p>
          </div>

          <Link to="/student/bookings" className="btn-primary w-full flex items-center justify-center gap-2">
            <FiArrowLeft />
            Back to Bookings
          </Link>
        </div>
      </div>
    </main>
  );
};

export default MyCoupon;