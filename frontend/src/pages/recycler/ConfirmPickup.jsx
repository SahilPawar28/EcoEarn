import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import api from "../../api";

const ConfirmPickup = () => {
  const [pickupId, setPickupId] = useState("");

  const confirmPickup = () => {
    api
      .post(`/api/pickups/${pickupId}/complete`)
      .then(() => alert("Pickup marked as completed"))
      .catch((err) => {
        console.error(err);
        alert("Failed to confirm pickup. Check the pickup ID.");
      });
  };

  return (
    <Container>
      <Typography variant="h4">✅ Confirm Waste Pickup</Typography>
      <TextField label="Pickup ID" value={pickupId} onChange={(e) => setPickupId(e.target.value)} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={confirmPickup}>Confirm Pickup</Button>
    </Container>
  );
};

export default ConfirmPickup;
