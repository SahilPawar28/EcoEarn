import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        {/* ✅ App Name */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            🌱 EcoEarn
          </Link>
        </Typography>

        {/* ✅ Show Login/Signup when no user is logged in */}
        {!user ? (
          <Box>
           <Button
  variant="contained"
  onClick={() => navigate("/signup")}
  sx={{
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    padding: "8px 16px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  }}
>
  Sign Up
</Button>

<Button
  variant="contained"
  onClick={() => navigate("/login")}
  sx={{
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    padding: "8px 16px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  }}
>
  Login
</Button>

          </Box>
        ) : (
          <Box
  sx={{
    display: 'flex',
    gap: '12px', // ✅ Adds space between the buttons
  }}
>
  <Button
    variant="contained"
    color="white"
    onClick={() => navigate(`/dashboard/${user.role}`)}
    sx={{
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      color: "white",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
      padding: "8px 16px",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
      },
    }}
  >
    Dashboard
  </Button>

  <Button
    variant="contained"
    color="white"
    onClick={logout}
    sx={{
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      color: "white",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
      padding: "8px 16px",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
      },
    }}
  >
    Logout
  </Button>
</Box>

        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
