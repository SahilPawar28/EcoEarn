import { ethers } from "ethers";
import { getSigner } from "./web3Provider";
import contractArtifact from "./RewardToken.json";
import deployedContract from "./contract-address.json";

const contractABI = contractArtifact.abi;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || deployedContract.address;

// Get a contract instance bound to the connected wallet. Throws a clean, user-facing
// message on failure instead of alerting directly, so callers can show it however they like.
export const getContract = async () => {
  if (!CONTRACT_ADDRESS) {
    throw new Error("No contract deployed yet. Run the deploy script first.");
  }
  const signer = await getSigner();
  if (!signer) {
    throw new Error("Please connect your wallet first.");
  }
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
};

// Get token balance of a user (human-readable, 18 decimals)
export const getBalance = async (address) => {
  try {
    const contract = await getContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
};

// Add Recycler (Only Admin)
export const addRecycler = async (address) => {
  const contract = await getContract();
  const tx = await contract.addRecyclingCenter(address);
  await tx.wait();
};

// Add Retailer (Only Admin)
export const addRetailer = async (address) => {
  const contract = await getContract();
  const tx = await contract.addRetailer(address);
  await tx.wait();
};

// Reward User (an authorized recycling center mints tokens to a recycler)
export const rewardRecycler = async (address, amount) => {
  const contract = await getContract();
  const tx = await contract.rewardRecycler(address, ethers.parseUnits(amount, 0));
  await tx.wait();
};

// Approve a retailer to redeem tokens on the user's behalf (call this before the
// retailer calls redeemTokens — the contract requires an ERC20 allowance).
export const approveRetailer = async (retailerAddress, amount) => {
  const contract = await getContract();
  const tx = await contract.approve(retailerAddress, ethers.parseUnits(amount, 18));
  await tx.wait();
};

// Redeem Tokens (an authorized retailer pulls previously-approved tokens from a customer)
export const redeemTokens = async (address, amount) => {
  const contract = await getContract();
  const tx = await contract.redeemTokens(address, ethers.parseUnits(amount, 0));
  await tx.wait();
};
