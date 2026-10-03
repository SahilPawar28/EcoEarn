import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Chip, Grid, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import PageLoader from "../components/PageLoader";
import EmptyState from "../components/EmptyState";
import { MdOutlineRecycling, MdOutlineCalendarToday, MdOutlinePlace, MdAdd } from "react-icons/md";

const statusColor = { pending: "warning", accepted: "info", completed: "success" };

const MyPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/pickups/mine")
      .then((res) => setPickups(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          My Pickups
        </Typography>
        <Button variant="contained" startIcon={<MdAdd />} onClick={() => navigate("/schedule-pickup")}>
          Schedule Pickup
        </Button>
      </Box>

      {loading ? (
        <PageLoader label="Loading your pickups..." />
      ) : pickups.length === 0 ? (
        <EmptyState
          icon={<MdOutlineRecycling size={40} />}
          title="No pickups yet"
          description="Schedule your first pickup to start earning RCT tokens."
        />
      ) : (
        <Grid container spacing={3}>
          {pickups.map((pickup) => (
            <Grid size={{ xs: 12, sm: 6 }} key={pickup._id}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="h6" fontWeight={600}>
                      {pickup.wasteType} Waste
                    </Typography>
                    <Chip label={pickup.status} color={statusColor[pickup.status] || "default"} size="small" sx={{ textTransform: "capitalize" }} />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, color: "text.secondary" }}>
                    <MdOutlinePlace size={16} />
                    <Typography variant="body2">{pickup.address}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, color: "text.secondary" }}>
                    <MdOutlineCalendarToday size={16} />
                    <Typography variant="body2">{pickup.date}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyPickups;
