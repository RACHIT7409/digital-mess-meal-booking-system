import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  });

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
    setLoading(true);

    try {
      const res = await API.post("/auth/register", formData);

      login(res.data.token, res.data.user);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Student Registration
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            className="border px-3 py-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="rollNumber"
            placeholder="Roll Number"
            className="border px-3 py-2 rounded"
            value={formData.rollNumber}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border px-3 py-2 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            className="border px-3 py-2 rounded"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            name="hostel"
            placeholder="Hostel"
            className="border px-3 py-2 rounded"
            value={formData.hostel}
            onChange={handleChange}
          />

          <input
            name="roomNumber"
            placeholder="Room Number"
            className="border px-3 py-2 rounded"
            value={formData.roomNumber}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border px-3 py-2 rounded md:col-span-2"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full mt-6 bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-blue-700 font-medium">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;