import { ethers } from "ethers";

let signer;

export const getProvider = () => {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
};

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Please install it.");
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = getProvider();
  signer = await provider.getSigner();
  return signer;
};

export const getSigner = async () => {
  if (signer) return signer;
  return connectWallet();
};

export default getProvider;
