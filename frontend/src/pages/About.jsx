import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent } from "@mui/material";
import { MdOutlineVerified, MdOutlineBolt, MdOutlineGroups } from "react-icons/md";
import { colors } from "../theme";

const points = [
  {
    icon: <MdOutlineVerified size={24} />,
    title: "Transparent by design",
    text: "Every reward minted and every redemption is recorded on-chain, verifiable by anyone.",
  },
  {
    icon: <MdOutlineBolt size={24} />,
    title: "Incentive-driven",
    text: "Real token rewards make responsible recycling worth doing, not just a chore.",
  },
  {
    icon: <MdOutlineGroups size={24} />,
    title: "Built for everyone",
    text: "Dedicated flows for users, waste collectors, recycling centers, and admins.",
  },
];

const About = () => (
  <Box sx={{ background: `linear-gradient(160deg, ${colors.tint} 0%, #FFFFFF 40%)`, py: { xs: 6, md: 9 } }}>
    <Container maxWidth="md">
      <Typography variant="h3" fontWeight={700} gutterBottom sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}>
        About EcoEarn
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={620} mb={5}>
        EcoEarn combines everyday waste management with blockchain technology to make
        recycling transparent, rewarding, and genuinely worth participating in — for
        households and recycling businesses alike.
      </Typography>

      <Grid container spacing={3}>
        {points.map((p) => (
          <Grid size={{ xs: 12, sm: 4 }} key={p.title}>
            <Card sx={{ height: "100%", borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: colors.tint,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  {p.icon}
                </Box>
                <Typography fontWeight={600} gutterBottom>
                  {p.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.text}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default About;
