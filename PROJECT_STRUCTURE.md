# 📁 StellarSplit Project Structure

## Overview

Clean, professional, production-ready structure following industry best practices.

```
StellarSplit/
│
├── 📁 .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline configuration
│
├── 📁 contracts/                     # Rust Soroban Smart Contracts
│   ├── group_expense_contract/
│   │   ├── Cargo.toml               # Rust dependencies
│   │   └── src/
│   │       └── lib.rs               # Main contract logic (11 functions)
│   ├── settlement_contract/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       └── lib.rs               # Settlement logic (6 functions)
│   └── README.md                    # Contract documentation
│
├── 📁 docs/                          # Documentation
│   ├── API.md                       # API reference
│   ├── ARCHITECTURE.md              # System architecture
│   ├── INDEX.md                     # Documentation index
│   ├── TEST_RESULTS.md              # Test documentation
│   └── screenshots/                 # UI screenshots
│
├── 📁 frontend/                      # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/           # React Components (11 files)
│   │   │   ├── AddExpenseForm.jsx
│   │   │   ├── AddMemberForm.jsx
│   │   │   ├── AnalyticsCards.jsx
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── CreateGroupForm.jsx
│   │   │   ├── GroupDashboard.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── SendXLMForm.jsx
│   │   │   ├── SettlementDashboard.jsx
│   │   │   └── WalletCard.jsx
│   │   │
│   │   ├── 📁 hooks/                # Custom React Hooks
│   │   │   └── useWallet.js         # Freighter wallet integration
│   │   │
│   │   ├── 📁 utils/                # Utility Functions
│   │   │   ├── stellar.js           # Stellar SDK utilities
│   │   │   └── wallet.js            # Wallet connection utilities
│   │   │
│   │   ├── 📁 __tests__/            # Test Files
│   │   │   ├── BalanceCard.test.jsx
│   │   │   ├── SendXLMForm.test.jsx
│   │   │   ├── useWallet.test.jsx
│   │   │   └── WalletCard.test.jsx
│   │   │
│   │   ├── App.jsx                  # Main App component
│   │   ├── App.css                  # Global styles (972 lines)
│   │   ├── main.jsx                 # Entry point
│   │   └── setupTests.js            # Test configuration
│   │
│   ├── .env                         # Environment variables (gitignored)
│   ├── .env.example                 # Environment template
│   ├── .gitignore                   # Frontend gitignore
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # NPM dependencies
│   ├── package-lock.json            # Dependency lock file
│   └── vite.config.js               # Vite configuration
│
├── 📁 scripts/                       # Build & deployment scripts
│
├── .gitignore                       # Git ignore rules
├── CONTRIBUTING.md                  # Contribution guidelines
├── DEPLOYED_CONTRACTS.md            # Contract addresses & deployment info
├── DEPLOYMENT.md                    # Deployment instructions
├── LICENSE                          # MIT License
├── README.md                        # Main documentation
└── vercel.json                      # Vercel deployment config
```

---

## 📊 File Statistics

| Category | Count | Lines of Code |
|----------|-------|---------------|
| React Components | 11 | ~1,500 |
| Custom Hooks | 1 | ~250 |
| Utility Functions | 2 | ~200 |
| Test Files | 4 | ~300 |
| Smart Contracts | 2 | ~600 |
| Documentation | 5+ | ~2,000 |
| **Total** | **25+** | **~4,850** |

---

## 🎯 Key Directories

### `/frontend/src/components/`
**Purpose:** Reusable React UI components  
**Pattern:** Functional components with hooks  
**Styling:** Plain CSS (no frameworks)

### `/frontend/src/hooks/`
**Purpose:** Custom React hooks for shared logic  
**Key Hook:** `useWallet` - Complete Freighter integration with auto-detection, session restore, and error handling

### `/frontend/src/utils/`
**Purpose:** Utility functions for Stellar and wallet operations  
**Key Files:**
- `stellar.js` - Stellar SDK wrappers
- `wallet.js` - Wallet connection logic

### `/contracts/`
**Purpose:** Rust Soroban smart contracts  
**Contracts:**
- `group_expense_contract` - Main business logic (11 functions)
- `settlement_contract` - Settlement tracking (6 functions)

### `/docs/`
**Purpose:** Comprehensive project documentation  
**Contents:**
- API references
- Architecture diagrams
- Test results
- Screenshots

---

## 🔒 Environment Files

### `.env` (gitignored - contains actual values)
```env
VITE_STELLAR_NETWORK=TESTNET
VITE_GROUP_EXPENSE_CONTRACT_ID=CD4AKO6M...
VITE_SETTLEMENT_CONTRACT_ID=CDKXXH5Y...
```

### `.env.example` (committed - template)
```env
VITE_STELLAR_NETWORK=TESTNET
VITE_GROUP_EXPENSE_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
VITE_SETTLEMENT_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
```

---

## 🧪 Test Organization

```
frontend/src/__tests__/
├── BalanceCard.test.jsx      # 2 tests
├── SendXLMForm.test.jsx       # 2 tests  
├── useWallet.test.jsx         # 8 tests
└── WalletCard.test.jsx        # 3 tests

Total: 15 tests passing ✅
```

---

## 📝 Documentation Structure

```
docs/
├── API.md              # Smart contract API reference
├── ARCHITECTURE.md     # System design & architecture
├── INDEX.md            # Documentation index
├── TEST_RESULTS.md     # Test results & coverage
└── screenshots/        # UI & CI/CD screenshots
```

---

## 🚀 CI/CD Structure

```
.github/workflows/ci.yml
├── frontend-test      # Run frontend tests
├── contract-test      # Run contract tests
└── Build both         # Verify everything compiles
```

---

## 🎨 CSS Organization

**File:** `frontend/src/App.css` (972 lines)

```
├── Reset & Base Styles
├── Layout (Container, Grid)
├── Hero Section
├── Card Components
├── Form Elements
├── Buttons
├── Wallet Components
├── Dashboard Styles
├── Analytics Cards
├── Mobile Responsive (768px, 1024px breakpoints)
└── Utility Classes
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite build configuration |
| `vercel.json` | Vercel deployment settings |
| `.gitignore` | Git ignore patterns |
| `package.json` | NPM dependencies & scripts |
| `Cargo.toml` | Rust contract dependencies |

---

## 📦 Dependencies

### Frontend
- `react` & `react-dom` - UI framework
- `@stellar/freighter-api` - Wallet integration
- `stellar-sdk` - Blockchain SDK
- `vite` - Build tool
- `vitest` - Testing framework

### Smart Contracts
- `soroban-sdk` - Soroban contract SDK
- Rust `wasm32-unknown-unknown` target

---

## 🎯 Design Principles

1. **Separation of Concerns** - Components, hooks, utils clearly separated
2. **Reusability** - Modular components and shared hooks
3. **Testability** - Comprehensive test coverage
4. **Maintainability** - Clear naming and documentation
5. **Scalability** - Easy to add new features
6. **Production-Ready** - Error handling, loading states, responsive design

---

## 📈 Growth Path

This structure easily supports:
- ✅ Additional smart contracts
- ✅ More React components
- ✅ Additional test suites
- ✅ Extended documentation
- ✅ Multiple deployment environments
- ✅ Team collaboration

---

**Clean, professional, ready for production!** 🚀
