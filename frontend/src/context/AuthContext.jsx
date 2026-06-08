import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("messToken"));
  const [loading, setLoading] = useState(true);

  const login = (tokenValue, userData) => {
    localStorage.setItem("messToken", tokenValue);
    localStorage.setItem("messUser", JSON.stringify(userData));

    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("messToken");
    localStorage.removeItem("messUser");

    setToken(null);
    setUser(null);
  };

const updateUser = (updatedUser) => {
  localStorage.setItem("messUser", JSON.stringify(updatedUser));
  setUser(updatedUser);
};


  const fetchMe = async () => {
    try {
      const savedToken = localStorage.getItem("messToken");
      const savedUser = localStorage.getItem("messUser");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const res = await API.get("/auth/me");

      setUser(res.data.user);
      localStorage.setItem("messUser", JSON.stringify(res.data.user));
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};