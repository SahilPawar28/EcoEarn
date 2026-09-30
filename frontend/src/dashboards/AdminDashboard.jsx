import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addRecycler, addRetailer } from "../contract";
import { connectWallet as connectMetaMask } from "../web3Provider";
import api from "../api";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
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

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data.walletAddress) setWalletAddress(res.data.walletAddress);
      })
      .catch((err) => console.error("❌ Error fetching wallet:", err));
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-dashboard-buttons">
        <button className="dashboard-btn" onClick={connectWallet}>
          🔗 Connect MetaMask
        </button>
      </div>
      <p className="wallet-info">Wallet: {walletAddress || "❌ Not Connected"}</p>
      <div className="admin-dashboard-cards">
        {/* Add Recycler */}
        <div
          className="admin-dashboard-card"
          onClick={() => addRecycler(prompt("Enter Recycler Address"))}
          style={{ backgroundImage: "url('/images/recycler.jpg')" }}
        >
          <div className="card-overlay"></div>
          <div className="icon">🏭</div>
          <div className="card-content">
            <h3>Add Recycler</h3>
            <p>Register a new recycling center on the platform.</p>
          </div>
        </div>

        {/* Add Retailer */}
        <div
          className="admin-dashboard-card"
          onClick={() => addRetailer(prompt("Enter Retailer Address"))}
          style={{ backgroundImage: "url('/images/retailer.jpg')" }}
        >
          <div className="card-overlay"></div>
          <div className="icon">🏪</div>
          <div className="card-content">
            <h3>Add Retailer</h3>
            <p>Add a new retailer that can redeem approved tokens from customers.</p>
          </div>
        </div>

        {/* View Reports */}
        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/recycler/reports")}
          style={{ backgroundImage: "url('/images/reports.jpg')" }}
        >
          <div className="card-overlay"></div>
          <div className="icon">📊</div>
          <div className="card-content">
            <h3>View Recycle Reports</h3>
            <p>Access detailed reports on recycling activities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
