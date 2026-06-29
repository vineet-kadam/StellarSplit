# Smart Contracts

## Overview

StellarSplit uses two Soroban smart contracts that work together to manage group expenses and settlements on the Stellar blockchain.

## Contracts

### 1. GroupExpenseContract

The main contract for managing groups, members, and expenses.

**Location:** `group_expense_contract/src/lib.rs`

**Key Features:**
- Create and manage expense groups
- Add/remove members
- Record expenses with custom splits
- Calculate optimal settlements
- Track group history

**Storage:**
- Groups (id → Group struct)
- Expenses (group_id → Vec<Expense>)
- Settlements (group_id → Vec<Settlement>)

### 2. SettlementContract

Manages settlement records and payment tracking.

**Location:** `settlement_contract/src/lib.rs`

**Key Features:**
- Record settlement intentions
- Track payment status
- Store transaction hashes
- Query pending/completed settlements

**Inter-Contract Communication:**
GroupExpenseContract calls SettlementContract when creating settlements to maintain a separate ledger of payment records.

## Building

```bash
# Build both contracts
cd group_expense_contract
cargo build --target wasm32-unknown-unknown --release

cd ../settlement_contract
cargo build --target wasm32-unknown-unknown --release
```

## Testing

```bash
# Test Group Expense Contract
cd group_expense_contract
cargo test --release

# Test Settlement Contract
cd settlement_contract
cargo test --release
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.

## Contract Sizes

Optimized for Soroban's size limits:
- GroupExpenseContract: ~45KB
- SettlementContract: ~30KB

## Gas Optimization

Both contracts are optimized for low gas consumption:
- Efficient data structures
- Minimal storage reads/writes
- Optimized arithmetic operations

## Security Considerations

- All state-changing functions require authentication
- Only group creators can add members
- Only payers can mark settlements as settled
- Input validation on all public functions

## Future Enhancements

- Recurring expenses
- Expense categories
- Multi-token support
- Dispute resolution
- Automated settlements
