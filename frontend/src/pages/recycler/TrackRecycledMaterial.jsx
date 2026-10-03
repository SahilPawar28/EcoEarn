import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Grid, Box } from "@mui/material";
import api from "../../api";
import PageLoader from "../../components/PageLoader";
import EmptyState from "../../components/EmptyState";
import { MdOutlineRecycling, MdOutlinePlace, MdOutlinePerson, MdOutlineCheckCircle } from "react-icons/md";

const TrackRecycledMaterial = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/pickups/completed")
      .then((res) => setPickups(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Track Recycled Material
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Pickups that have been completed and processed.
      </Typography>

      {loading ? (
        <PageLoader />
      ) : pickups.length === 0 ? (
        <EmptyState icon={<MdOutlineRecycling size={40} />} title="No completed pickups yet" description="Completed pickups will show up here." />
      ) : (
        <Grid container spacing={3}>
          {pickups.map((pickup) => (
            <Grid size={{ xs: 12, md: 6 }} key={pickup._id}>
              <Card sx={{ borderRadius: 4, height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="h6" fontWeight={600}>
                      {pickup.wasteType} Waste
                    </Typography>
                    <MdOutlineCheckCircle size={22} color="#1F7A3F" />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, color: "text.secondary" }}>
                    <MdOutlinePlace size={16} />
                    <Typography variant="body2">{pickup.address}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, color: "text.secondary" }}>
                    <MdOutlinePerson size={16} />
                    <Typography variant="body2">Collected from: {pickup.user?.name || "Unknown"}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Completed {new Date(pickup.updatedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TrackRecycledMaterial;
