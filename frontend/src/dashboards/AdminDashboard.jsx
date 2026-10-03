import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";
import { addRecycler, addRetailer } from "../contract";
import { connectWallet as connectMetaMask } from "../web3Provider";
import { useNotify } from "../context/NotificationContext";
import DashboardHeader from "../components/DashboardHeader";
import ActionCard from "../components/ActionCard";
import api from "../api";
import { MdOutlineFactory, MdOutlineStorefront, MdOutlineAssessment } from "react-icons/md";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [walletAddress, setWalletAddress] = useState("");
  const [dialog, setDialog] = useState(null); // "recycler" | "retailer" | null
  const [addressInput, setAddressInput] = useState("");
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

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data.walletAddress) setWalletAddress(res.data.walletAddress);
      })
      .catch((err) => console.error("Error fetching wallet:", err));
  }, []);

  const openDialog = (type) => {
    setAddressInput("");
    setDialog(type);
  };

  const submitDialog = async () => {
    if (!addressInput) {
      notify("Enter a wallet address.", "warning");
      return;
    }
    setSubmitting(true);
    try {
      if (dialog === "recycler") {
        await addRecycler(addressInput);
        notify(`Recycler added: ${addressInput}`, "success");
      } else {
        await addRetailer(addressInput);
        notify(`Retailer added: ${addressInput}`, "success");
      }
      setDialog(null);
    } catch (error) {
      console.error(`Error adding ${dialog}:`, error);
      notify(error.message || `Failed to add ${dialog}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const cards = [
    {
      icon: <MdOutlineFactory size={22} />,
      title: "Add Recycler",
      description: "Register a new recycling center on-chain.",
      onClick: () => openDialog("recycler"),
    },
    {
      icon: <MdOutlineStorefront size={22} />,
      title: "Add Retailer",
      description: "Authorize a retailer to redeem tokens.",
      onClick: () => openDialog("retailer"),
    },
    {
      icon: <MdOutlineAssessment size={22} />,
      title: "View Recycle Reports",
      description: "Access detailed recycling activity reports.",
      onClick: () => navigate("/recycler/reports"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Manage who can mint rewards and redeem tokens"
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

      <Dialog open={!!dialog} onClose={() => setDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>{dialog === "recycler" ? "Add Recycler" : "Add Retailer"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {dialog === "recycler"
              ? "This address will be authorized to mint reward tokens."
              : "This address will be authorized to redeem approved customer tokens."}
          </Typography>
          <TextField
            label="Wallet Address"
            fullWidth
            margin="dense"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="0x..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={submitDialog} disabled={submitting}>
            {submitting ? "Submitting..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
