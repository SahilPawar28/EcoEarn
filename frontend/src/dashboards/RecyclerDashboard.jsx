import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";
import { rewardRecycler } from "../contract";
import { connectWallet as connectMetaMask } from "../web3Provider";
import { useNotify } from "../context/NotificationContext";
import DashboardHeader from "../components/DashboardHeader";
import ActionCard from "../components/ActionCard";
import api from "../api";
import { MdOutlineAssignment, MdOutlineTaskAlt, MdOutlineDescription, MdOutlineVisibility, MdOutlineBarChart, MdOutlineCardGiftcard } from "react-icons/md";

const RecyclerDashboard = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [walletAddress, setWalletAddress] = useState("");
  const [rewardOpen, setRewardOpen] = useState(false);
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

  const submitReward = async () => {
    if (!userAddress || !amount) {
      notify("Enter a user address and amount.", "warning");
      return;
    }
    setSubmitting(true);
    try {
      await rewardRecycler(userAddress, amount);
      notify(`Rewarded ${amount} RCT to ${userAddress}`, "success");
      setRewardOpen(false);
      setUserAddress("");
      setAmount("");
    } catch (error) {
      console.error("Error rewarding user:", error);
      notify(error.message || "Failed to reward user", "error");
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
      icon: <MdOutlineAssignment size={22} />,
      title: "View Pickups",
      description: "See scheduled waste pickups.",
      onClick: () => navigate("/recycler/scheduled-pickups"),
    },
    {
      icon: <MdOutlineTaskAlt size={22} />,
      title: "Confirm Pickup",
      description: "Mark accepted pickups as completed.",
      onClick: () => navigate("/recycler/confirm-pickup"),
    },
    {
      icon: <MdOutlineDescription size={22} />,
      title: "Upload Report",
      description: "Submit a recycling report.",
      onClick: () => navigate("/recycler/upload-report"),
    },
    {
      icon: <MdOutlineVisibility size={22} />,
      title: "Monitor Recycling",
      description: "Track the recycling process.",
      onClick: () => navigate("/recycler/tracking"),
    },
    {
      icon: <MdOutlineBarChart size={22} />,
      title: "Recycle Stats",
      description: "View submitted reports.",
      onClick: () => navigate("/recycler/reports"),
    },
    {
      icon: <MdOutlineCardGiftcard size={22} />,
      title: "Reward User",
      description: "Mint RCT tokens to a recycler.",
      onClick: () => setRewardOpen(true),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <DashboardHeader
        title="Recycler Dashboard"
        subtitle="Process pickups and reward verified recycling"
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

      <Dialog open={rewardOpen} onClose={() => setRewardOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Reward User</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Mint RCT tokens directly to a recycler's wallet for verified recycling.
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
          <Button onClick={() => setRewardOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitReward} disabled={submitting}>
            {submitting ? "Rewarding..." : "Reward"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecyclerDashboard;
