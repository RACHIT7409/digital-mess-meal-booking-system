import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Student Dashboard
      </h1>

      <p className="text-gray-700 mb-6">
        Welcome, {user?.name}. Here you can book meals, pay, view QR coupons,
        and request refunds.
      </p>

      <div className="grid md:grid-cols-4 gap-4">
        <Link
          to="/student/meals"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">Book Meal</h2>
          <p className="text-gray-600">
            Book breakfast, lunch, snacks, or dinner.
          </p>
        </Link>

        <Link
          to="/student/bookings"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">My Bookings</h2>
          <p className="text-gray-600">
            View your booking and payment status.
          </p>
        </Link>

        <Link
          to="/student/refunds"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">My Refunds</h2>
          <p className="text-gray-600">
            Track your refund request status.
          </p>
        </Link>

        <Link
          to="/profile"
          className="bg-white shadow rounded p-5 hover:shadow-lg"
        >
          <h2 className="font-bold text-lg">Profile</h2>
          <p className="text-gray-600">
            View and update your basic details.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;