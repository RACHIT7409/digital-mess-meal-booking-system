import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const ManagerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/manager");
      setDashboard(res.data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Manager Dashboard
      </h1>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded">{error}</p>}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Link
          to="/manager/today-bookings"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">Today’s Bookings</h2>
          <p className="text-gray-600">
            View breakfast, lunch, snacks, and dinner bookings.
          </p>
        </Link>

        <Link
          to="/manager/qr-verification"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">QR Verification</h2>
          <p className="text-gray-600">
            Verify student QR coupon and mark meal served.
          </p>
        </Link>

        <Link
          to="/manager/refunds"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">Refund Requests</h2>
          <p className="text-gray-600">
            Approve or reject student refund requests.
          </p>
        </Link>
      </div>

      {dashboard && (
        <>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded p-5">
              <p className="text-gray-600">Today Bookings</p>
              <h2 className="text-2xl font-bold">{dashboard.todayBookings}</h2>
            </div>

            <div className="bg-white shadow rounded p-5">
              <p className="text-gray-600">Paid Bookings</p>
              <h2 className="text-2xl font-bold">
                {dashboard.todayPaidBookings}
              </h2>
            </div>

            <div className="bg-white shadow rounded p-5">
              <p className="text-gray-600">Served Meals</p>
              <h2 className="text-2xl font-bold">
                {dashboard.todayServedMeals}
              </h2>
            </div>

            <div className="bg-white shadow rounded p-5">
              <p className="text-gray-600">Today Revenue</p>
              <h2 className="text-2xl font-bold">₹{dashboard.todayRevenue}</h2>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3">Today Meal Wise Count</h2>

          <div className="bg-white shadow rounded overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Meal</th>
                  <th className="p-3 text-left">Bookings</th>
                  <th className="p-3 text-left">Served</th>
                  <th className="p-3 text-left">Pending</th>
                  <th className="p-3 text-left">Amount</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.todayMealWiseCount.length === 0 ? (
                  <tr>
                    <td className="p-3 text-center" colSpan="5">
                      No paid bookings for today.
                    </td>
                  </tr>
                ) : (
                  dashboard.todayMealWiseCount.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="p-3">{item._id}</td>
                      <td className="p-3">{item.totalBookings}</td>
                      <td className="p-3">{item.servedCount}</td>
                      <td className="p-3">{item.pendingCount}</td>
                      <td className="p-3">₹{item.totalAmount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;