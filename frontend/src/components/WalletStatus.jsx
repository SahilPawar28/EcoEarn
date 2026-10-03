import React from "react";
import { Chip } from "@mui/material";
import { MdAccountBalanceWallet } from "react-icons/md";
import { colors } from "../theme";

const shorten = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const WalletStatus = ({ address }) => (
  <Chip
    icon={<MdAccountBalanceWallet />}
    label={address ? shorten(address) : "Wallet not connected"}
    sx={{
      bgcolor: address ? colors.tint : "grey.100",
      color: address ? "primary.dark" : "text.secondary",
      fontWeight: 600,
    }}
  />
);

export default WalletStatus;
