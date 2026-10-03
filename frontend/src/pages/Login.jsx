import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotificationContext";
import { MdOutlineEmail, MdLockOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { colors } from "../theme";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const notify = useNotify();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      notify(`Welcome back, ${user.name || "there"}!`, "success");

      switch (user.role) {
        case "user":
          navigate("/dashboard/user", { replace: true });
          break;
        case "admin":
          navigate("/dashboard/admin", { replace: true });
          break;
        case "recycler":
          navigate("/dashboard/recycler", { replace: true });
          break;
        case "collector":
          navigate("/dashboard/collector", { replace: true });
          break;
        default:
          notify("Invalid role. Contact admin.", "error");
          navigate("/", { replace: true });
      }
    } catch (error) {
      notify(error.message, "error");
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
        <Paper component="form" onSubmit={handleLogin} elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: colors.tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box component="img" src="/logo.png" alt="EcoEarn" sx={{ height: 28 }} />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            Log in to manage pickups and rewards
          </Typography>

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

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" mt={3}>
            Don't have an account?{" "}
            <MuiLink component={Link} to="/signup" fontWeight={600}>
              Sign up
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
