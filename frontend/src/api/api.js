import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Attach token automatically with every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("messToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: handle unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("messToken");
      localStorage.removeItem("messUser");
    }

    return Promise.reject(error);
  }
);

export default API;