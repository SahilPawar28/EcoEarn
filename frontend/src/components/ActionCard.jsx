import React from "react";
import { Card, CardActionArea, CardContent, Box, Typography } from "@mui/material";
import { colors } from "../theme";

const ActionCard = ({ icon, title, description, onClick }) => (
  <Card sx={{ height: "100%", borderRadius: 4 }}>
    <CardActionArea onClick={onClick} disabled={!onClick} sx={{ height: "100%", p: 0.5 }}>
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
          {icon}
        </Box>
        <Typography fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default ActionCard;
