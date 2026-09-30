import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

// ✅ Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load User from LocalStorage on Page Load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Login Function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      if (response.data.user && response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        return response.data.user; // ✅ Returning user for redirection
      } else {
        throw new Error("Invalid Login Response");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // ✅ Logout Function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export useAuth Correctly
export const useAuth = () => {
  return useContext(AuthContext);
};
