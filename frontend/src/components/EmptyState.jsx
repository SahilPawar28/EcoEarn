import React from "react";
import { Box, Typography } from "@mui/material";

const EmptyState = ({ icon, title, description }) => (
  <Box
    sx={{
      textAlign: "center",
      py: 6,
      px: 2,
      borderRadius: 3,
      border: "1px dashed",
      borderColor: "divider",
      bgcolor: "background.paper",
    }}
  >
    <Box sx={{ color: "primary.light", mb: 1.5, display: "flex", justifyContent: "center" }}>{icon}</Box>
    <Typography fontWeight={600}>{title}</Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        {description}
      </Typography>
    )}
  </Box>
);

export default EmptyState;
