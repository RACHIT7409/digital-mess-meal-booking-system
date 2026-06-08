import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/users/staff", formData);

      setSuccess(`${formData.role} account created successfully.`);

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "manager",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-6 w-full max-w-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Create Staff</h1>

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

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            className="w-full border px-3 py-2 rounded"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            className="w-full border px-3 py-2 rounded"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Staff"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStaff;