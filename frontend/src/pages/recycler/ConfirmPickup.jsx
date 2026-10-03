import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress } from "@mui/material";
import api from "../../api";
import { useNotify } from "../../context/NotificationContext";
import { MdOutlineTaskAlt } from "react-icons/md";
import { colors } from "../../theme";

const ConfirmPickup = () => {
  const [pickupId, setPickupId] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const confirmPickup = (e) => {
    e.preventDefault();
    if (!pickupId) {
      notify("Enter a pickup ID.", "warning");
      return;
    }
    setLoading(true);
    api
      .post(`/api/pickups/${pickupId}/complete`)
      .then(() => {
        notify("Pickup marked as completed", "success");
        setPickupId("");
      })
      .catch((err) => {
        console.error(err);
        notify("Failed to confirm pickup. Check the pickup ID.", "error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper component="form" onSubmit={confirmPickup} elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: colors.tint, color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MdOutlineTaskAlt size={22} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            Confirm Waste Pickup
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Mark an accepted pickup as completed once collected.
        </Typography>
        <TextField label="Pickup ID" value={pickupId} onChange={(e) => setPickupId(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Confirm Pickup"}
        </Button>
      </Paper>
    </Container>
  );
};

export default ConfirmPickup;
