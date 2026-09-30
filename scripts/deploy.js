const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying RewardToken to "${hre.network.name}" with account:`, deployer.address);

  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();

  const address = await rewardToken.getAddress();
  console.log("RewardToken deployed to:", address);

  // Write the address + ABI straight into the frontend so it can never drift
  // out of sync with what's actually on-chain (this is what caused the
  // malformed/stale contract address bug this project shipped with before).
  const artifact = await hre.artifacts.readArtifact("RewardToken");
  const frontendDir = path.join(__dirname, "..", "frontend", "src");
  fs.writeFileSync(
    path.join(frontendDir, "contract-address.json"),
    JSON.stringify({ network: hre.network.name, address }, null, 2)
  );
  fs.writeFileSync(
    path.join(frontendDir, "RewardToken.json"),
    JSON.stringify({ abi: artifact.abi }, null, 2)
  );
  console.log("Wrote frontend/src/contract-address.json and frontend/src/RewardToken.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
