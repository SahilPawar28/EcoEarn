import React, { useState } from "react";
import { Container, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

const SchedulePickup = () => {
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [wasteType, setWasteType] = useState("Plastic");
  const navigate = useNavigate();

  const handleSchedule = async () => {
    if (!date || !address) {
      alert("Please fill in the date and address.");
      return;
    }
    try {
      await api.post("/api/pickups", { date, address, wasteType });
      alert("Waste Pickup Scheduled Successfully!");
      navigate("/dashboard/user");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to schedule pickup.");
    }
  };

  return (
    <Container sx={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>Schedule Waste Pickup</Typography>
      <TextField
        select
        label="Waste Type"
        fullWidth
        margin="normal"
        value={wasteType}
        onChange={(e) => setWasteType(e.target.value)}
      >
        <MenuItem value="Plastic">Plastic</MenuItem>
        <MenuItem value="Paper">Paper</MenuItem>
        <MenuItem value="Metal">Metal</MenuItem>
        <MenuItem value="E-Waste">E-Waste</MenuItem>
        <MenuItem value="Organic">Organic</MenuItem>
      </TextField>
      <TextField
        label="Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <TextField
        label="Pickup Address"
        fullWidth
        margin="normal"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSchedule}>
        Schedule Pickup
      </Button>
    </Container>
  );
};

export default SchedulePickup;
