import React from "react";
import { Container, Typography, Box, Stack } from "@mui/material";
import { MdOutlineLocalDrink, MdOutlineDescription, MdOutlineMemory, MdOutlineCompost } from "react-icons/md";
import { colors } from "../theme";

const categories = [
  { icon: <MdOutlineLocalDrink size={22} />, label: "Plastic", text: "Bottles, containers, and packaging — rinsed and dry." },
  { icon: <MdOutlineDescription size={22} />, label: "Paper", text: "Cardboard, newspapers, and office paper." },
  { icon: <MdOutlineMemory size={22} />, label: "E-Waste", text: "Old devices, cables, and batteries — handled safely." },
  { icon: <MdOutlineCompost size={22} />, label: "Organic", text: "Food scraps and garden waste for composting." },
];

const RecyclingInfo = () => (
  <Box sx={{ background: `linear-gradient(160deg, ${colors.tint} 0%, #FFFFFF 40%)`, py: { xs: 6, md: 9 } }}>
    <Container maxWidth="md">
      <Typography variant="h3" fontWeight={700} gutterBottom sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}>
        Recycling Information
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={620} mb={5}>
        Recycling helps reduce pollution and waste. Sort your waste by type below, then
        schedule a pickup — verified recyclers process it and you earn RCT tokens for every
        confirmed pickup.
      </Typography>

      <Stack spacing={2}>
        {categories.map((c) => (
          <Box
            key={c.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2.5,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: colors.tint,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {c.icon}
            </Box>
            <Box>
              <Typography fontWeight={600}>{c.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {c.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Container>
  </Box>
);

export default RecyclingInfo;
