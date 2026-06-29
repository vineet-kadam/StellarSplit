# Architecture Documentation

## System Overview

StellarSplit is a full-stack decentralized application built on the Stellar blockchain using Soroban smart contracts.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Wallet     │  │  Group Mgmt  │  │  Settlements │  │
│  │  Integration │  │  Components  │  │   Dashboard  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                           │                               │
└───────────────────────────┼───────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Stellar SDK   │
                    │   & Horizon    │
                    └───────┬────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │         Stellar Blockchain            │
        │  ┌─────────────────────────────────┐  │
        │  │   Soroban Smart Contracts       │  │
        │  │  ┌──────────────────────────┐   │  │
        │  │  │ GroupExpenseContract     │   │  │
        │  │  │  - create_group()        │   │  │
        │  │  │  - add_member()          │   │  │
        │  │  │  - add_expense()         │───┼──┼──┐
        │  │  │  - create_settlement()   │   │  │  │
        │  │  └──────────────────────────┘   │  │  │
        │  │                                  │  │  │
        │  │  ┌──────────────────────────┐   │  │  │
        │  │  │ SettlementContract       │◄──┼──┼──┘
        │  │  │  - record_settlement()   │   │  │
        │  │  │  - mark_settled()        │   │  │
        │  │  │  - get_settlement()      │   │  │
        │  │  └──────────────────────────┘   │  │
        │  └─────────────────────────────────┘  │
        └───────────────────────────────────────┘
```

## Component Breakdown

### Frontend Layer

#### 1. Wallet Integration
- **Purpose:** Connect to Stellar wallets (Freighter, xBull, etc.)
- **Components:** WalletCard.jsx, BalanceCard.jsx
- **Key Functions:**
  - Connect/disconnect wallet
  - Display balance
  - Sign transactions
  - Handle errors

#### 2. Group Management
- **Purpose:** Create and manage expense groups
- **Components:** CreateGroupForm.jsx, AddMemberForm.jsx, GroupDashboard.jsx
- **Features:**
  - Create groups
  - Add/remove members
  - View group details
  - Group analytics

#### 3. Expense Tracking
- **Purpose:** Record and split expenses
- **Components:** AddExpenseForm.jsx
- **Features:**
  - Add expenses with description and amount
  - Select members to split with
  - Calculate per-person shares
  - View expense history

#### 4. Settlement Management
- **Purpose:** Calculate and execute settlements
- **Components:** SettlementDashboard.jsx
- **Features:**
  - Calculate balances
  - Generate optimal settlements
  - Execute payments
  - Track settlement status

### Smart Contract Layer

#### GroupExpenseContract

**Data Structures:**
```rust
struct Group {
    id: u64,
    name: String,
    creator: Address,
    members: Vec<Address>,
    created_at: u64,
}

struct Expense {
    id: u64,
    group_id: u64,
    description: String,
    amount: i128,
    paid_by: Address,
    split_among: Vec<Address>,
    created_at: u64,
}
```

**State Management:**
- Persistent storage using Soroban SDK
- Counter-based ID generation
- Indexed access by group ID

#### SettlementContract

**Data Structures:**
```rust
struct SettlementRecord {
    id: u64,
    group_id: u64,
    from: Address,
    to: Address,
    amount: i128,
    is_settled: bool,
    transaction_hash: String,
    settled_at: u64,
    created_at: u64,
}
```

## Data Flow

### Creating an Expense

```
1. User fills AddExpenseForm
2. Frontend validates input
3. Calls GroupExpenseContract.add_expense()
4. Contract validates caller is member
5. Contract stores expense
6. Event emitted: ExpenseAdded
7. Frontend updates UI
```

### Settling a Debt

```
1. User views pending settlements
2. Clicks "Settle Now"
3. Frontend initiates XLM payment via Stellar SDK
4. User approves in wallet
5. Transaction submitted to Stellar
6. On success:
   a. Call SettlementContract.mark_settled()
   b. Store transaction hash
   c. Update UI with success message
```

## State Management

### Frontend State
- React useState for local component state
- localStorage for persistence
- No global state management (kept simple)

### Contract State
- Soroban persistent storage
- Key-value storage pattern
- Efficient indexing by ID

## Security Model

### Authentication
- All state-changing contract calls require caller authentication
- Wallet signatures verify transaction authorization

### Authorization
- Group creators control membership
- Only payers can mark settlements as settled
- Members-only expense creation

### Input Validation
- Frontend validates before submission
- Contracts validate all inputs
- Address validation using Stellar SDK

## Performance Considerations

### Frontend
- Code splitting with React.lazy
- Lazy loading of components
- Optimized CSS (no framework overhead)
- Efficient re-renders

### Smart Contracts
- Optimized data structures
- Minimal storage operations
- Batch operations where possible
- Gas-efficient algorithms

## Scalability

### Current Limitations
- Groups stored individually (not enumerable)
- Linear settlement calculation
- In-memory balance calculations

### Future Improvements
- Indexed group queries
- Optimized settlement algorithm (O(n²) → O(n log n))
- Pagination for large expense lists
- Event-based real-time updates

## Error Handling

### Frontend
- Try-catch blocks for async operations
- User-friendly error messages
- Fallback UI for errors
- Network error recovery

### Smart Contracts
- Panic on invalid input
- Clear error messages
- Transaction atomicity
- State consistency

## Testing Strategy

### Unit Tests
- Component tests with React Testing Library
- Contract tests with Soroban SDK testutils
- Utility function tests

### Integration Tests
- End-to-end user flows
- Contract interaction tests
- Wallet integration tests

### Manual Testing
- Cross-browser compatibility
- Mobile responsiveness
- Transaction flows
- Error scenarios

## Deployment Architecture

```
GitHub Repository
       │
       ├─► GitHub Actions (CI/CD)
       │   ├─► Frontend Tests
       │   ├─► Contract Tests
       │   └─► Build
       │
       ├─► Soroban Testnet (Contracts)
       │   ├─► GroupExpenseContract
       │   └─► SettlementContract
       │
       └─► Vercel (Frontend)
           └─► Production Build
```

## Technology Choices

### Why Stellar?
- Low transaction fees
- Fast finality (3-5 seconds)
- Built-in DEX
- Active ecosystem

### Why Soroban?
- Rust safety guarantees
- WASM performance
- Native Stellar integration
- Growing tooling

### Why React?
- Component reusability
- Large ecosystem
- Performance
- Developer experience

### Why Plain CSS?
- No bundle bloat
- Full control
- Better performance
- No framework lock-in
