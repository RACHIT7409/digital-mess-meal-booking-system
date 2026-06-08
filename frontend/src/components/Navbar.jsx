import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";

    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "manager") return "/manager/dashboard";

    return "/student/dashboard";
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Mess Booking
      </Link>

      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            <Link to={getDashboardPath()} className="hover:underline">
              Dashboard
            </Link>

<Link to="/profile" className="hover:underline">
  Profile
</Link>

            <span className="text-sm bg-blue-900 px-3 py-1 rounded">
              {user?.role}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-700 px-4 py-2 rounded"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;