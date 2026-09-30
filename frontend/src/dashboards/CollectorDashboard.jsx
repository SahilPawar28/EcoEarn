import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { redeemTokens } from "../contract";
import { connectWallet as connectMetaMask } from "../web3Provider";
import api from "../api";
import "../styles/CollectorDashboard.css";

const CollectorDashboard = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");

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

  const redeem = async () => {
    const address = prompt("Enter User Address");
    const amount = prompt("Enter Amount");
    if (!address || !amount) return;
    await redeemTokens(address, amount);
  };

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data.walletAddress) setWalletAddress(res.data.walletAddress);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="collector-dashboard-container">
      <h2>Collector Dashboard</h2>

      <div className="collector-dashboard-buttons">
        <button className="dashboard-btn" onClick={connectWallet}>🔗 Connect MetaMask</button>
        <button className="dashboard-btn" onClick={redeem}>💰 Redeem Tokens</button>
      </div>
      <p className="wallet-info">Wallet: {walletAddress || "❌ Not Connected"}</p>
      <div className="collector-dashboard-cards">
        <div className="collector-dashboard-card" style={{ backgroundImage: "url('/images/pr.jpeg')", cursor: "pointer" }} onClick={() => navigate("/recycler/scheduled-pickups")}>
          <div className="card-overlay">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <h3>Pickup Requests</h3>
              <p>Manage scheduled waste pickups.</p>
            </div>
          </div>
        </div>

        <div className="collector-dashboard-card" style={{ backgroundImage: "url('/images/twc.jpeg')", cursor: "pointer" }} onClick={() => navigate("/recycler/confirm-pickup")}>
          <div className="card-overlay">
            <div className="card-icon">🚛</div>
            <div className="card-content">
              <h3>Track Waste Collection</h3>
              <p>Confirm pickups once collected.</p>
            </div>
          </div>
        </div>

        <div className="collector-dashboard-card" style={{ backgroundImage: "url('/images/rp.jpeg')", cursor: "pointer" }} onClick={() => navigate("/recycler/tracking")}>
          <div className="card-overlay">
            <div className="card-icon">♻️</div>
            <div className="card-content">
              <h3>Recycling Progress</h3>
              <p>Check waste processing status.</p>
            </div>
          </div>
        </div>

        <div className="collector-dashboard-card" style={{ backgroundImage: "url('/images/uh.jpg')", cursor: "pointer" }} onClick={() => navigate("/recycler/reports")}>
          <div className="card-overlay">
            <div className="card-icon">📜</div>
            <div className="card-content">
              <h3>User History</h3>
              <p>View past transactions and collection logs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;
