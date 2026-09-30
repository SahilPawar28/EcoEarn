import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rewardRecycler } from "../contract";
import { connectWallet as connectMetaMask } from "../web3Provider";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import "../styles/RecyclerDashboard.css";
import { FaClipboardList, FaFileAlt, FaEye, FaChartBar } from "react-icons/fa";

const RecyclerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      const signer = await connectMetaMask();
      if (!signer) return;
      const address = await signer.getAddress();
      setWalletAddress(address);

      await api.post("/api/auth/update-wallet", { wallet: address });
      alert(`✅ Wallet connected: ${address}`);
    } catch (error) {
      console.error("❌ Wallet connection failed:", error);
      alert("❌ Wallet connection failed. Please try again.");
    }
  };

  const rewardUser = async () => {
    const address = prompt("Enter User Address");
    const amount = prompt("Enter Amount");
    if (!address || !amount) {
      alert("❌ Please enter valid user address and amount.");
      return;
    }
    await rewardRecycler(address, amount);
  };

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data.walletAddress) setWalletAddress(res.data.walletAddress);
      })
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="dashboard-container">
      <h2>Recycler Dashboard</h2>

      <div className="wallet-buttons">
        <button className="connect-wallet" onClick={connectWallet}>Connect MetaMask</button>
        <button className="reward-user" onClick={rewardUser}>Reward User</button>
      </div>

      <p>Wallet: {walletAddress || "❌ Not Connected"}</p>

      <div className="dashboard-cards">
        <DashboardCard icon={<FaClipboardList />} title="View Pickups" description="See scheduled pickups." onClick={() => navigate("/recycler/scheduled-pickups")} />
        <DashboardCard icon={<FaFileAlt />} title="Generate Recycle Report" description="Upload recycling data." onClick={() => navigate("/recycler/upload-report")} />
        <DashboardCard icon={<FaEye />} title="Monitor Recycle" description="Track recycling process." onClick={() => navigate("/recycler/tracking")} />
        <DashboardCard icon={<FaChartBar />} title="Recycle Stats" description="View submitted reports." onClick={() => navigate("/recycler/reports")} />
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, description, onClick }) => (
  <div className="dashboard-card" onClick={onClick} style={{ cursor: "pointer" }}>
    <div className="icon">{icon}</div>
    <div className="card-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

export default RecyclerDashboard;
