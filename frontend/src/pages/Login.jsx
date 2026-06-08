import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
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

  const redirectByRole = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "manager") navigate("/manager/dashboard");
    else navigate("/student/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      login(res.data.token, res.data.user);
      redirectByRole(res.data.user.role);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border px-3 py-2 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border px-3 py-2 rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4">
          New student?{" "}
          <Link to="/register" className="text-blue-700 font-medium">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;