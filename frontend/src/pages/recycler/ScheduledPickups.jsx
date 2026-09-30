import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Grid } from "@mui/material";
import api from "../../api";

const ScheduledPickups = () => {
  const [pickups, setPickups] = useState([]);

  const loadPickups = () => {
    api
      .get("/api/pickups/scheduled")
      .then((res) => setPickups(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadPickups();
  }, []);

  const acceptPickup = (id) => {
    api
      .post(`/api/pickups/${id}/accept`)
      .then(() => setPickups((prev) => prev.filter((p) => p._id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>📅 Scheduled Pickups</Typography>
      {pickups.length === 0 && <Typography>No pending pickups right now.</Typography>}
      <Grid container spacing={3}>
        {pickups.map((pickup) => (
          <Grid item xs={12} md={6} key={pickup._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{pickup.wasteType} Waste</Typography>
                <Typography variant="body2">Location: {pickup.address}</Typography>
                <Typography variant="body2">Date: {pickup.date}</Typography>
                <Typography variant="body2">Requested by: {pickup.user?.name}</Typography>
                <Button variant="contained" color="primary" onClick={() => acceptPickup(pickup._id)}>
                  Accept Pickup
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ScheduledPickups;
