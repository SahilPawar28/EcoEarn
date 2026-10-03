import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdOutlineRecycling } from "react-icons/md";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <MdOutlineRecycling size={72} color="#4CA868" />
      <Typography variant="h3" fontWeight={700} mt={2}>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" mt={1} mb={3}>
        This page got sorted into the wrong bin.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Stack>
    </Box>
  );
};

export default NotFound;
