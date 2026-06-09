import { useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiCreditCard } from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";
import { Link } from "react-router-dom";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import ActionCard from "../components/ActionCard";
import StatCard from "../components/StatCard";

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
    <main className="page-container">
      <PageHeader
        title="Manager Dashboard"
        subtitle="Monitor today's bookings, QR verification, and refunds."
      />

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{error}</p>
      )}

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <ActionCard
          to="/manager/today-bookings"
          title="Today’s Bookings"
          description="View breakfast, lunch, snacks, and dinner bookings."
          icon={<FiClock />}
        />

        <ActionCard
          to="/manager/qr-verification"
          title="QR Verification"
          description="Scan or verify student coupon and mark meal served."
          icon={<MdQrCodeScanner />}
        />

        <ActionCard
          to="/manager/refunds"
          title="Refund Requests"
          description="Approve or reject refund requests from students."
          icon={<FiCheckCircle />}
        />
      </div>

      {dashboard && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
            <StatCard
              title="Today Bookings"
              value={dashboard.todayBookings}
              icon={<FiClock />}
            />

            <StatCard
              title="Paid Bookings"
              value={dashboard.todayPaidBookings}
              icon={<FiCreditCard />}
            />

            <StatCard
              title="Served Meals"
              value={dashboard.todayServedMeals}
              icon={<FiCheckCircle />}
            />

            <StatCard
              title="Today Revenue"
              value={`₹${dashboard.todayRevenue}`}
              icon={<FiCreditCard />}
            />
          </div>

          <div className="table-card">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-xl font-extrabold text-slate-900">
                Today Meal Wise Count
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="table-pro">
                <thead>
                  <tr>
                    <th>Meal</th>
                    <th>Bookings</th>
                    <th>Served</th>
                    <th>Pending</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.todayMealWiseCount.length === 0 ? (
                    <tr>
                      <td className="text-center" colSpan="5">
                        No paid bookings for today.
                      </td>
                    </tr>
                  ) : (
                    dashboard.todayMealWiseCount.map((item) => (
                      <tr key={item._id}>
                        <td className="font-bold">{item._id}</td>
                        <td>{item.totalBookings}</td>
                        <td>{item.servedCount}</td>
                        <td>{item.pendingCount}</td>
                        <td className="font-bold">₹{item.totalAmount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ManagerDashboard;