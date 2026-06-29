# Deployment Guide

## Prerequisites

Before deploying StellarSplit, ensure you have:

- A Stellar account with testnet XLM (at least 10 XLM)
- Soroban CLI installed
- Node.js 18+ and npm
- Git
- Vercel account (for frontend deployment)

## Step 1: Smart Contract Deployment

### Install Soroban CLI

```bash
cargo install --locked soroban-cli --features opt
```

### Generate Deployment Identity

```bash
soroban config identity generate deployer
soroban config identity address deployer
```

### Fund Your Account

Visit the [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test) and fund your deployer account.

### Build Contracts

```bash
# Build Group Expense Contract
cd contracts/group_expense_contract
soroban contract build

# Build Settlement Contract
cd ../settlement_contract
soroban contract build
```

### Deploy Contracts

```bash
# Deploy Settlement Contract first
cd contracts/settlement_contract
SETTLEMENT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/settlement_contract.wasm \
  --source deployer \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015")

echo "Settlement Contract ID: $SETTLEMENT_ID"

# Deploy Group Expense Contract
cd ../group_expense_contract
GROUP_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/group_expense_contract.wasm \
  --source deployer \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015")

echo "Group Expense Contract ID: $GROUP_ID"

# Initialize Group Expense Contract
soroban contract invoke \
  --id $GROUP_ID \
  --source deployer \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- initialize \
  --settlement_contract $SETTLEMENT_ID
```

### Save Contract IDs

Create a file `contracts/deployed.json`:

```json
{
  "network": "testnet",
  "groupExpenseContract": "CXXXXX...",
  "settlementContract": "CXXXXX...",
  "deployedAt": "2026-06-25T00:00:00Z"
}
```

## Step 2: Frontend Configuration

### Update Environment Variables

Edit `frontend/.env`:

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_GROUP_EXPENSE_CONTRACT_ID=YOUR_GROUP_CONTRACT_ID
VITE_SETTLEMENT_CONTRACT_ID=YOUR_SETTLEMENT_CONTRACT_ID
```

## Step 3: Deploy to Vercel

### Install Vercel CLI

```bash
npm i -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy

```bash
# From project root
vercel --prod
```

### Configure Environment Variables in Vercel

1. Go to Vercel dashboard
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add all variables from `.env`

## Step 4: Verify Deployment

### Test Smart Contracts

```bash
# Test creating a group
soroban contract invoke \
  --id $GROUP_ID \
  --source deployer \
  -- create_group \
  --creator $(soroban config identity address deployer) \
  --name "Test Group"
```

### Test Frontend

1. Visit your Vercel URL
2. Connect Freighter wallet
3. Create a test group
4. Add a member
5. Create an expense
6. View settlements

## Production Checklist

- [ ] Smart contracts deployed and verified
- [ ] Contract IDs updated in environment variables
- [ ] Frontend deployed to Vercel
- [ ] All environment variables configured
- [ ] Wallet connection tested
- [ ] Transaction flow tested end-to-end
- [ ] Error handling verified
- [ ] Mobile responsiveness checked
- [ ] Documentation updated with live URLs

## Monitoring

### Contract Activity

Monitor your contracts on [Stellar Expert](https://stellar.expert/explorer/testnet):

```
https://stellar.expert/explorer/testnet/contract/YOUR_CONTRACT_ID
```

### Frontend Analytics

Setup Vercel Analytics for monitoring:

1. Enable Analytics in Vercel dashboard
2. Add Web Vitals tracking
3. Monitor error rates

## Troubleshooting

### Contract Deployment Fails

- Ensure you have sufficient XLM (minimum 5 XLM)
- Verify network connectivity
- Check Soroban CLI version

### Frontend Build Fails

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall
- Check Node.js version compatibility

### Transactions Failing

- Verify contract IDs are correct
- Check account has sufficient XLM
- Ensure wallet is on testnet

## Updating Contracts

To update deployed contracts:

```bash
# Build new version
cargo build --target wasm32-unknown-unknown --release

# Deploy new version
soroban contract deploy --wasm path/to/contract.wasm --source deployer ...

# Update frontend .env with new contract ID
# Redeploy frontend
vercel --prod
```

## Rollback

If issues occur after deployment:

```bash
# Revert frontend to previous version
vercel rollback

# For contracts, deploy previous WASM version
# Contracts are immutable - deploy a new instance if needed
```

## Support

For deployment issues:
- Check [Stellar Discord](https://discord.gg/stellar)
- Review [Soroban Documentation](https://soroban.stellar.org)
- Create an issue on GitHub
