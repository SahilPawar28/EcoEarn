import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { MdLink } from "react-icons/md";
import WalletStatus from "./WalletStatus";

const DashboardHeader = ({ title, subtitle, walletAddress, onConnectWallet, children }) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "center" },
      mb: 4,
    }}
  >
    <Box>
      <Typography variant="h4" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {subtitle}
        </Typography>
      )}
    </Box>
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
      <WalletStatus address={walletAddress} />
      <Button variant={walletAddress ? "outlined" : "contained"} startIcon={<MdLink />} onClick={onConnectWallet}>
        {walletAddress ? "Reconnect" : "Connect Wallet"}
      </Button>
      {children}
    </Stack>
  </Box>
);

export default DashboardHeader;
