import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Grid, Box, Chip } from "@mui/material";
import api from "../../api";
import { useNotify } from "../../context/NotificationContext";
import PageLoader from "../../components/PageLoader";
import EmptyState from "../../components/EmptyState";
import { MdOutlineAssignment, MdOutlinePlace, MdOutlineCalendarToday, MdOutlinePerson } from "react-icons/md";

const ScheduledPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const notify = useNotify();

  const loadPickups = () => {
    setLoading(true);
    api
      .get("/api/pickups/scheduled")
      .then((res) => setPickups(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPickups();
  }, []);

  const acceptPickup = (id) => {
    setActingId(id);
    api
      .post(`/api/pickups/${id}/accept`)
      .then(() => {
        setPickups((prev) => prev.filter((p) => p._id !== id));
        notify("Pickup accepted", "success");
      })
      .catch((err) => {
        console.error(err);
        notify("Failed to accept pickup", "error");
      })
      .finally(() => setActingId(null));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Scheduled Pickups
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Pending waste pickup requests from users.
      </Typography>

      {loading ? (
        <PageLoader />
      ) : pickups.length === 0 ? (
        <EmptyState icon={<MdOutlineAssignment size={40} />} title="No pending pickups" description="New requests will show up here." />
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
                    <Chip label="pending" color="warning" size="small" />
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
                    onClick={() => acceptPickup(pickup._id)}
                    disabled={actingId === pickup._id}
                  >
                    {actingId === pickup._id ? "Accepting..." : "Accept Pickup"}
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

export default ScheduledPickups;
