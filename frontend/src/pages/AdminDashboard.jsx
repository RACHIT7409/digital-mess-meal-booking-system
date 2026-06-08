import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/admin");
      setDashboard(res.data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const Card = ({ title, value }) => (
    <div className="bg-white shadow rounded p-5">
      <p className="text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Link
          to="/admin/users"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">User Management</h2>
          <p className="text-gray-600">View users and control roles.</p>
        </Link>

        <Link
          to="/admin/create-staff"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">Create Staff</h2>
          <p className="text-gray-600">Create manager or admin accounts.</p>
        </Link>

        <Link
          to="/admin/meals"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">Meal Management</h2>
          <p className="text-gray-600">Create, update, or disable meals.</p>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">Reports</h2>
          <p className="text-gray-600">View revenue and booking reports.</p>
        </Link>
      </div>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded">{error}</p>}

      {dashboard && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card title="Total Users" value={dashboard.users.totalUsers} />
          <Card title="Students" value={dashboard.users.totalStudents} />
          <Card title="Managers" value={dashboard.users.totalManagers} />
          <Card title="Admins" value={dashboard.users.totalAdmins} />

          <Card title="Total Meals" value={dashboard.meals.totalMeals} />
          <Card title="Active Meals" value={dashboard.meals.activeMeals} />

          <Card title="Total Bookings" value={dashboard.bookings.totalBookings} />
          <Card title="Paid Bookings" value={dashboard.bookings.paidBookings} />
          <Card title="Served Meals" value={dashboard.bookings.servedMeals} />
          <Card
            title="Pending Payment"
            value={dashboard.bookings.pendingPaymentBookings}
          />

          <Card title="Pending Refunds" value={dashboard.refunds.pendingRefunds} />
          <Card title="Approved Refunds" value={dashboard.refunds.approvedRefunds} />
          <Card title="Rejected Refunds" value={dashboard.refunds.rejectedRefunds} />
          <Card
            title="Refunded Amount"
            value={`₹${dashboard.refunds.totalRefundedAmount}`}
          />

          <Card title="Net Revenue" value={`₹${dashboard.revenue.totalRevenue}`} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;