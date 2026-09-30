import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBalance, approveRetailer } from "../contract";
import { connectWallet as connectMetaMask } from "../web3Provider";
import api from "../api";
import "../styles/UserDashboard.css";
import { FaRecycle, FaTruck, FaLeaf, FaFileDownload, FaCoins } from "react-icons/fa";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [walletAddress, setWalletAddress] = useState("");
    const [tokenBalance, setTokenBalance] = useState("0");

    const connectWallet = async () => {
        try {
            const signer = await connectMetaMask();
            if (!signer) return;
            const address = await signer.getAddress();
            setWalletAddress(address);

            await api.post("/api/auth/update-wallet", { wallet: address });
            console.log("✅ Wallet connected:", address);
        } catch (error) {
            console.error("❌ Wallet connection failed:", error);
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

    const redeemReward = async () => {
        const retailerAddress = prompt("Enter the retailer's wallet address to approve:");
        const amount = prompt("Enter the amount of tokens to approve for redemption:");
        if (!retailerAddress || !amount) return;
        await approveRetailer(retailerAddress, amount);
    };

    return (
        <div className="user-dashboard-container">
            <h2><center>User Dashboard</center></h2>

            <div className="user-dashboard-buttons">
                <button className="dashboard-btn" onClick={connectWallet}>🔗 Connect Wallet</button>
                <button className="dashboard-btn" onClick={redeemReward}>🎁 Approve Redemption</button>
            </div>

            <p><center>Wallet: {walletAddress || "❌ Not Connected"}</center></p>
            <p><center>Token Balance: {tokenBalance} RCT</center></p>

            <div className="dashboard-cards">
                <DashboardCard
                    icon={<FaLeaf />}
                    title="Carbon Footprint"
                    description="Estimate your waste impact."
                    background="/images/cf.jpg"
                    onClick={() => navigate("/recycling-info")}
                />
                <DashboardCard
                    icon={<FaTruck />}
                    title="Schedule Pickup"
                    description="Book waste collection service."
                    background="/images/sp.jpg"
                    onClick={() => navigate("/schedule-pickup")}
                />
                <DashboardCard
                    icon={<FaRecycle />}
                    title="Recycle Status"
                    description="Track your recycling progress."
                    background="/images/res.jpg"
                    onClick={() => navigate("/my-pickups")}
                />
                <DashboardCard
                    icon={<FaFileDownload />}
                    title="My Pickups"
                    description="See your recycling history."
                    background="/images/dr.jpg"
                    onClick={() => navigate("/my-pickups")}
                />
                <DashboardCard
                    icon={<FaCoins />}
                    title="Token Balance"
                    description={`${tokenBalance} RCT Available`}
                    background="/images/ta.jpg"
                />
            </div>
        </div>
    );
};

const DashboardCard = ({ icon, title, description, background, onClick }) => (
    <div
        className="dashboard-card"
        style={{ backgroundImage: `url(${background})`, cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
    >
        <div className="card-overlay">
            <div className="card-icon">{icon}</div>
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    </div>
);

export default UserDashboard;
