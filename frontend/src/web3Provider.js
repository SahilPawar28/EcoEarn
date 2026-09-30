import { ethers } from "ethers";

let signer;

export const getProvider = () => {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
};

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected. Please install it.");
    return null;
  }
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = getProvider();
    signer = await provider.getSigner();
    return signer;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};

export const getSigner = async () => {
  if (signer) return signer;
  return connectWallet();
};

export default getProvider;
