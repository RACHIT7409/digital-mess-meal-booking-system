import { FiCalendar, FiCreditCard, FiRefreshCw, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import ActionCard from "../components/ActionCard";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <main className="page-container">
      <PageHeader
        title="Student Dashboard"
        subtitle={`Welcome, ${user?.name}. Book meals, view QR coupons, and manage refunds.`}
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <ActionCard
          to="/student/meals"
          title="Book Meal"
          description="Reserve breakfast, lunch, snacks, or dinner in a few clicks."
          icon={<FiCalendar />}
        />

        <ActionCard
          to="/student/bookings"
          title="My Bookings"
          description="Track your payment status, coupons, and meal history."
          icon={<FiCreditCard />}
        />

        <ActionCard
          to="/student/refunds"
          title="My Refunds"
          description="Request and track refund status for not-served meals."
          icon={<FiRefreshCw />}
        />

        <ActionCard
          to="/profile"
          title="Profile"
          description="Update your phone, hostel, room number, and password."
          icon={<FiUser />}
        />
      </div>
    </main>
  );
};

export default StudentDashboard;