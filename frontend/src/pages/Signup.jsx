import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Container,
  Paper,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useNotify } from "../context/NotificationContext";
import {
  MdOutlinePerson,
  MdOutlineEmail,
  MdLockOutline,
  MdVisibility,
  MdVisibilityOff,
  MdEco,
  MdOutlineBadge,
} from "react-icons/md";
import { colors } from "../theme";

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "recycler", label: "Recycler" },
  { value: "collector", label: "Collector" },
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notify = useNotify();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/signup", { name, email, password, role });

      if (response?.data?.success) {
        notify("Account created — please log in.", "success");
        navigate("/login");
      } else {
        notify("Signup failed. Try again.", "error");
      }
    } catch (error) {
      notify(error.response?.data?.message || "Error during signup. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        background: `linear-gradient(160deg, ${colors.tint} 0%, #FFFFFF 60%)`,
        py: 6,
      }}
    >
      <Container maxWidth="xs">
        <Paper component="form" onSubmit={handleSignup} elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: colors.tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdEco size={26} color={colors.primary} />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            Join EcoEarn and start earning for recycling
          </Typography>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdOutlinePerson />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdOutlineEmail />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLockOutline />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label="Toggle password visibility">
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Select Role"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdOutlineBadge />
                </InputAdornment>
              ),
            }}
          >
            {roles.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" mt={3}>
            Already have an account?{" "}
            <MuiLink component={Link} to="/login" fontWeight={600}>
              Log in
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
