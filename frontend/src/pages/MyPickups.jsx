import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Chip, Grid } from "@mui/material";
import api from "../api";

const statusColor = { pending: "warning", accepted: "info", completed: "success" };

const MyPickups = () => {
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    api
      .get("/api/pickups/mine")
      .then((res) => setPickups(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container sx={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>♻️ My Pickups</Typography>
      {pickups.length === 0 && <Typography>No pickups scheduled yet.</Typography>}
      <Grid container spacing={3}>
        {pickups.map((pickup) => (
          <Grid item xs={12} md={6} key={pickup._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{pickup.wasteType} Waste</Typography>
                <Typography variant="body2">Location: {pickup.address}</Typography>
                <Typography variant="body2">Date: {pickup.date}</Typography>
                <Chip
                  label={pickup.status}
                  color={statusColor[pickup.status] || "default"}
                  size="small"
                  sx={{ marginTop: "8px" }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyPickups;
