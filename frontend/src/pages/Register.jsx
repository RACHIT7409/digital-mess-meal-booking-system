import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCoffee,
  FiEye,
  FiEyeOff,
  FiHash,
  FiHome,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    phone: "",
    hostel: "",
    roomNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", {
        name: formData.name,
        rollNumber: formData.rollNumber,
        email: formData.email,
        phone: formData.phone,
        hostel: formData.hostel,
        roomNumber: formData.roomNumber,
        password: formData.password,
      });

      await login(formData.email, formData.password);

      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left information section */}
        <div className="hidden lg:block fade-in">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full" />

            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-3xl shadow-lg mb-6">
                <FiCoffee />
              </div>

              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                Join the Digital <br />
                <span className="text-blue-700">Mess Booking System</span>
              </h1>

              <p className="text-slate-600 text-lg leading-8 mb-8">
                Create your student account to book meals, complete Razorpay
                payment, generate QR coupons, and request refunds easily.
              </p>

              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FiHash />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Roll Number Based Access
                    </h3>
                    <p className="text-sm text-slate-500">
                      Every booking is linked with your official roll number.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
                    <FiShield />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Secure Student Account
                    </h3>
                    <p className="text-sm text-slate-500">
                      Your bookings, payments, coupons, and refunds stay safe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Register card */}
        <div className="form-card p-7 md:p-10 fade-in">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg mb-4">
              <FiCoffee />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900">
              Create Account
            </h2>
            <p className="text-slate-500 mt-2">
              Register as a student to start booking meals.
            </p>
          </div>

          {error && (
            <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-5 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <FiUser className="auth-icon" />
                  <input
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Roll Number
                </label>

                <div className="relative">
                  <FiHash className="auth-icon" />
                  <input
                    name="rollNumber"
                    placeholder="Example: 22UEC123"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>
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
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Phone Number
              </label>

              <div className="relative">
                <FiPhone className="auth-icon" />
                <input
                  name="phone"
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Hostel
                </label>

                <div className="relative">
                  <FiHome className="auth-icon" />
                  <input
                    name="hostel"
                    placeholder="Example: BH1"
                    value={formData.hostel}
                    onChange={handleChange}
                    className="auth-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Room Number
                </label>

                <div className="relative">
                  <FiHome className="auth-icon" />
                  <input
                    name="roomNumber"
                    placeholder="Example: 205"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="auth-input"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <FiLock className="auth-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create password"
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

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <FiLock className="auth-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="auth-input pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-extrabold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;