import { ethers } from "ethers";
import { getSigner } from "./web3Provider";
import contractArtifact from "./RewardToken.json";
import deployedContract from "./contract-address.json";

const contractABI = contractArtifact.abi;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || deployedContract.address;

// ✅ Get Contract Instance
export const getContract = async () => {
  try {
    if (!CONTRACT_ADDRESS) {
      alert("❌ No contract deployed yet. Run the deploy script first.");
      return null;
    }
    const signer = await getSigner();
    if (!signer) {
      alert("❌ Please connect your wallet first.");
      return null;
    }
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  } catch (error) {
    console.error("❌ Error getting contract:", error);
    alert("❌ Failed to load contract");
    return null;
  }
};

// ✅ Get token balance of a user (human-readable, 18 decimals)
export const getBalance = async (address) => {
  try {
    const contract = await getContract();
    if (!contract) return "0";
    const balance = await contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error("❌ Error fetching balance:", error);
    return "0";
  }
};

// ✅ Add Recycler (Only Admin)
export const addRecycler = async (address) => {
  try {
    const contract = await getContract();
    if (!contract) return;
    const tx = await contract.addRecyclingCenter(address);
    await tx.wait();
    alert(`✅ Recycler added: ${address}`);
  } catch (error) {
    console.error("❌ Error adding recycler:", error);
    alert("❌ Failed to add recycler");
  }
};

// ✅ Add Retailer (Only Admin)
export const addRetailer = async (address) => {
  try {
    const contract = await getContract();
    if (!contract) return;
    const tx = await contract.addRetailer(address);
    await tx.wait();
    alert(`✅ Retailer added: ${address}`);
  } catch (error) {
    console.error("❌ Error adding retailer:", error);
    alert("❌ Failed to add retailer");
  }
};

// ✅ Reward User (an authorized recycling center mints tokens to a recycler)
export const rewardRecycler = async (address, amount) => {
  try {
    const contract = await getContract();
    if (!contract) return;
    const tx = await contract.rewardRecycler(address, ethers.parseUnits(amount, 0));
    await tx.wait();
    alert(`✅ Rewarded ${amount} tokens to: ${address}`);
  } catch (error) {
    console.error("❌ Error rewarding user:", error);
    alert("❌ Failed to reward user");
  }
};

// ✅ Approve a retailer to redeem tokens on the user's behalf (call this before the
// retailer calls redeemTokens — the contract requires an ERC20 allowance).
export const approveRetailer = async (retailerAddress, amount) => {
  try {
    const contract = await getContract();
    if (!contract) return;
    const tx = await contract.approve(retailerAddress, ethers.parseUnits(amount, 18));
    await tx.wait();
    alert(`✅ Approved ${amount} tokens for redemption by: ${retailerAddress}`);
  } catch (error) {
    console.error("❌ Error approving retailer:", error);
    alert("❌ Failed to approve retailer");
  }
};

// ✅ Redeem Tokens (an authorized retailer pulls previously-approved tokens from a customer)
export const redeemTokens = async (address, amount) => {
  try {
    const contract = await getContract();
    if (!contract) return;
    const tx = await contract.redeemTokens(address, ethers.parseUnits(amount, 0));
    await tx.wait();
    alert(`✅ Redeemed ${amount} tokens from: ${address}`);
  } catch (error) {
    console.error("❌ Error redeeming tokens:", error);
    alert("❌ Failed to redeem tokens");
  }
};
