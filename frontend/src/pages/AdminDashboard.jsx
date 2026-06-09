import { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiCoffee,
  FiCreditCard,
  FiRefreshCw,
  FiUsers,
  FiUserPlus,
} from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import ActionCard from "../components/ActionCard";
import StatCard from "../components/StatCard";

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

  return (
    <main className="page-container">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Control users, meals, staff, refunds, and revenue reports."
      />

      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <ActionCard
          to="/admin/users"
          title="User Management"
          description="View users and control roles."
          icon={<FiUsers />}
        />

        <ActionCard
          to="/admin/create-staff"
          title="Create Staff"
          description="Create manager or admin accounts."
          icon={<FiUserPlus />}
        />

        <ActionCard
          to="/admin/meals"
          title="Meal Management"
          description="Create, update, or disable meals."
          icon={<FiCoffee />}
        />

        <ActionCard
          to="/admin/reports"
          title="Reports"
          description="View revenue and booking analytics."
          icon={<FiBarChart2 />}
        />
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{error}</p>
      )}

      {dashboard && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="Total Users" value={dashboard.users.totalUsers} icon={<FiUsers />} />
          <StatCard title="Students" value={dashboard.users.totalStudents} icon={<FiUsers />} />
          <StatCard title="Managers" value={dashboard.users.totalManagers} icon={<FiUsers />} />
          <StatCard title="Admins" value={dashboard.users.totalAdmins} icon={<FiUsers />} />

          <StatCard title="Total Meals" value={dashboard.meals.totalMeals} icon={<FiCoffee />} />
          <StatCard title="Active Meals" value={dashboard.meals.activeMeals} icon={<FiCoffee />} />

          <StatCard title="Total Bookings" value={dashboard.bookings.totalBookings} icon={<FiCreditCard />} />
          <StatCard title="Paid Bookings" value={dashboard.bookings.paidBookings} icon={<FiCreditCard />} />
          <StatCard title="Served Meals" value={dashboard.bookings.servedMeals} icon={<FiCoffee />} />
          <StatCard title="Pending Payment" value={dashboard.bookings.pendingPaymentBookings} icon={<FiCreditCard />} />

          <StatCard title="Pending Refunds" value={dashboard.refunds.pendingRefunds} icon={<FiRefreshCw />} />
          <StatCard title="Approved Refunds" value={dashboard.refunds.approvedRefunds} icon={<FiRefreshCw />} />
          <StatCard title="Rejected Refunds" value={dashboard.refunds.rejectedRefunds} icon={<FiRefreshCw />} />
          <StatCard title="Refunded Amount" value={`₹${dashboard.refunds.totalRefundedAmount}`} icon={<FiRefreshCw />} />

          <StatCard title="Net Revenue" value={`₹${dashboard.revenue.totalRevenue}`} icon={<FiBarChart2 />} />
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;