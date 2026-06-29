# Quick Start Guide

Get StellarSplit running in 5 minutes!

## Prerequisites Check

```bash
# Node.js (18+)
node --version

# Rust
rustc --version

# Cargo
cargo --version

# Soroban CLI (optional for contract deployment)
soroban --version
```

If any are missing, install them:
- **Node.js**: https://nodejs.org/
- **Rust**: https://rustup.rs/
- **Soroban**: `cargo install --locked soroban-cli`

## Step 1: Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/stellarsplit.git
cd stellarsplit

# Install frontend dependencies
cd frontend
npm install
```

## Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env (use your favorite editor)
# For now, the default values work for testing
```

Default `.env` contents:
```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Contract IDs - leave empty for local demo
VITE_GROUP_EXPENSE_CONTRACT_ID=
VITE_SETTLEMENT_CONTRACT_ID=
```

## Step 3: Start Development Server (30 seconds)

```bash
# From frontend directory
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

## Step 4: Setup Freighter Wallet (1 minute)

1. Install [Freighter Extension](https://www.freighter.app/)
2. Create a new wallet or import existing
3. Switch to **Testnet** (important!)
4. Fund your account: https://laboratory.stellar.org/#account-creator?network=test
   - Enter your public key
   - Click "Get test network lumens"
   - Wait for 100 XLM to arrive

## Step 5: Test the App (30 seconds)

1. Click "Connect Freighter" on the app
2. Approve connection in Freighter popup
3. You should see your balance! ✨

## Testing Without Smart Contracts

The app works in **demo mode** without deployed contracts:
- Groups are stored in localStorage
- Expenses tracked locally
- Settlements calculated client-side
- XLM payments work via Stellar SDK

This is perfect for:
- Testing the UI
- Learning the flow
- Demo purposes

## Deploy Smart Contracts (Optional)

Want the full experience? Deploy contracts:

```bash
# Build contracts
cd contracts/group_expense_contract
cargo build --target wasm32-unknown-unknown --release

cd ../settlement_contract
cargo build --target wasm32-unknown-unknown --release

# Deploy (requires Soroban CLI)
# See DEPLOYMENT.md for full instructions
```

## Quick Demo Flow

1. **Connect Wallet** → Click "Connect Freighter"
2. **Create Group** → Groups & Settlements tab → Enter "Test Group"
3. **Add Member** → Manage Expenses tab → Paste a friend's address
4. **Add Expense** → Enter "Dinner - 50 XLM" → Select members
5. **View Settlement** → See calculated balances
6. **Settle Debt** → Click "Settle Now" → Approve in Freighter

## Common First-Time Issues

### "Account not found"
- **Solution**: Fund your account from testnet faucet
- Link: https://laboratory.stellar.org/#account-creator?network=test

### "Freighter not found"
- **Solution**: Install Freighter extension
- Link: https://www.freighter.app/

### "Wrong network"
- **Solution**: Switch Freighter to Testnet
- Settings → Network → Testnet

### Port 3000 already in use
- **Solution**: Kill the process or use different port
```bash
npm run dev -- --port 3001
```

## Next Steps

- Read [README.md](README.md) for full features
- Check [ARCHITECTURE.md](docs/ARCHITECTURE.md) for technical details
- See [API.md](docs/API.md) for contract/API documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Need Help?

- 📖 Check the [documentation](docs/)
- 🐛 Open an [issue](https://github.com/yourusername/stellarsplit/issues)
- 💬 Ask on [Stellar Discord](https://discord.gg/stellar)
- ⭐ Star the repo if you find it useful!

## Development Commands

```bash
# Frontend
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run tests
npm run preview      # Preview production build

# Contracts
cd contracts/group_expense_contract
cargo test           # Run contract tests
cargo build --target wasm32-unknown-unknown --release  # Build
```

## Project Structure Overview

```
stellarsplit/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── utils/      # Utility functions
│   │   └── App.jsx     # Main app
│   └── package.json
├── contracts/          # Soroban contracts
│   ├── group_expense_contract/
│   └── settlement_contract/
├── docs/               # Documentation
└── README.md
```

## Demo Data for Testing

Use these for quick testing:

**Groups:**
- "Weekend Trip"
- "Office Lunch"
- "Apartment Rent"

**Expenses:**
- Description: "Dinner", Amount: 50 XLM
- Description: "Gas", Amount: 30 XLM
- Description: "Groceries", Amount: 75 XLM

**Test Address** (for adding members):
Generate from Freighter or use testnet faucet addresses.

---

**You're all set! Happy splitting! 🚀**
