import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import {
  MdOutlineRecycling,
  MdOutlinePublic,
  MdOutlineWbSunny,
  MdOutlineStorefront,
  MdOutlineMailOutline,
  MdOutlinePhone,
} from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import { colors } from "../theme";

const Section = ({ id, title, text, children }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <Box
      id={id}
      ref={ref}
      sx={{
        py: { xs: 7, md: 10 },
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          {title}
        </Typography>
        {text && (
          <Typography variant="body1" align="center" color="text.secondary" maxWidth={640} mx="auto">
            {text}
          </Typography>
        )}
        {children && <Box mt={5}>{children}</Box>}
      </Container>
    </Box>
  );
};

const FeatureCard = ({ icon, title, text }) => (
  <Card sx={{ height: "100%", borderRadius: 4 }}>
    <CardContent sx={{ p: 3.5 }}>
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 3,
          bgcolor: colors.tint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          color: "primary.main",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </CardContent>
  </Card>
);

const retailers = [
  { name: "Flipkart Green", text: "Offers discounts on eco-friendly products." },
  { name: "Amazon GoGreen", text: "Earn cashback for recycling used electronics." },
  { name: "Big Bazaar Green", text: "Exchange plastic bottles for shopping points." },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          background: `linear-gradient(160deg, ${colors.tint} 0%, #FFFFFF 55%)`,
          py: { xs: 10, md: 14 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            bgcolor: colors.tintStrong,
            opacity: 0.6,
            display: { xs: "none", md: "block" },
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Chip
            icon={<MdOutlineRecycling />}
            label="Blockchain-powered recycling rewards"
            sx={{ bgcolor: "white", border: "1px solid", borderColor: "divider", mb: 3, fontWeight: 600 }}
          />
          <Typography variant="h2" fontWeight={700} sx={{ fontSize: { xs: "2.4rem", md: "3.4rem" }, maxWidth: 680 }}>
            Earn real rewards for recycling responsibly
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mt: 2, maxWidth: 560 }}>
            Schedule pickups, let verified recyclers process your waste, and get paid in
            on-chain <strong>RCT</strong> tokens — redeemable with partner retailers.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
            <Button
              size="large"
              variant="contained"
              endIcon={<FiArrowRight />}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => document.getElementById("why-recycle")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      <Section
        id="why-recycle"
        title="Why Recycle?"
        text="Recycling helps reduce waste, conserve energy, and protect the environment — and now it pays you back."
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FeatureCard
              icon={<MdOutlineRecycling size={26} />}
              title="Reduce Waste"
              text="Less landfill, more material reused and recovered."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FeatureCard
              icon={<MdOutlinePublic size={26} />}
              title="Protect the Planet"
              text="Lower emissions, less pollution, healthier ecosystems."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FeatureCard
              icon={<MdOutlineWbSunny size={26} />}
              title="Save Energy"
              text="Recycled materials take far less energy to reprocess."
            />
          </Grid>
        </Grid>
      </Section>

      <Section
        id="carbon-footprints"
        title="What Are Carbon Footprints?"
        text="Your carbon footprint is the amount of greenhouse gases emitted due to your daily activities — recycling consistently is one of the simplest ways to shrink it."
      />

      <Box sx={{ bgcolor: colors.bg }}>
        <Section
          id="retailers"
          title="Retailers Who Give Rewards"
          text="Redeem your approved RCT tokens with partners across the EcoEarn network."
        >
          <Grid container spacing={3} justifyContent="center">
            {retailers.map((r) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.name}>
                <Card sx={{ height: "100%", borderRadius: 4, textAlign: "center" }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        bgcolor: colors.tint,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        mx: "auto",
                        color: "primary.main",
                      }}
                    >
                      <MdOutlineStorefront size={24} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {r.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {r.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>
      </Box>

      <Section
        id="about-us"
        title="About Us"
        text="EcoEarn is a blockchain-integrated reward system that incentivizes recycling to create a greener planet."
      />

      <Box id="contact-us" sx={{ bgcolor: "primary.dark", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            Contact Us
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center" alignItems="center" mt={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MdOutlineMailOutline />
              <Typography>support@ecoearn.app</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MdOutlinePhone />
              <Typography>+91 98765 43210</Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Home;
