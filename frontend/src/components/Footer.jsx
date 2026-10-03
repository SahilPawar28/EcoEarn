import React from "react";
import { Box, Container, Stack, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";

const Footer = () => (
  <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", mt: "auto", py: 4 }}>
    <Container maxWidth="lg">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box component="img" src="/logo.png" alt="EcoEarn" sx={{ height: 22 }} />
          <Typography fontFamily="Poppins" fontWeight={600}>
            EcoEarn
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 3 }}>
          <MuiLink component={Link} to="/about" color="text.secondary" underline="hover" fontSize={14}>
            About
          </MuiLink>
          <MuiLink component={Link} to="/recycling-info" color="text.secondary" underline="hover" fontSize={14}>
            Recycling Info
          </MuiLink>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <FiMail size={14} />
            <Typography variant="body2" color="text.secondary">
              support@ecoearn.app
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <FiPhone size={14} />
            <Typography variant="body2" color="text.secondary">
              +91 98765 43210
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Typography variant="caption" color="text.secondary" display="block" textAlign={{ xs: "left", sm: "center" }} mt={3}>
        © {new Date().getFullYear()} EcoEarn — recycle, earn, repeat.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
