import React, { useState } from "react";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await api.post("/api/auth/signup", {
        name,
        email,
        password,
        role,
      });

      if (response?.data?.success) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert("Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error);
      alert("Error during signup. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <Typography className="signup-title">SIGN UP</Typography>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <TextField
          select
          label="Select Role"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input-field"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="recycler">Recycler</MenuItem>
          <MenuItem value="collector">Collector</MenuItem>
        </TextField>

        <Button className="create-account-btn" onClick={handleSignup}>
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default Signup;
