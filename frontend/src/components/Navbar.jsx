import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUser,
  FiLogOut,
  FiCoffee,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import lnmiitLogo from "../assets/lnmiit-logo.png";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
      isActive
        ? "bg-white text-blue-700 shadow-sm"
        : "text-blue-50 hover:bg-blue-500/40"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-lg">
      <nav className="max-w-[1440px] mx-auto px-5 md:px-8 py-4 flex justify-between items-center">
        {/* Logo sequence: LNMIIT → Cup → MessMate */}
        <Link to="/" className="flex items-center gap-4 text-white">
          <img
            src={lnmiitLogo}
            alt="LNMIIT Logo"
            className="w-20 h-20 md:w-24 md:h-24 object-contain bg-white rounded-2xl border border-white/40 p-2 shadow-md"
          />

          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shadow-sm">
            <FiCoffee className="text-3xl md:text-4xl" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-none">
              MessMate
            </h1>
            <p className="text-sm text-blue-100 hidden sm:block">
              Smart meals. Happy hostel life.
            </p>
          </div>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink to={getDashboardPath()} className={navLinkClass}>
                <FiHome />
                Dashboard
              </NavLink>

              <NavLink to="/profile" className={navLinkClass}>
                <FiUser />
                Profile
              </NavLink>

              <span className="bg-blue-950/35 text-white px-4 py-2 rounded-xl text-sm font-bold capitalize">
                {user?.role}
              </span>

              <button onClick={handleLogout} className="btn-danger flex gap-2">
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <Link
                to="/register"
                className="bg-white text-blue-700 px-5 py-2 rounded-xl font-bold shadow-sm hover:shadow-md transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {open && (
        <div className="md:hidden px-5 pb-4 space-y-2 fade-in">
          {isAuthenticated ? (
            <>
              <NavLink
                to={getDashboardPath()}
                onClick={() => setOpen(false)}
                className={navLinkClass}
              >
                <FiHome />
                Dashboard
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className={navLinkClass}
              >
                <FiUser />
                Profile
              </NavLink>

              <div className="text-white bg-blue-950/35 px-4 py-2 rounded-xl capitalize font-bold">
                {user?.role}
              </div>

              <button
                onClick={handleLogout}
                className="btn-danger w-full flex justify-center gap-2"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className={navLinkClass}
              >
                Login
              </NavLink>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block text-center bg-white text-blue-700 px-5 py-2 rounded-xl font-bold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;