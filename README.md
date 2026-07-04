# 🌟 StellarSplit

> **A production-ready decentralized expense splitting dApp built on the Stellar blockchain**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-blue?style=for-the-badge)](https://stellarsplit-one.vercel.app)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-7B61FF?style=for-the-badge&logo=stellar)](https://stellar.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📖 About

StellarSplit revolutionizes group expense management by leveraging the Stellar blockchain's speed and low fees. Split bills, track expenses, and settle debts with friends seamlessly using XLM (Stellar Lumens).

**🔗 Live Demo:** [https://stellarsplit-one.vercel.app](https://stellarsplit-one.vercel.app)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Wallet Integration** | Freighter wallet + Demo mode for testing |
| 👥 **Group Management** | Create groups and add members instantly |
| 💰 **Smart Expense Tracking** | Record and split expenses automatically |
| ⚖️ **Optimal Settlements** | Calculate minimum payment flows |
| ⚡ **Real-Time Updates** | Live balance tracking |
| 📊 **Analytics Dashboard** | Comprehensive spending insights |
| 📱 **Mobile Responsive** | Works seamlessly on all devices |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + **Vite** - Modern, fast development
- **Pure CSS** - No UI framework dependencies
- **Stellar SDK** - Blockchain integration
- **Freighter API** - Wallet connectivity

### Smart Contracts
- **Rust** + **Soroban** - Stellar smart contracts
- **2 Inter-communicating Contracts** - GroupExpense & Settlement
- **Event-Driven Architecture** - Real-time updates

### Blockchain
- **Stellar Testnet** - Fast, low-cost transactions
- **Deployed Contracts** - Live on testnet

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust & Cargo (for contract development)
- [Freighter Wallet](https://www.freighter.app/) (optional - demo mode available)

### Installation

```bash
# Clone repository
git clone https://github.com/vineet-kadam/StellarSplit.git
cd StellarSplit

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Visit **http://localhost:3000**

---

## 📋 Smart Contracts

### Deployed on Stellar Testnet

**Group Expense Contract**  
`CD4AKO6M646K2NI5FOZNG7UX5PYRYX4BIE7AAGM3PPQQGS7PQJB42RBJ`

**Settlement Contract**  
`CDKXXH5Y4MUXNWP3XD4FIOGECNR5V4AKG2D25PCXLYGZVUM3N2LPSY6Y`

[View on Stellar Expert →](https://stellar.expert/explorer/testnet)

### Contract Functions

#### GroupExpenseContract
- `create_group()` - Create new expense group
- `add_member()` - Add members to group
- `add_expense()` - Record new expense
- `calculate_settlements()` - Calculate optimal payments
- `get_group()` - Retrieve group details

#### SettlementContract
- `record_settlement()` - Create settlement record
- `mark_settled()` - Mark debt as paid
- `get_pending_settlements()` - Get outstanding debts

[Full API Documentation →](docs/API.md)

---

## 🎯 Usage

### 1. Connect Wallet
- Click **"Connect Freighter"** for real wallet
- Or use **"Demo Mode"** for testing

### 2. Create Group
- Navigate to Groups tab
- Enter group name
- You're automatically added as admin

### 3. Add Members
- Enter Stellar addresses
- Members can view expenses and settlements

### 4. Record Expenses
- Enter description and amount
- Select who paid and who shares the cost
- System calculates split automatically

### 5. Settle Debts
- View calculated settlements
- Click "Settle Now" to pay
- Transactions recorded on blockchain

---

## 🧪 Testing

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

**Test Results:** 15 tests passing ✅

---

## 📦 Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
vercel --prod
```

### Smart Contracts
```bash
# Build contracts
cd contracts/group_expense_contract
stellar contract build

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/group_expense_contract.wasm \
  --source deployer \
  --network testnet
```

[Deployment Guide →](DEPLOYMENT.md)

---

## 📂 Project Structure

```
StellarSplit/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # 11 React components
│   │   ├── hooks/         # Custom hooks (useWallet)
│   │   ├── utils/         # Stellar & wallet utilities
│   │   └── __tests__/     # Test files
│   ├── package.json
│   └── vite.config.js
│
├── contracts/             # Rust smart contracts
│   ├── group_expense_contract/
│   │   └── src/lib.rs
│   └── settlement_contract/
│       └── src/lib.rs
│
├── docs/                  # Documentation
│   ├── API.md            # API reference
│   ├── ARCHITECTURE.md   # System design
│   └── screenshots/      # UI screenshots
│
├── .github/
│   └── workflows/
│       └── ci.yml        # CI/CD pipeline
│
├── DEPLOYED_CONTRACTS.md # Contract addresses
├── CONTRIBUTING.md       # Contribution guidelines
├── DEPLOYMENT.md         # Deployment instructions
└── README.md            # This file
```

---

## 🔧 Configuration

Create `frontend/.env`:

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Deployed Contract IDs
VITE_GROUP_EXPENSE_CONTRACT_ID=CD4AKO6M646K2NI5FOZNG7UX5PYRYX4BIE7AAGM3PPQQGS7PQJB42RBJ
VITE_SETTLEMENT_CONTRACT_ID=CDKXXH5Y4MUXNWP3XD4FIOGECNR5V4AKG2D25PCXLYGZVUM3N2LPSY6Y
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🔗 Links

- **Live Demo:** https://stellarsplit-one.vercel.app
- **GitHub:** https://github.com/vineet-kadam/StellarSplit
- **Stellar Docs:** https://developers.stellar.org/
- **Soroban:** https://soroban.stellar.org/

---

## 🙏 Acknowledgments

- Stellar Development Foundation
- Soroban Team
- Freighter Wallet Team
- React & Vite Communities

---

## 📧 Contact

**Project Link:** [github.com/vineet-kadam/StellarSplit](https://github.com/vineet-kadam/StellarSplit)

---

<div align="center">

**Built with ❤️ on Stellar**

⭐ Star this repo if you find it helpful!

</div>
