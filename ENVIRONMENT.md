# Environment Variables Guide

Complete guide to configuring environment variables for StellarSplit.

## Frontend Environment Variables

Location: `frontend/.env`

### Required Variables

#### VITE_STELLAR_NETWORK
- **Description**: Stellar network to use
- **Type**: String
- **Options**: `TESTNET` | `MAINNET`
- **Default**: `TESTNET`
- **Example**: `VITE_STELLAR_NETWORK=TESTNET`
- **Note**: Always use TESTNET for development

#### VITE_STELLAR_NETWORK_PASSPHRASE
- **Description**: Network passphrase for transaction signing
- **Type**: String
- **Testnet Value**: `Test SDF Network ; September 2015`
- **Mainnet Value**: `Public Global Stellar Network ; September 2015`
- **Example**: `VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015`
- **Note**: Must match VITE_STELLAR_NETWORK

#### VITE_HORIZON_URL
- **Description**: Stellar Horizon API endpoint
- **Type**: URL
- **Testnet**: `https://horizon-testnet.stellar.org`
- **Mainnet**: `https://horizon.stellar.org`
- **Example**: `VITE_HORIZON_URL=https://horizon-testnet.stellar.org`
- **Note**: Used for account queries and transaction submission

#### VITE_SOROBAN_RPC_URL
- **Description**: Soroban RPC endpoint for smart contract interactions
- **Type**: URL
- **Testnet**: `https://soroban-testnet.stellar.org`
- **Mainnet**: `https://soroban-mainnet.stellar.org`
- **Example**: `VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org`
- **Note**: Required for contract invocations

### Optional Variables

#### VITE_GROUP_EXPENSE_CONTRACT_ID
- **Description**: Deployed GroupExpenseContract ID
- **Type**: String (Stellar Contract Address)
- **Format**: Starts with 'C'
- **Example**: `VITE_GROUP_EXPENSE_CONTRACT_ID=CAAAAAAA...`
- **Note**: Leave empty for demo mode (localStorage)
- **When Required**: For production with real contracts

#### VITE_SETTLEMENT_CONTRACT_ID
- **Description**: Deployed SettlementContract ID
- **Type**: String (Stellar Contract Address)
- **Format**: Starts with 'C'
- **Example**: `VITE_SETTLEMENT_CONTRACT_ID=CBBBBBB...`
- **Note**: Leave empty for demo mode (localStorage)
- **When Required**: For production with real contracts

## Configuration Profiles

### 1. Local Development (Demo Mode)

**Use Case**: Testing UI without deployed contracts

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_GROUP_EXPENSE_CONTRACT_ID=
VITE_SETTLEMENT_CONTRACT_ID=
```

**Features**:
- ✅ Wallet connection
- ✅ Balance display
- ✅ XLM transactions
- ✅ Group management (localStorage)
- ✅ Expense tracking (localStorage)
- ❌ Smart contract integration

### 2. Testnet with Contracts

**Use Case**: Full testing with deployed contracts

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_GROUP_EXPENSE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_SETTLEMENT_CONTRACT_ID=CYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

**Features**:
- ✅ All local development features
- ✅ Smart contract integration
- ✅ On-chain group/expense storage
- ✅ Contract events
- ✅ Full production simulation

### 3. Mainnet Production

**Use Case**: Production deployment

```env
VITE_STELLAR_NETWORK=MAINNET
VITE_STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
VITE_HORIZON_URL=https://horizon.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org
VITE_GROUP_EXPENSE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_SETTLEMENT_CONTRACT_ID=CYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

**Features**:
- ✅ Real XLM transactions
- ✅ Production smart contracts
- ⚠️ Use with caution - real money

## Environment-Specific Configuration

### Development (.env.development)

```env
# Development overrides
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEVTOOLS=true
```

### Production (.env.production)

```env
# Production optimizations
VITE_LOG_LEVEL=error
VITE_ENABLE_DEVTOOLS=false
```

## Vercel Deployment Variables

When deploying to Vercel, add these variables in the dashboard:

1. Go to Project Settings
2. Navigate to Environment Variables
3. Add each variable:
   - Key: Variable name (e.g., `VITE_STELLAR_NETWORK`)
   - Value: Variable value
   - Environment: Production / Preview / Development

**Important**: Vercel environment variables are set at build time for Vite projects.

## Security Best Practices

### ✅ DO

- Use environment variables for all configuration
- Keep `.env` out of version control (in `.gitignore`)
- Use different contracts for testnet/mainnet
- Validate all environment variables at startup
- Document required variables

### ❌ DON'T

- Commit `.env` files to Git
- Store private keys in environment variables
- Use mainnet for testing
- Hardcode configuration values
- Share production credentials

## Validation

The app validates environment variables on startup:

```javascript
// Example validation in code
if (!import.meta.env.VITE_STELLAR_NETWORK) {
  throw new Error('VITE_STELLAR_NETWORK is required');
}

if (import.meta.env.VITE_STELLAR_NETWORK !== 'TESTNET' && 
    import.meta.env.VITE_STELLAR_NETWORK !== 'MAINNET') {
  throw new Error('VITE_STELLAR_NETWORK must be TESTNET or MAINNET');
}
```

## Troubleshooting

### Variables Not Loading

**Symptom**: Environment variables show as `undefined`

**Solutions**:
1. Ensure variable names start with `VITE_`
2. Restart development server after changing `.env`
3. Check `.env` file is in `frontend/` directory
4. Verify no syntax errors in `.env` file

### Wrong Network

**Symptom**: Transactions fail with network errors

**Solutions**:
1. Verify `VITE_STELLAR_NETWORK` matches `VITE_STELLAR_NETWORK_PASSPHRASE`
2. Check Horizon and RPC URLs match network
3. Ensure wallet is on same network

### Contract Not Found

**Symptom**: Contract invocation fails

**Solutions**:
1. Verify contract IDs are correct (56 character strings starting with 'C')
2. Ensure contracts are deployed to the network you're using
3. Check contracts are initialized properly

## Getting Contract IDs

After deploying contracts:

```bash
# Deploy and capture ID
CONTRACT_ID=$(soroban contract deploy \
  --wasm path/to/contract.wasm \
  --source deployer \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015")

echo "Contract ID: $CONTRACT_ID"
```

Then add to `.env`:
```env
VITE_GROUP_EXPENSE_CONTRACT_ID=$CONTRACT_ID
```

## Testing Configuration

Test your configuration:

```bash
# Start dev server
cd frontend
npm run dev

# Check browser console for any configuration errors
# Should see: "✓ Configuration loaded successfully"
```

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Stellar Networks](https://developers.stellar.org/docs/glossary/network-passphrase/)
- [Soroban RPC](https://soroban.stellar.org/docs/reference/rpc)
- [Horizon API](https://developers.stellar.org/api/horizon/)

---

**Questions?** Open an issue or check the [main README](README.md)
