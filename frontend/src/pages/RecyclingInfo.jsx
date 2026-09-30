import React from "react";
import { Container, Typography } from "@mui/material";

const RecyclingInfo = () => {
  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Recycling Information
      </Typography>
      <Typography variant="body1">
        Recycling helps reduce pollution and waste. By using our platform, you can easily recycle
        your waste and earn rewards through blockchain technology.
      </Typography>
    </Container>
  );
};

export default RecyclingInfo;
