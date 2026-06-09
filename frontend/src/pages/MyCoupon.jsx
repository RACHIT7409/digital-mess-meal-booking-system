import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";

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
      <div className="p-6">
        <p>Loading coupon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </p>

        <Link
          to="/student/bookings"
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow rounded p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Digital Meal Coupon
        </h1>

        <div className="border rounded p-4 mb-4">
          <img
            src={coupon.qrCode}
            alt="Meal QR Coupon"
            className="mx-auto w-64 h-64"
          />
        </div>

        <div className="text-left space-y-2 mb-6">
          <p>
            <strong>Name:</strong> {coupon.studentName}
          </p>

          <p>
            <strong>Roll Number:</strong> {coupon.rollNumber}
          </p>

          <p>
            <strong>Meal:</strong> {coupon.mealName}
          </p>

          <p>
            <strong>Date:</strong> {formatDate(coupon.mealDate)}
          </p>

          <p>
            <strong>Amount:</strong> ₹{coupon.amount}
          </p>

          <p>
            <strong>Payment:</strong> {coupon.paymentStatus}
          </p>

          <p>
            <strong>Status:</strong> {coupon.bookingStatus}
          </p>
{/*           
<p className="break-all">
  <strong>QR Token:</strong> {coupon.qrToken}
</p> */}


        </div>

        <p className="text-sm text-gray-600 mb-4">
          Show this QR coupon at mess entry. This coupon can be used only once.
        </p>

        <Link
          to="/student/bookings"
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back to Bookings
        </Link>
      </div>
    </div>
  );
};

export default MyCoupon;