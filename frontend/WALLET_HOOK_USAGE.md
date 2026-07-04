# useWallet Hook - Complete Guide

## Overview

The `useWallet` hook provides a robust, production-ready solution for Freighter wallet integration with automatic detection, session restoration, and comprehensive error handling.

## Installation

```bash
npm install @stellar/freighter-api
```

## Features

✅ **Auto-Detection**: Detects Freighter extension with 5-attempt retry logic (200ms, 400ms, 700ms, 1200ms, 2000ms delays)  
✅ **Session Restoration**: Automatically restores previously connected wallet on page reload  
✅ **Demo Mode**: Built-in demo wallet mode for testing without Freighter  
✅ **Network Validation**: Validates TESTNET and MAINNET connections  
✅ **Error Handling**: User-friendly error messages for all failure scenarios  
✅ **TypeScript Ready**: Full type support (can be converted to .ts easily)

## Basic Usage

```jsx
import { useWallet } from './hooks/useWallet';

function App() {
  const wallet = useWallet();

  return (
    <div>
      {wallet.address ? (
        <div>
          <p>Connected: {wallet.address}</p>
          <p>Network: {wallet.network}</p>
          <button onClick={wallet.disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => wallet.connect('freighter')}
            disabled={wallet.connecting || wallet.installed === null}
          >
            {wallet.connecting ? 'Connecting...' : 
             wallet.installed === null ? 'Detecting Freighter...' :
             'Connect Freighter'}
          </button>
          
          <button onClick={() => wallet.connect('demo')}>
            Demo Mode
          </button>
        </div>
      )}
      
      {wallet.error && <p>Error: {wallet.error}</p>}
      {wallet.installed === false && (
        <p>Freighter not installed. <a href="https://freighter.app">Get it here</a></p>
      )}
    </div>
  );
}
```

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `address` | `string \| null` | Connected wallet address (Stellar public key) |
| `network` | `'TESTNET' \| 'MAINNET' \| null` | Current network passphrase |
| `networkOk` | `boolean` | `true` if connected to valid Stellar network |
| `installed` | `null \| true \| false` | `null` while checking, `true` if Freighter found, `false` if not found |
| `connecting` | `boolean` | `true` during connection attempt |
| `error` | `string \| null` | Error message or `null` if no error |
| `connect` | `(type: 'freighter' \| 'demo') => Promise<void>` | Function to initiate connection |
| `disconnect` | `() => void` | Function to disconnect wallet |

## Connection Flow

### Freighter Connection

```jsx
// Connect to Freighter wallet
await wallet.connect('freighter');
```

**What happens:**
1. Checks if Freighter is installed
2. Calls `requestAccess()` to trigger Freighter popup
3. User approves/rejects in popup
4. Gets wallet address and network info
5. Saves to localStorage for session restore
6. Updates state with address, network, and validation

### Demo Mode Connection

```jsx
// Connect to demo wallet (no Freighter needed)
await wallet.connect('demo');
```

**What happens:**
1. Simulates 900ms connection delay
2. Returns random demo address (GDEMO... or GCLIENT...)
3. Sets network to TESTNET
4. Saves to localStorage
5. Perfect for testing UI without wallet

## Error Messages

The hook provides user-friendly error messages:

| Error Scenario | Message |
|----------------|---------|
| Freighter not installed | "Freighter wallet extension is not installed. Please install it from the Chrome Web Store..." |
| User rejected connection | "Connection request was declined. Please try again and approve the connection in Freighter." |
| Wallet locked | "Freighter wallet is locked. Please unlock it and try again." |
| Connection timeout (30s) | "Connection timed out. Please check if Freighter is responding..." |
| No address retrieved | "Could not retrieve wallet address from Freighter. Please make sure you have an account set up." |

## Session Restoration

The hook automatically restores previous sessions:

```jsx
// On component mount:
useEffect(() => {
  // 1. Detects Freighter (5 attempts with retry)
  // 2. Checks localStorage for saved address
  // 3. If found, calls isAllowed() to verify permission
  // 4. Restores address and network if still allowed
}, []);
```

**localStorage keys:**
- `stellarsplit_wallet`: Saved wallet address
- `stellarsplit_wallet_type`: 'freighter' or 'demo'

## Network Constants

```javascript
const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';
const MAINNET_PASSPHRASE = 'Public Global Stellar Network ; September 2015';
```

The hook validates the network passphrase and sets:
- `network`: 'TESTNET' or 'MAINNET'
- `networkOk`: `true` if valid, `false` if unknown

## Demo Addresses

Built-in demo addresses for testing:

```javascript
'GDEMO1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
'GDEMO2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'
'GCLIENT1CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'
'GCLIENT2DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
```

## Advanced Examples

### Show Detection Status

```jsx
function WalletButton() {
  const wallet = useWallet();
  
  if (wallet.installed === null) {
    return <button disabled>🔍 Detecting Freighter...</button>;
  }
  
  if (wallet.installed === false) {
    return (
      <div>
        <p>⚠️ Freighter not found</p>
        <a href="https://freighter.app">Install Freighter</a>
      </div>
    );
  }
  
  return (
    <button onClick={() => wallet.connect('freighter')}>
      Connect Wallet
    </button>
  );
}
```

### Network Badge

```jsx
function NetworkBadge() {
  const wallet = useWallet();
  
  if (!wallet.network) return null;
  
  return (
    <span className={wallet.networkOk ? 'badge-success' : 'badge-warning'}>
      {wallet.network}
    </span>
  );
}
```

