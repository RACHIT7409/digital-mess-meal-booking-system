import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        Digital Mess Meal Booking System
      </h1>

      <p className="max-w-2xl text-gray-700 mb-6">
        Book breakfast, lunch, snacks, and dinner online. Get QR coupon,
        verify meal entry, and manage refunds digitally.
      </p>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-blue-700 text-white px-6 py-3 rounded hover:bg-blue-800"
        >
          Student Register
        </Link>

        <Link
          to="/login"
          className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;