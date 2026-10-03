# ♻️ EcoEarn — Blockchain-Integrated Recycling Reward System

EcoEarn is a waste management and reward platform with a blockchain-backed token
layer. Users schedule waste pickups, recyclers and collectors process them, and an
ERC-20 token (`RCT`) on Ethereum rewards verified recycling — redeemable with partner
retailers. Accounts, pickups, and reports run on a conventional backend; the token
itself, its minting/redemption rules, and the recycler/retailer allowlist live on-chain
and are independently verifiable.

## 🌐 Live Demo

- Frontend: https://ecoearn-app.vercel.app
- Backend API: https://ecoearn-backend-neon.vercel.app
- Contract (Sepolia): [`0x22c0C26Ce85C5916E5AcA17D7b2263f900C83102`](https://sepolia.etherscan.io/address/0x22c0C26Ce85C5916E5AcA17D7b2263f900C83102)

## 🔑 Features

- Role-based accounts: **User, Admin, Recycler, Collector** (JWT-authenticated)
- MetaMask wallet connection linked to each account
- On-chain `RewardToken` (ERC-20): recycling centers mint rewards, retailers redeem
  tokens against an ERC-20 allowance the user approves themselves
- Pickup scheduling, acceptance, and completion tracking (MongoDB-backed)
- Recycler report uploads/downloads
- Deployed to a public testnet (Sepolia) so the contract is independently verifiable

## 🛠️ Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 19, Vite, Material UI, ethers.js v6 |
| Backend    | Node.js, Express, MongoDB (Mongoose), JWT auth |
| Blockchain | Solidity 0.8.20, OpenZeppelin, Hardhat |

## 📁 Project Structure

```
EcoEarn/
├── contracts/RewardToken.sol   # ERC-20 reward token
├── scripts/deploy.js           # deploys + syncs ABI/address into frontend/
├── test/RewardToken.js         # Hardhat contract tests
├── backend/                    # Express API + MongoDB models
└── frontend/                   # React app (Vite)
```

---

## 🧪 Local Development

### 1. Smart contract

```bash
npm install
npx hardhat compile
npx hardhat test
```

Run a local chain and deploy to it:

```bash
npx hardhat node          # in one terminal, keeps running
npm run deploy:localhost  # in another terminal
```

This writes `frontend/src/contract-address.json` and `frontend/src/RewardToken.json`
automatically — never hand-edit the contract address.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

`JWT_SECRET` can be generated with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:5000, fine for local dev
npm run dev
```

Open http://localhost:5173, sign up, connect MetaMask (point it at the Hardhat local
network, chain ID 31337, RPC http://127.0.0.1:8545 — import one of the private keys
`npx hardhat node` prints on startup into MetaMask to get a funded test account).

---

## 🚀 Deploying EcoEarn for real

### Step 1 — Deploy the contract to Sepolia testnet

1. Get a free RPC URL from [Alchemy](https://www.alchemy.com) or [Infura](https://www.infura.io).
2. Create a fresh wallet for deployment (MetaMask → new account) and fund it with free
   Sepolia ETH from a [faucet](https://sepoliafaucet.com). **Never use a wallet that
   holds real funds for this.**
3. At the repo root:
   ```bash
   cp .env.example .env
   # fill in SEPOLIA_RPC_URL and PRIVATE_KEY (no 0x prefix issues either way is fine)
   npm run deploy:sepolia
   ```
4. This deploys the contract, prints its address, and writes it straight into
   `frontend/src/contract-address.json` — commit that file so the deployed frontend
   picks it up.
5. Optional — verify the source on Etherscan so anyone can read the contract:
   ```bash
   npm run verify:sepolia -- <deployed-address> <deployer-address>
   ```

### Step 2 — MongoDB Atlas (free tier)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Add a database user and allow network access from anywhere (`0.0.0.0/0`) for
   simplicity, since serverless hosts don't have static IPs.
3. Copy the connection string — this is your `MONGO_URI`.

### Step 3 — Backend on Vercel (free tier, no card required)

The backend runs as a Vercel serverless function (`backend/api/index.js` + `backend/vercel.json`),
so it deploys the same way as the frontend — no Render/Railway card requirement.

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo, set the project **root directory
   to `backend`**.
3. Set environment variables (from `backend/.env.example`):
   - `MONGO_URI` — from Atlas
   - `JWT_SECRET` — a random string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `FRONTEND_URL` — your frontend's Vercel URL (fill this in after Step 4; comma-separate
     if you need more than one origin)
4. Deploy. Note the resulting URL, e.g. `https://ecoearn-backend.vercel.app`.

### Step 4 — Frontend on Vercel (free tier)

1. In Vercel, **Add New → Project** again, import the same repo, set the project **root
   directory to `frontend`**.
2. Set environment variables:
   - `VITE_API_URL` = your backend's Vercel URL from Step 3
3. Deploy. `vercel.json` in `frontend/` handles React Router's client-side routes.
4. Go back to the backend project's settings and set `FRONTEND_URL` to this frontend
   URL, then redeploy the backend so CORS allows it.

### Step 5 — Try it live

1. Visit your Vercel URL, sign up, log in.
2. Connect MetaMask on the **Sepolia** network.
3. As an admin account, use "Add Recycler" / "Add Retailer" to authorize addresses
   on-chain (the account that deployed the contract is its owner — sign in with that
   wallet as admin first, or transfer ownership with `contract.transferOwnership`).
4. Schedule a pickup as a user, accept/complete it as a recycler, and have the
   recycling center address call "Reward User" to mint `RCT` tokens.
5. To redeem: the user approves a retailer's address for an amount (User Dashboard →
   "Approve Redemption"), then the retailer (Collector Dashboard → "Redeem Tokens")
   pulls the approved amount.

---

## 🔐 Security notes

- Wallet addresses and profile data are always resolved from the authenticated user's
  own JWT server-side — no endpoint trusts a client-supplied user ID.
- `redeemTokens` requires an ERC-20 `approve()` from the customer first; a retailer can
  never move tokens out of a wallet without that wallet's owner approving it.
- Recycling centers and retailers are owner-controlled allowlists on-chain
  (`addRecyclingCenter` / `addRetailer`), guarding who can mint rewards or redeem
  tokens.
- Uploaded reports are stored in MongoDB (not on local disk) so they survive restarts
  on ephemeral hosts like Render's free tier.

## 🧾 License

MIT
