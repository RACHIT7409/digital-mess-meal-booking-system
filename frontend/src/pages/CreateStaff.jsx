import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCoffee,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";

const CreateStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "manager",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "manager",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/users/staff", formData);

      setSuccess(`${formData.role} account created successfully.`);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <PageHeader
        title="Create Staff"
        subtitle="Create manager or admin accounts with role-based access."
        rightContent={
          <Link
            to="/admin/dashboard"
            className="btn-dark flex items-center gap-2"
          >
            <FiArrowLeft />
            Back
          </Link>
        }
      />

      <div className="grid xl:grid-cols-[1fr_420px] gap-6 items-start">
        <form onSubmit={handleSubmit} className="form-card p-7 md:p-9 fade-in">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg">
              <FiUserPlus />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Staff Account Details
              </h2>
              <p className="text-slate-500 mt-1">
                Fill staff information carefully before creating account.
              </p>
            </div>
          </div>

          {error && (
            <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-5 text-sm">
              {error}
            </p>
          )}

          {success && (
            <p className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl mb-5 text-sm">
              {success}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Full Name
              </label>

              <div className="relative">
                <FiUser className="auth-icon" />
                <input
                  name="name"
                  placeholder="Enter full name"
                  className="auth-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
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
                  className="auth-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Phone
              </label>

              <div className="relative">
                <FiPhone className="auth-icon" />
                <input
                  name="phone"
                  placeholder="10-digit phone number"
                  className="auth-input"
                  value={formData.phone}
                  onChange={handleChange}
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
                  type="password"
                  name="password"
                  placeholder="Create password"
                  className="auth-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-2">
                Staff Role
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label
                  className={`cursor-pointer rounded-2xl border p-5 transition ${
                    formData.role === "manager"
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="manager"
                    checked={formData.role === "manager"}
                    onChange={handleChange}
                    className="hidden"
                  />

                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <FiCoffee />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900">
                        Manager
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Can verify QR, view bookings, and handle refunds.
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-2xl border p-5 transition ${
                    formData.role === "admin"
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleChange}
                    className="hidden"
                  />

                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <FiShield />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900">Admin</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Can manage users, meals, staff, reports, and settings.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="btn-primary w-full mt-7 flex items-center justify-center gap-2 py-3 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Staff Account"}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <aside className="pro-card p-6 fade-in">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl mb-4">
            <FiUsers />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-3">
            Staff Access Guide
          </h2>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <h3 className="font-extrabold text-slate-900">Manager Access</h3>
              <p className="text-sm text-slate-500 mt-1">
                Best for mess counter staff. Manager can scan QR coupons, mark
                meals as served, mark bookings as not served, and process refund
                requests.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <h3 className="font-extrabold text-slate-900">Admin Access</h3>
              <p className="text-sm text-slate-500 mt-1">
                Best for system owner. Admin can manage users, staff accounts,
                meal prices, availability, reports, and system-level actions.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <h3 className="font-extrabold text-orange-700">
                Security Tip
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Create admin accounts only for trusted people because admins can
                change roles and deactivate users.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CreateStaff;