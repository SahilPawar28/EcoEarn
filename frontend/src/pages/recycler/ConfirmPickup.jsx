import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Grid, Box, Chip } from "@mui/material";
import api from "../../api";
import { useNotify } from "../../context/NotificationContext";
import PageLoader from "../../components/PageLoader";
import EmptyState from "../../components/EmptyState";
import { MdOutlineTaskAlt, MdOutlinePlace, MdOutlineCalendarToday, MdOutlinePerson } from "react-icons/md";

const ConfirmPickup = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const notify = useNotify();

  const loadPickups = () => {
    setLoading(true);
    api
      .get("/api/pickups/accepted")
      .then((res) => setPickups(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPickups();
  }, []);

  const completePickup = (id) => {
    setActingId(id);
    api
      .post(`/api/pickups/${id}/complete`)
      .then(() => {
        setPickups((prev) => prev.filter((p) => p._id !== id));
        notify("Pickup marked as completed", "success");
      })
      .catch((err) => {
        console.error(err);
        notify("Failed to confirm pickup", "error");
      })
      .finally(() => setActingId(null));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Confirm Waste Pickup
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Pickups you've accepted — mark them completed once collected.
      </Typography>

      {loading ? (
        <PageLoader />
      ) : pickups.length === 0 ? (
        <EmptyState
          icon={<MdOutlineTaskAlt size={40} />}
          title="Nothing to confirm"
          description="Accept a pickup first, then it'll show up here."
        />
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
                    <Chip label="accepted" color="info" size="small" />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, color: "text.secondary" }}>
                    <MdOutlinePlace size={16} />
                    <Typography variant="body2">{pickup.address}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, color: "text.secondary" }}>
                    <MdOutlineCalendarToday size={16} />
                    <Typography variant="body2">{pickup.date}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, color: "text.secondary" }}>
                    <MdOutlinePerson size={16} />
                    <Typography variant="body2">{pickup.user?.name || "Unknown user"}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ mt: 2.5 }}
                    onClick={() => completePickup(pickup._id)}
                    disabled={actingId === pickup._id}
                  >
                    {actingId === pickup._id ? "Confirming..." : "Confirm Pickup"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ConfirmPickup;
