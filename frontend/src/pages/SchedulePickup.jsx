import React, { useState } from "react";
import { Container, TextField, Button, Typography, MenuItem, Paper, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useNotify } from "../context/NotificationContext";
import { MdOutlineLocalShipping } from "react-icons/md";
import { colors } from "../theme";

const wasteTypes = ["Plastic", "Paper", "Metal", "E-Waste", "Organic"];

const SchedulePickup = () => {
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [wasteType, setWasteType] = useState("Plastic");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notify = useNotify();

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!date || !address) {
      notify("Please fill in the date and address.", "warning");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/pickups", { date, address, wasteType });
      notify("Waste pickup scheduled successfully!", "success");
      navigate("/dashboard/user");
    } catch (error) {
      console.error("Error:", error);
      notify("Failed to schedule pickup.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper component="form" onSubmit={handleSchedule} elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: colors.tint, color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MdOutlineLocalShipping size={22} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            Schedule Waste Pickup
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Tell us what you're recycling and where to collect it from.
        </Typography>

        <TextField
          select
          label="Waste Type"
          fullWidth
          margin="normal"
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
        >
          {wasteTypes.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          label="Pickup Address"
          fullWidth
          margin="normal"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 3 }} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Schedule Pickup"}
        </Button>
      </Paper>
    </Container>
  );
};

export default SchedulePickup;
