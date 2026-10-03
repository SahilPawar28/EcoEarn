import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";
import { redeemTokens } from "../contract";
import { connectWallet as connectMetaMask } from "../web3Provider";
import { useNotify } from "../context/NotificationContext";
import DashboardHeader from "../components/DashboardHeader";
import ActionCard from "../components/ActionCard";
import api from "../api";
import { MdOutlineInventory2, MdOutlineLocalShipping, MdOutlineRecycling, MdOutlineHistory, MdOutlineMoney } from "react-icons/md";

const CollectorDashboard = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [walletAddress, setWalletAddress] = useState("");
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const connectWallet = async () => {
    try {
      const signer = await connectMetaMask();
      const address = await signer.getAddress();
      setWalletAddress(address);
      await api.post("/api/auth/update-wallet", { wallet: address });
      notify("Wallet connected", "success");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      notify(error.message || "Wallet connection failed", "error");
    }
  };

  const submitRedeem = async () => {
    if (!userAddress || !amount) {
      notify("Enter a user address and amount.", "warning");
      return;
    }
    setSubmitting(true);
    try {
      await redeemTokens(userAddress, amount);
      notify(`Redeemed ${amount} RCT from ${userAddress}`, "success");
      setRedeemOpen(false);
      setUserAddress("");
      setAmount("");
    } catch (error) {
      console.error("Error redeeming tokens:", error);
      notify(error.message || "Failed to redeem tokens", "error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data.walletAddress) setWalletAddress(res.data.walletAddress);
      })
      .catch((err) => console.error(err));
  }, []);

  const cards = [
    {
      icon: <MdOutlineInventory2 size={22} />,
      title: "Pickup Requests",
      description: "Manage scheduled waste pickups.",
      onClick: () => navigate("/recycler/scheduled-pickups"),
    },
    {
      icon: <MdOutlineLocalShipping size={22} />,
      title: "Track Collection",
      description: "Confirm pickups once collected.",
      onClick: () => navigate("/recycler/confirm-pickup"),
    },
    {
      icon: <MdOutlineRecycling size={22} />,
      title: "Recycling Progress",
      description: "Check waste processing status.",
      onClick: () => navigate("/recycler/tracking"),
    },
    {
      icon: <MdOutlineHistory size={22} />,
      title: "User History",
      description: "View past transactions and logs.",
      onClick: () => navigate("/recycler/reports"),
    },
    {
      icon: <MdOutlineMoney size={22} />,
      title: "Redeem Tokens",
      description: "Pull approved tokens from a customer.",
      onClick: () => setRedeemOpen(true),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <DashboardHeader
        title="Collector Dashboard"
        subtitle="Manage pickups and redeem approved tokens"
        walletAddress={walletAddress}
        onConnectWallet={connectWallet}
      />

      <Grid container spacing={3}>
        {cards.map((c) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.title}>
            <ActionCard {...c} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={redeemOpen} onClose={() => setRedeemOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Redeem Tokens</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            The customer must have already approved this amount for your wallet.
          </Typography>
          <TextField
            label="User Address"
            fullWidth
            margin="dense"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            placeholder="0x..."
          />
          <TextField
            label="Amount (RCT)"
            type="number"
            fullWidth
            margin="dense"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRedeemOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitRedeem} disabled={submitting}>
            {submitting ? "Redeeming..." : "Redeem"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CollectorDashboard;
