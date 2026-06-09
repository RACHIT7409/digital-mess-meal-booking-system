import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiHome,
  FiLock,
  FiMail,
  FiPhone,
  FiSave,
  FiShield,
  FiUser,
  FiHash,
} from "react-icons/fi";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    hostel: "",
    roomNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "",
        hostel: user.hostel || "",
        roomNumber: user.roomNumber || "",
      });
    }
  }, [user]);

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "manager") return "/manager/dashboard";
    return "/student/dashboard";
  };

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const res = await API.patch("/users/profile", profileData);
      updateUser(res.data.user);
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    setPasswordLoading(true);

    try {
      await API.patch("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess("Password changed successfully. Please login again.");

      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main className="page-container">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account details, contact information, and password."
        rightContent={
          <Link
            to={getDashboardPath()}
            className="btn-dark flex items-center gap-2"
          >
            <FiArrowLeft />
            Back
          </Link>
        }
      />

      <div className="grid xl:grid-cols-[1fr_420px] gap-6 items-start">
        {/* Profile update form */}
        <form
          onSubmit={handleProfileSubmit}
          className="form-card p-7 md:p-9 fade-in"
        >
          <div className="flex items-center gap-4 mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg">
              <FiUser />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Profile Information
              </h2>
              <p className="text-slate-500 mt-1">
                Keep your basic details updated.
              </p>
            </div>
          </div>

          {profileError && (
            <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-5 text-sm">
              {profileError}
            </p>
          )}

          {profileSuccess && (
            <p className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl mb-5 text-sm">
              {profileSuccess}
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
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Role
              </label>

              <div className="h-[50px] flex items-center px-4 rounded-xl bg-slate-50 border border-slate-200">
                <StatusBadge status={user?.role?.toUpperCase()} />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Email
              </label>

              <div className="relative">
                <FiMail className="auth-icon" />
                <input
                  value={user?.email || ""}
                  className="auth-input bg-slate-100 text-slate-500"
                  disabled
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Email cannot be changed from profile.
              </p>
            </div>

            {user?.role === "student" && (
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Roll Number
                </label>

                <div className="relative">
                  <FiHash className="auth-icon" />
                  <input
                    value={user?.rollNumber || ""}
                    className="auth-input bg-slate-100 text-slate-500"
                    disabled
                  />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Roll number is fixed after registration.
                </p>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Phone
              </label>

              <div className="relative">
                <FiPhone className="auth-icon" />
                <input
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="auth-input"
                  placeholder="10-digit phone number"
                />
              </div>
            </div>

            {user?.role === "student" && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Hostel
                  </label>

                  <div className="relative">
                    <FiHome className="auth-icon" />
                    <input
                      name="hostel"
                      value={profileData.hostel}
                      onChange={handleProfileChange}
                      className="auth-input"
                      placeholder="Example: BH1"
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
                      value={profileData.roomNumber}
                      onChange={handleProfileChange}
                      className="auth-input"
                      placeholder="Example: 205"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            disabled={profileLoading}
            className="btn-primary w-full mt-7 flex items-center justify-center gap-2 py-3 disabled:opacity-60"
          >
            <FiSave />
            {profileLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {/* Account summary */}
        <aside className="pro-card p-6 fade-in">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl mb-4">
            <FiShield />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-3">
            Account Summary
          </h2>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Name</p>
              <h3 className="font-extrabold text-slate-900">
                {user?.name || "-"}
              </h3>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Email</p>
              <h3 className="font-bold text-slate-900 break-all">
                {user?.email || "-"}
              </h3>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Role</p>
              <div className="mt-2">
                <StatusBadge status={user?.role?.toUpperCase()} />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <h3 className="font-extrabold text-orange-700">
                Security Notice
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                After changing your password, you will be logged out
                automatically for account security.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Password section */}
      <section className="mt-7">
        <form
          onSubmit={handlePasswordSubmit}
          className="form-card p-7 md:p-9 fade-in"
        >
          <div className="flex items-center gap-4 mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-2xl shadow-lg">
              <FiLock />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Change Password
              </h2>
              <p className="text-slate-500 mt-1">
                Use a strong password to keep your account secure.
              </p>
            </div>
          </div>

          {passwordError && (
            <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-5 text-sm">
              {passwordError}
            </p>
          )}

          {passwordSuccess && (
            <p className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl mb-5 text-sm">
              {passwordSuccess}
            </p>
          )}

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Current Password
              </label>

              <div className="relative">
                <FiLock className="auth-icon" />
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                New Password
              </label>

              <div className="relative">
                <FiLock className="auth-icon" />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <FiLock className="auth-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>
          </div>

          <button
            disabled={passwordLoading}
            className="btn-danger mt-7 flex items-center justify-center gap-2 py-3 disabled:opacity-60"
          >
            <FiLock />
            {passwordLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Profile;