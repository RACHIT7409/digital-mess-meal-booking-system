import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCoffee,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [formData, setFormData] = useState({
    userType: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { label: "Student", value: "student" },
    { label: "Manager", value: "manager" },
    { label: "Admin", value: "admin" },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getDashboardPath = (role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "manager") return "/manager/dashboard";
    return "/student/dashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userType) {
      setError("Please select user type");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const loggedUser = await login(formData.email, formData.password);

      if (loggedUser.role !== formData.userType) {
        logout();

        setError(
          `You selected ${formData.userType}, but this account belongs to ${loggedUser.role}. Please select correct user type.`
        );

        return;
      }

      navigate(getDashboardPath(loggedUser.role));
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left branding section */}
        <div className="hidden lg:block fade-in">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full" />

            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-3xl shadow-lg mb-6">
                <FiCoffee />
              </div>

              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                Smart Mess Booking <br />
                <span className="text-blue-700">Made Simple</span>
              </h1>

              <p className="text-slate-600 text-lg leading-8 mb-8">
                Book meals, pay securely, verify QR coupons, and manage refunds
                from one professional dashboard.
              </p>

              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FiShield />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Secure Role Login
                    </h3>
                    <p className="text-sm text-slate-500">
                      Separate access for student, manager, and admin.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
                    <FiUserCheck />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Real-Time Dashboard
                    </h3>
                    <p className="text-sm text-slate-500">
                      Track bookings, payments, QR status, and refunds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="form-card p-7 md:p-10 fade-in">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg mb-4">
              <FiCoffee />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900">Login</h2>
            <p className="text-slate-500 mt-2">
              Select your role and sign in to continue.
            </p>
          </div>

          {error && (
            <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-5 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                User Type
              </label>

              <div className="relative">
                <FiUserCheck className="auth-icon" />

                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="auth-select"
                  required
                >
                  <option value="">Please Select</option>
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Email
              </label>

              <div className="relative">
                <FiMail className="auth-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <FiLock className="auth-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            New student?{" "}
            <Link to="/register" className="text-blue-700 font-extrabold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;