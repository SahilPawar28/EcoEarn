import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import { MdEco, MdOutlineDashboard, MdOutlineLogout, MdMenu, MdClose } from "react-icons/md";
import { FiInfo, FiBookOpen } from "react-icons/fi";

const navLinks = [
  { label: "About", to: "/about", icon: <FiInfo /> },
  { label: "Recycling Info", to: "/recycling-info", icon: <FiBookOpen /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  const AuthButtons = ({ stack }) => (
    <Box sx={{ display: "flex", flexDirection: stack ? "column" : "row", gap: 1.5, width: stack ? "100%" : "auto" }}>
      {!user ? (
        <>
          <Button
            fullWidth={stack}
            variant="outlined"
            onClick={() => {
              closeDrawer();
              navigate("/signup");
            }}
          >
            Sign Up
          </Button>
          <Button
            fullWidth={stack}
            variant="contained"
            onClick={() => {
              closeDrawer();
              navigate("/login");
            }}
          >
            Login
          </Button>
        </>
      ) : (
        <>
          <Button
            fullWidth={stack}
            variant="outlined"
            startIcon={<MdOutlineDashboard />}
            onClick={() => {
              closeDrawer();
              navigate(`/dashboard/${user.role}`);
            }}
          >
            Dashboard
          </Button>
          <Button
            fullWidth={stack}
            variant="text"
            color="inherit"
            startIcon={<MdOutlineLogout />}
            onClick={() => {
              closeDrawer();
              logout();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar sx={{ maxWidth: "lg", width: "100%", mx: "auto", py: 1 }}>
        <Box
          component={Link}
          to="/"
          sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", color: "inherit", flexGrow: 1 }}
        >
          <MdEco size={26} color={theme.palette.primary.main} />
          <Typography variant="h6" fontFamily="Poppins" fontWeight={700} color="text.primary">
            EcoEarn
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mr: 3 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                color="inherit"
                sx={{
                  fontWeight: 500,
                  color: location.pathname === link.to ? "primary.main" : "text.secondary",
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {!isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {user && (
              <Chip
                avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{user.name?.[0]?.toUpperCase() || "U"}</Avatar>}
                label={user.role}
                size="small"
                sx={{ textTransform: "capitalize", bgcolor: colors.tint, color: "primary.dark", fontWeight: 600 }}
              />
            )}
            <AuthButtons />
          </Box>
        ) : (
          <IconButton onClick={() => setDrawerOpen(true)} edge="end" aria-label="Open menu">
            <MdMenu size={26} />
          </IconButton>
        )}
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <Box sx={{ width: 280, p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MdEco size={22} color={theme.palette.primary.main} />
              <Typography fontFamily="Poppins" fontWeight={700}>
                EcoEarn
              </Typography>
            </Box>
            <IconButton onClick={closeDrawer} aria-label="Close menu">
              <MdClose />
            </IconButton>
          </Box>

          {user && (
            <Chip
              avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{user.name?.[0]?.toUpperCase() || "U"}</Avatar>}
              label={`${user.name} · ${user.role}`}
              sx={{ mb: 2, alignSelf: "flex-start", textTransform: "capitalize", bgcolor: colors.tint }}
            />
          )}

          <List>
            {navLinks.map((link) => (
              <ListItemButton key={link.to} component={Link} to={link.to} onClick={closeDrawer}>
                <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <AuthButtons stack />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
