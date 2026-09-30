import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Grid } from "@mui/material";
import api from "../../api";

const TrackRecycledMaterial = () => {
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    api
      .get("/api/pickups/completed")
      .then((res) => setPickups(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container sx={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>♻️ Track Recycled Material</Typography>
      {pickups.length === 0 && <Typography>No completed pickups yet.</Typography>}
      <Grid container spacing={3}>
        {pickups.map((pickup) => (
          <Grid item xs={12} md={6} key={pickup._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{pickup.wasteType} Waste</Typography>
                <Typography variant="body2">Location: {pickup.address}</Typography>
                <Typography variant="body2">Collected from: {pickup.user?.name}</Typography>
                <Typography variant="body2">Completed: {new Date(pickup.updatedAt).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TrackRecycledMaterial;
