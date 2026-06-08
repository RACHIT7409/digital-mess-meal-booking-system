import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  //const { user, logout } = useAuth();

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const res = await API.patch("/users/profile", profileData);

      updateUser(res.data.user);
setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
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

    setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">My Profile</h1>

        <Link
          to={getDashboardPath()}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white shadow rounded p-6"
        >
          <h2 className="text-xl font-bold mb-4">Update Profile</h2>

          {profileError && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {profileError}
            </p>
          )}

          {profileSuccess && (
            <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {profileSuccess}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                value={user?.email || ""}
                className="w-full border px-3 py-2 rounded bg-gray-100"
                disabled
              />
            </div>

            {user?.role === "student" && (
              <div>
                <label className="block font-medium mb-1">Roll Number</label>
                <input
                  value={user?.rollNumber || ""}
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  disabled
                />
              </div>
            )}

            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="10-digit phone number"
              />
            </div>

            {user?.role === "student" && (
              <>
                <div>
                  <label className="block font-medium mb-1">Hostel</label>
                  <input
                    name="hostel"
                    value={profileData.hostel}
                    onChange={handleProfileChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Example: BH1"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Room Number</label>
                  <input
                    name="roomNumber"
                    value={profileData.roomNumber}
                    onChange={handleProfileChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Example: 205"
                  />
                </div>
              </>
            )}

            <button
              disabled={loading}
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white shadow rounded p-6"
        >
          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          {passwordError && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {passwordError}
            </p>
          )}

          {passwordSuccess && (
            <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {passwordSuccess}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            After changing password, you will be logged out for security.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Profile;