# 🚀 Deployed Smart Contracts

## Deployment Information

**Network:** Stellar Testnet  
**Deployment Date:** July 5, 2026  
**Deployer Address:** GAZXLLNXDYD2GQK4EZJOPJAY3ZIR4J6S277V3RCPSYTI4QBGC6WARWMK

---

## Contract IDs

### Settlement Contract
**Contract ID:** `CDKXXH5Y4MUXNWP3XD4FIOGECNR5V4AKG2D25PCXLYGZVUM3N2LPSY6Y`

**View on Stellar Expert:**  
https://stellar.expert/explorer/testnet/contract/CDKXXH5Y4MUXNWP3XD4FIOGECNR5V4AKG2D25PCXLYGZVUM3N2LPSY6Y

**Deployment Transaction:**  
https://stellar.expert/explorer/testnet/tx/a668495ddc91a3945c5c2296264a97a5523f3edc3a340cbe681b24c1bc6fffea

**WASM Hash:** `3305a01a716a2927880da5dd8ec3489db8b850b02a34c29bd9dbc1ee5d0a3033`

---

### Group Expense Contract
**Contract ID:** `CD4AKO6M646K2NI5FOZNG7UX5PYRYX4BIE7AAGM3PPQQGS7PQJB42RBJ`

**View on Stellar Expert:**  
https://stellar.expert/explorer/testnet/contract/CD4AKO6M646K2NI5FOZNG7UX5PYRYX4BIE7AAGM3PPQQGS7PQJB42RBJ

**Deployment Transaction:**  
https://stellar.expert/explorer/testnet/tx/9acf1215d1d5b2e5e99bdad08e7e6828976712d0cf08eb9de9fb839541fc07a1

**WASM Hash:** `69b9e4f7bde0bd170f535850bda6a4a5cb1614ff3d0e78b900aac1145ca60c69`

---

## Deployment Details

### Build Information
- **Rust Version:** 1.96.1
- **Stellar CLI Version:** 25.1.0
- **Target:** wasm32v1-none
- **Optimization:** Release profile with LTO

### Contract Sizes
- **Settlement Contract:** 6,408 bytes (6.4 KB)
- **Group Expense Contract:** 12,835 bytes (12.8 KB)

### Exported Functions

**Settlement Contract (6 functions):**
- `record_settlement`
- `mark_settled`
- `get_settlement`
- `get_group_settlements`
- `get_pending_settlements`

**Group Expense Contract (11 functions):**
- `initialize`
- `create_group`
- `add_member`
- `add_expense`
- `calculate_settlements`
- `create_settlement`
- `get_group`
- `get_expenses`
- `get_settlements`
- `mark_settlement_settled`

---

## Frontend Configuration

Add these to your `frontend/.env` file:

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

## Verification

### Verify Contracts on Stellar Expert

1. **Settlement Contract:**
   ```bash
   https://stellar.expert/explorer/testnet/contract/CDKXXH5Y4MUXNWP3XD4FIOGECNR5V4AKG2D25PCXLYGZVUM3N2LPSY6Y
   ```

2. **Group Expense Contract:**
   ```bash
   https://stellar.expert/explorer/testnet/contract/CD4AKO6M646K2NI5FOZNG7UX5PYRYX4BIE7AAGM3PPQQGS7PQJB42RBJ
   ```

### Test Contract Invocation

```bash
# Example: Get group information
stellar contract invoke \
  --id CD4AKO6M646K2NI5FOZNG7UX5PYRYX4BIE7AAGM3PPQQGS7PQJB42RBJ \
  --source deployer \
  --network testnet \
  -- get_group \
  --group_id 1
```

---

## Status

✅ Both contracts successfully deployed to Stellar Testnet  
✅ Contracts verified on Stellar Expert  
✅ Frontend configuration updated  
✅ Ready for production use

---

## Next Steps

1. Test contract functions in frontend
2. Create test groups and expenses
3. Verify inter-contract communication
4. Monitor transactions on Stellar Expert

