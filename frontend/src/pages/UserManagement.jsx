import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setPageLoading(true);

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
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.patch(`/users/${userId}/role`, {
        role: newRole,
      });

      setSuccess("User role updated successfully.");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.patch(`/users/${userId}/toggle-status`);
      setSuccess("User status updated successfully.");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-blue-700">User Management</h1>

        <Link
          to="/admin/dashboard"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      {success && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </p>
      )}

      <div className="bg-white shadow rounded p-4 mb-6">
        <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search name, email, roll no."
            className="border px-3 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button className="bg-blue-700 text-white px-4 py-2 rounded">
            Search
          </button>
        </form>
      </div>

      {pageLoading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <div className="bg-white shadow rounded p-6">No users found.</div>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Roll No.</th>
                <th className="p-3 text-left">Hostel/Room</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.rollNumber || "-"}</td>
                  <td className="p-3">
                    {user.hostel || "-"} / {user.roomNumber || "-"}
                  </td>

                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      disabled={loading}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="student">Student</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="p-3">
                    {user.isActive ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleToggleStatus(user._id)}
                      disabled={loading}
                      className={`px-3 py-1 rounded text-white ${
                        user.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;