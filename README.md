# StellarSplit ✨

> A production-ready decentralized group expense splitter built on the Stellar blockchain

[![CI/CD](https://github.com/yourusername/stellarsplit/workflows/CI/badge.svg)](https://github.com/yourusername/stellarsplit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Project Overview

StellarSplit is a decentralized application (dApp) that revolutionizes group expense management by leveraging the Stellar blockchain. Split bills, track expenses, and settle debts with friends seamlessly using XLM (Stellar Lumens) with near-instant transactions and minimal fees.

### Key Features

- 🔗 **Multi-Wallet Support** - Connect with Freighter or any Stellar-compatible wallet
- 👥 **Group Management** - Create groups and invite members
- 💰 **Expense Tracking** - Record and split expenses automatically
- ⚖️ **Smart Settlements** - Calculate optimal payment flows
- ⚡ **Real-Time Updates** - Live balance and transaction tracking
- 📊 **Analytics Dashboard** - Comprehensive spending insights
- 🔒 **Secure & Decentralized** - Smart contract-powered transparency

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + Vite
- Pure CSS (no UI frameworks)
- Stellar SDK
- Freighter Wallet Integration
- StellarWalletsKit

**Smart Contracts:**
- Rust + Soroban
- Two inter-communicating contracts
- Event-driven architecture

**Blockchain:**
- Stellar Testnet
- Soroban Smart Contracts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Rust and Cargo
- Soroban CLI
- Freighter Wallet Browser Extension

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stellarsplit.git
cd stellarsplit

# Install frontend dependencies
cd frontend
npm install

# Build smart contracts
cd ../contracts/group_expense_contract
cargo build --target wasm32-unknown-unknown --release

cd ../settlement_contract
cargo build --target wasm32-unknown-unknown --release
```


### Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Replace after contract deployment
VITE_GROUP_EXPENSE_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
VITE_SETTLEMENT_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
```

## 📝 Smart Contract Deployment

### Deploy Group Expense Contract

```bash
cd contracts/group_expense_contract

# Build the contract
soroban contract build

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/group_expense_contract.wasm \
  --source YOUR_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Save the returned contract ID
```

### Deploy Settlement Contract

```bash
cd contracts/settlement_contract

# Build the contract
soroban contract build

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/settlement_contract.wasm \
  --source YOUR_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Save the returned contract ID
```

### Initialize Contracts

```bash
# Initialize Group Expense Contract with Settlement Contract address
soroban contract invoke \
  --id GROUP_EXPENSE_CONTRACT_ID \
  --source YOUR_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- initialize \
  --settlement_contract SETTLEMENT_CONTRACT_ID
```

**📝 Contract IDs Placeholder:**
- Group Expense Contract: `CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- Settlement Contract: `CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`


## 🧪 Testing

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Smart Contract Tests

```bash
# Test Group Expense Contract
cd contracts/group_expense_contract
cargo test --release

# Test Settlement Contract
cd contracts/settlement_contract
cargo test --release
```

## 💻 Development

### Start Development Server

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see your application.

### Build for Production

```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist`.

## 🔧 CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment.

### Workflow Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

### Pipeline Steps

1. **Frontend Tests** - Run React component tests
2. **Contract Tests** - Run Rust contract tests
3. **Build** - Build frontend and contracts
4. **Deploy Preview** - Deploy to staging (on PRs)

### Setting Up Secrets

Add these secrets to your GitHub repository:

```
STELLAR_SECRET_KEY - Your Stellar secret key for deployments
VERCEL_TOKEN - Vercel deployment token (for frontend)
```

## 🌐 Deployment

### Deploy to Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Vercel Configuration

The project includes a `vercel.json` for optimal deployment:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```


## 📚 Smart Contracts Documentation

### GroupExpenseContract

**Functions:**
- `initialize(settlement_contract: Address)` - Initialize with settlement contract
- `create_group(creator: Address, name: String) -> u64` - Create new group
- `add_member(group_id: u64, member: Address, caller: Address)` - Add member to group
- `add_expense(group_id: u64, description: String, amount: i128, paid_by: Address, split_among: Vec<Address>) -> u64` - Record expense
- `calculate_settlements(group_id: u64) -> Vec<Settlement>` - Calculate optimal settlements
- `create_settlement(group_id: u64, from: Address, to: Address, amount: i128) -> u64` - Create settlement
- `get_group(group_id: u64) -> Group` - Get group details
- `get_expenses(group_id: u64) -> Vec<Expense>` - Get group expenses
- `get_settlements(group_id: u64) -> Vec<Settlement>` - Get group settlements

**Events:**
- `GroupCreated(group_id, creator, name)`
- `MemberAdded(group_id, member)`
- `ExpenseAdded(group_id, expense_id, paid_by, description, amount)`
- `SettlementCreated(group_id, settlement_id, from, to, amount)`

### SettlementContract

**Functions:**
- `record_settlement(group_id: u64, from: Address, to: Address, amount: i128) -> u64` - Record new settlement
- `mark_settled(settlement_id: u64, transaction_hash: String, caller: Address)` - Mark as settled
- `get_settlement(settlement_id: u64) -> SettlementRecord` - Get settlement details
- `get_group_settlements(group_id: u64) -> Vec<SettlementRecord>` - Get all settlements for group
- `get_pending_settlements(address: Address) -> Vec<SettlementRecord>` - Get pending settlements for address

**Events:**
- `SettlementRecorded(settlement_id, from, to, amount)`
- `SettlementSettled(settlement_id, caller, transaction_hash)`

## 🎯 Usage Guide

### 1. Connect Wallet

1. Install [Freighter Wallet](https://www.freighter.app/)
2. Create or import a Stellar account
3. Switch to Testnet
4. Fund your account from the [Stellar Testnet Faucet](https://laboratory.stellar.org/#account-creator?network=test)
5. Click "Connect Freighter" in StellarSplit

### 2. Create a Group

1. Navigate to "Groups & Settlements" tab
2. Enter a group name (e.g., "Weekend Trip")
3. Click "Create Group"
4. Group is created and you're automatically added as a member

### 3. Add Members

1. Select your group
2. Go to "Manage Expenses" tab
3. Enter member's Stellar address
4. Click "Add Member"

### 4. Add Expenses

1. Select your group
2. Enter expense description (e.g., "Dinner")
3. Enter amount in XLM
4. Select members to split with
5. Click "Add Expense"


### 5. Settle Debts

1. View settlements in "Groups & Settlements" tab
2. See your balance (positive = owed, negative = you owe)
3. Click "Settle Now" on pending settlements
4. Approve transaction in Freighter
5. Transaction is recorded on Stellar blockchain

## 📸 Screenshots

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)
*Main dashboard showing groups and analytics*

### Create Group
![Create Group](./docs/screenshots/create-group.png)
*Create a new expense group*

### Add Expense
![Add Expense](./docs/screenshots/add-expense.png)
*Record and split expenses*

### Settlements
![Settlements](./docs/screenshots/settlements.png)
*View and settle debts*

## 🎥 Demo Video

Watch the full demo: [StellarSplit Demo Video](https://youtu.be/YOUR_VIDEO_ID)

**Demo Highlights:**
1. Wallet connection and setup
2. Creating groups and adding members
3. Recording expenses
4. Calculating settlements
5. Settling debts on Stellar

## 📊 Transaction Examples

**Sample Transaction Hash:**
```
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

View on Stellar Explorer: [stellar.expert/explorer/testnet/tx/abc123...](https://stellar.expert/explorer/testnet/tx/abc123def456)

## 🐛 Troubleshooting

### Common Issues

**Wallet not connecting:**
- Ensure Freighter is installed and unlocked
- Check you're on Stellar Testnet
- Clear browser cache and reload

**Account not found error:**
- Fund your account from testnet faucet
- Minimum 1 XLM required for account activation

**Transaction failed:**
- Check XLM balance (maintain 2+ XLM reserve)
- Verify recipient address is valid
- Ensure network connection is stable

**Contract errors:**
- Verify contract IDs in `.env`
- Check contract is deployed and initialized
- Ensure you have transaction permissions


## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Use meaningful commit messages following this pattern:

```
type(scope): subject

body (optional)
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📝 Meaningful Commit Suggestions

1. `feat(contracts): implement group expense tracking contract`
2. `feat(contracts): add settlement contract with inter-contract calls`
3. `feat(frontend): integrate Freighter wallet connection`
4. `feat(ui): create responsive group dashboard`
5. `feat(expenses): add expense splitting with member selection`
6. `feat(settlements): implement settlement calculation algorithm`
7. `feat(transactions): add XLM payment with transaction tracking`
8. `test(frontend): add React component tests for wallet and balance`
9. `test(contracts): add comprehensive Rust contract tests`
10. `ci: setup GitHub Actions workflow for testing and deployment`
11. `docs: create comprehensive README with deployment guide`
12. `style(ui): implement production-ready CSS design system`
13. `feat(analytics): add dashboard metrics and statistics`
14. `fix(wallet): handle wallet connection errors gracefully`
15. `feat(ui): add real-time balance refresh after transactions`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Stellar Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Quest](https://quest.stellar.org/) - Learn Stellar development

## 🏆 Acknowledgments

- Stellar Development Foundation for the amazing blockchain
- Soroban team for smart contract capabilities
- Freighter team for the wallet integration
- React and Vite teams for the frontend framework

## 📧 Contact

- Project Link: [https://github.com/yourusername/stellarsplit](https://github.com/yourusername/stellarsplit)
- Issues: [https://github.com/yourusername/stellarsplit/issues](https://github.com/yourusername/stellarsplit/issues)

---

**Built with ❤️ on Stellar**

*This project satisfies Stellar White Belt, Blue Belt, and Advanced Level certification requirements.*
