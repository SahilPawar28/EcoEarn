import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

// ✅ Create Auth Context
const AuthContext = createContext();

// Read any existing session synchronously so the very first render already
// knows whether someone's logged in — reading this in a useEffect instead left
// a brief window where `user` was null on a fresh page load, which made
// PrivateRoute redirect to /login before the real session had a chance to load.
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

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