### Error Display

```jsx
function ErrorAlert() {
  const wallet = useWallet();
  
  if (!wallet.error) return null;
  
  return (
    <div className="alert alert-error">
      ⚠️ {wallet.error}
      <button onClick={() => wallet.connect('freighter')}>
        Try Again
      </button>
    </div>
  );
}
```

### Connection Status

```jsx
function ConnectionStatus() {
  const wallet = useWallet();
  
  return (
    <div>
      <div className="status-indicator">
        <span className={wallet.address ? 'dot green' : 'dot red'}></span>
        {wallet.address ? 'Connected' : 'Not Connected'}
      </div>
      
      {wallet.address && (
        <div>
          <code>{wallet.address}</code>
          <button onClick={() => navigator.clipboard.writeText(wallet.address)}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
```

## Troubleshooting

### Freighter Not Detected

**Problem**: `wallet.installed` stays `null` or becomes `false`

**Solutions**:
1. Make sure Freighter extension is installed and enabled
2. Check browser extension permissions
3. Try refreshing the page
4. Use demo mode as fallback: `wallet.connect('demo')`

### Connection Popup Not Appearing

**Problem**: Click "Connect" but no Freighter popup shows

**Possible Causes**:
1. Popup blocked by browser (check address bar for blocked popup icon)
2. Freighter is locked (unlock it first)
3. Freighter extension is disabled
4. Browser extension conflicts

**Solutions**:
- Check for popup blocker
- Unlock Freighter wallet
- Restart browser
- Use demo mode for testing

### Session Not Restoring

**Problem**: Wallet disconnects on page reload

**Check**:
1. localStorage is not disabled
2. Browser not in incognito/private mode
3. No localStorage clearing extensions
4. Check browser console for errors

### Network Validation Fails

**Problem**: `networkOk` is `false` even when connected

**This means**:
- Freighter is connected to unknown/custom network
- Not using official Stellar TESTNET or MAINNET

**Solution**:
- Switch Freighter to TESTNET or MAINNET in extension settings

## Best Practices

### 1. Handle All States

```jsx
const wallet = useWallet();

// Checking for Freighter
if (wallet.installed === null) {
  return <Spinner />;
}

// Freighter not found
if (wallet.installed === false) {
  return <InstallPrompt />;
}

// Connection in progress
if (wallet.connecting) {
  return <ConnectingIndicator />;
}

// Error occurred
if (wallet.error) {
  return <ErrorMessage error={wallet.error} />;
}

// Connected
if (wallet.address) {
  return <ConnectedView address={wallet.address} />;
}

// Not connected
return <ConnectButton />;
```

### 2. Provide Demo Mode Fallback

```jsx
<div>
  <button onClick={() => wallet.connect('freighter')}>
    Connect Freighter
  </button>
  
  <button onClick={() => wallet.connect('demo')} className="secondary">
    Try Demo Mode
  </button>
  
  <p className="help-text">
    Demo mode doesn't require Freighter - perfect for testing!
  </p>
</div>
```

### 3. Show Clear Error Messages

```jsx
{wallet.error && (
  <div className="error-banner">
    <strong>Connection Failed</strong>
    <p>{wallet.error}</p>
    <button onClick={() => wallet.connect('freighter')}>
      Retry
    </button>
  </div>
)}
```

### 4. Validate Network

```jsx
{wallet.address && !wallet.networkOk && (
  <div className="warning-banner">
    ⚠️ Unknown network detected. Please switch Freighter to TESTNET or MAINNET.
  </div>
)}
```

## Integration with Stellar SDK

```jsx
import { StellarSdk } from '@stellar/stellar-sdk';

function useTransaction() {
  const wallet = useWallet();
  
  const sendPayment = async (destination, amount) => {
    if (!wallet.address) {
      throw new Error('Wallet not connected');
    }
    
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    const account = await server.loadAccount(wallet.address);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: wallet.network === 'TESTNET' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    })
      .addOperation(StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString()
      }))
      .setTimeout(30)
      .build();
    
    const { signedTxXdr } = await signTransaction(transaction.toXDR(), {
      network: wallet.network,
      networkPassphrase: wallet.network === 'TESTNET'
        ? StellarSdk.Networks.TESTNET
        : StellarSdk.Networks.PUBLIC
    });
    
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedTxXdr,
      wallet.network === 'TESTNET' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    );
    
    return await server.submitTransaction(signedTx);
  };
  
  return { sendPayment };
}
```

## Testing

### Test Demo Mode

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useWallet } from './hooks/useWallet';

test('demo mode connection works', async () => {
  const TestComponent = () => {
    const wallet = useWallet();
    return (
      <div>
        <button onClick={() => wallet.connect('demo')}>Connect Demo</button>
        {wallet.address && <span>Connected: {wallet.address}</span>}
      </div>
    );
  };
  
  render(<TestComponent />);
  
  fireEvent.click(screen.getByText('Connect Demo'));
  
  await screen.findByText(/Connected: GDEMO/);
});
```

## Summary

The `useWallet` hook provides:

✅ Automatic Freighter detection with retry logic  
✅ Session persistence across page reloads  
✅ Demo mode for testing without wallet  
✅ Network validation (TESTNET/MAINNET)  
✅ Comprehensive error handling  
✅ User-friendly error messages  
✅ TypeScript-ready architecture  
✅ Production-ready code  

Perfect for building Stellar dApps with confidence! 🚀
