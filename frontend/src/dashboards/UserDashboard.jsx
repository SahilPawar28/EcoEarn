import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { getBalance, approveRetailer } from "../contract";
import { connectWallet as connectMetaMask } from "../web3Provider";
import { useNotify } from "../context/NotificationContext";
import DashboardHeader from "../components/DashboardHeader";
import ActionCard from "../components/ActionCard";
import api from "../api";
import {
  MdOutlineRecycling,
  MdOutlineLocalShipping,
  MdOutlineHistory,
  MdOutlineCardGiftcard,
  MdOutlineToken,
} from "react-icons/md";
import { colors } from "../theme";

const UserDashboard = () => {
    const navigate = useNavigate();
    const notify = useNotify();
    const [walletAddress, setWalletAddress] = useState("");
    const [tokenBalance, setTokenBalance] = useState("0");
    const [approveOpen, setApproveOpen] = useState(false);
    const [retailerAddress, setRetailerAddress] = useState("");
    const [approveAmount, setApproveAmount] = useState("");
    const [approving, setApproving] = useState(false);

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
        const fetchTokenBalance = async () => {
            if (!walletAddress) return;
            const balance = await getBalance(walletAddress);
            setTokenBalance(balance);
        };
        fetchTokenBalance();
    }, [walletAddress]);

    const submitApproval = async () => {
        if (!retailerAddress || !approveAmount) {
            notify("Enter a retailer address and amount.", "warning");
            return;
        }
        setApproving(true);
        try {
            await approveRetailer(retailerAddress, approveAmount);
            notify(`Approved ${approveAmount} RCT for redemption`, "success");
            setApproveOpen(false);
            setRetailerAddress("");
            setApproveAmount("");
        } catch (error) {
            console.error("Error approving retailer:", error);
            notify(error.message || "Failed to approve retailer", "error");
        } finally {
            setApproving(false);
        }
    };

    const cards = [
        {
            icon: <MdOutlineLocalShipping size={22} />,
            title: "Schedule Pickup",
            description: "Book a waste collection service.",
            onClick: () => navigate("/schedule-pickup"),
        },
        {
            icon: <MdOutlineRecycling size={22} />,
            title: "Recycle Status",
            description: "Track your recycling progress.",
            onClick: () => navigate("/my-pickups"),
        },
        {
            icon: <MdOutlineHistory size={22} />,
            title: "My Pickups",
            description: "See your full recycling history.",
            onClick: () => navigate("/my-pickups"),
        },
        {
            icon: <MdOutlineCardGiftcard size={22} />,
            title: "Approve Redemption",
            description: "Let a retailer redeem your tokens.",
            onClick: () => setApproveOpen(true),
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <DashboardHeader
                title="User Dashboard"
                subtitle="Schedule pickups and track your rewards"
                walletAddress={walletAddress}
                onConnectWallet={connectWallet}
            />

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                    color: "white",
                }}
            >
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MdOutlineToken size={24} />
                </Box>
                <Box>
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Token Balance
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                        {tokenBalance} RCT
                    </Typography>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {cards.map((c) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={c.title}>
                        <ActionCard {...c} />
                    </Grid>
                ))}
            </Grid>

            <Dialog open={approveOpen} onClose={() => setApproveOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Approve Redemption</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Authorize a retailer's wallet address to redeem an amount of your RCT tokens.
                    </Typography>
                    <TextField
                        label="Retailer Address"
                        fullWidth
                        margin="dense"
                        value={retailerAddress}
                        onChange={(e) => setRetailerAddress(e.target.value)}
                        placeholder="0x..."
                    />
                    <TextField
                        label="Amount (RCT)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={approveAmount}
                        onChange={(e) => setApproveAmount(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setApproveOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitApproval} disabled={approving}>
                        {approving ? "Approving..." : "Approve"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserDashboard;
