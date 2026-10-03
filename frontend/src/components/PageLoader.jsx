import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const PageLoader = ({ label = "Loading..." }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 8 }}>
    <CircularProgress size={32} thickness={4} />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

export default PageLoader;
