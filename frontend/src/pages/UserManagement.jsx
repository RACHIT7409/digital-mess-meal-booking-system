import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setPageLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (role) params.append("role", role);
      if (search) params.append("search", search);
      if (isActive) params.append("isActive", isActive);

      const url = params.toString() ? `/users?${params.toString()}` : "/users";

      const res = await API.get(url);
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, isActive]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    const confirmChange = window.confirm(
      `Are you sure you want to change this user's role to ${newRole}?`
    );

    if (!confirmChange) return;

    setError("");
    setSuccess("");
    setLoadingId(userId);

    try {
      await API.patch(`/users/${userId}/role`, {
        role: newRole,
      });

      setSuccess("User role updated successfully.");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const confirmChange = window.confirm(
      currentStatus
        ? "Are you sure you want to deactivate this user?"
        : "Are you sure you want to activate this user?"
    );

    if (!confirmChange) return;

    setError("");
    setSuccess("");
    setLoadingId(userId);

    try {
      await API.patch(`/users/${userId}/toggle-status`);
      setSuccess("User status updated successfully.");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  if (pageLoading) {
    return (
      <main className="page-container">
        <div className="glass-card p-6">Loading users...</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <PageHeader
        title="User Management"
        subtitle="Manage students, managers, admins, roles, and account status."
        rightContent={
          <>
            <button
              onClick={fetchUsers}
              className="btn-primary flex items-center gap-2"
            >
              <FiRefreshCw />
              Refresh
            </button>

            <Link
              to="/admin/dashboard"
              className="btn-dark flex items-center gap-2"
            >
              <FiArrowLeft />
              Back
            </Link>
          </>
        }
      />

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-4">
          {error}
        </p>
      )}

      {success && (
        <p className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl mb-4">
          {success}
        </p>
      )}

      <div className="glass-card p-5 mb-6">
        <form onSubmit={handleSearch} className="grid lg:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="auth-icon" />
            <input
              type="text"
              placeholder="Search name, email, roll number"
              className="auth-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="w-full"
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button className="btn-primary flex items-center justify-center gap-2">
            <FiSearch />
            Search
          </button>
        </form>
      </div>

      {users.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <FiUsers className="mx-auto text-4xl text-blue-700 mb-3" />
          <h2 className="text-xl font-extrabold">No users found</h2>
          <p className="text-slate-500 mt-2">
            Try changing filters or search query.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="table-card hidden lg:block">
            <table className="table-pro">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Roll No.</th>
                  <th>Hostel / Room</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-extrabold">{user.name}</p>
                          <p className="text-xs text-slate-500">{user._id}</p>
                        </div>
                      </div>
                    </td>

                    <td>{user.email}</td>
                    <td>{user.rollNumber || "-"}</td>
                    <td>
                      {user.hostel || "-"} / {user.roomNumber || "-"}
                    </td>

                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        disabled={loadingId === user._id}
                        className="min-w-[130px]"
                      >
                        <option value="student">Student</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td>
                      <StatusBadge
                        status={user.isActive ? "ACTIVE" : "INACTIVE"}
                      />
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleToggleStatus(user._id, user.isActive)
                        }
                        disabled={loadingId === user._id}
                        className={
                          user.isActive
                            ? "btn-danger text-sm"
                            : "btn-success text-sm"
                        }
                      >
                        {loadingId === user._id
                          ? "Updating..."
                          : user.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-5 lg:hidden">
            {users.map((user) => (
              <div key={user._id} className="pro-card p-5 fade-in">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-extrabold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold">{user.name}</h2>
                      <p className="text-sm text-slate-500 break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-500">Roll Number</p>
                    <h3 className="font-extrabold">{user.rollNumber || "-"}</h3>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-500">Hostel / Room</p>
                    <h3 className="font-extrabold">
                      {user.hostel || "-"} / {user.roomNumber || "-"}
                    </h3>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 sm:col-span-2">
                    <p className="text-sm text-slate-500">Role</p>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      disabled={loadingId === user._id}
                      className="w-full mt-2"
                    >
                      <option value="student">Student</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(user._id, user.isActive)}
                  disabled={loadingId === user._id}
                  className={
                    user.isActive
                      ? "btn-danger w-full"
                      : "btn-success w-full"
                  }
                >
                  {loadingId === user._id
                    ? "Updating..."
                    : user.isActive
                    ? "Deactivate User"
                    : "Activate User"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default UserManagement;