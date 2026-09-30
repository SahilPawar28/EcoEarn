import React from "react";
import { Container, Typography } from "@mui/material";

const About = () => {
  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        About Blockchain Waste Management
      </Typography>
      <Typography variant="body1">
        Our project aims to revolutionize waste management through blockchain, ensuring transparency,
        incentivizing users, and making cities cleaner.
      </Typography>
    </Container>
  );
};

export default About;
