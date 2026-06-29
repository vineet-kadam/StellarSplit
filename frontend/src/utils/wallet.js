/**
 * Stellar Wallet Integration using Freighter
 * Robust implementation with proper error handling
 */

import * as freighterApi from '@stellar/freighter-api';

/**
 * Check if Freighter is installed and accessible
 * @returns {Promise<boolean>}
 */
export async function isFreighterInstalled() {
  try {
    const connected = await freighterApi.isConnected();
    console.log('Freighter connection status:', connected);
    return connected;
  } catch (error) {
    console.log('Freighter check error:', error);
    return false;
  }
}

/**
 * Connect to Freighter wallet - triggers the popup
 * @returns {Promise<string>} - Public key
 */
export async function connectFreighter() {
  console.log('🔵 Starting Freighter connection...');
  
  try {
    // Step 1: Check if Freighter is installed
    const isInstalled = await isFreighterInstalled();
    
    if (!isInstalled) {
      console.error('❌ Freighter is not installed or not accessible');
      throw new Error('WALLET_NOT_FOUND');
    }
    
    console.log('✅ Freighter detected');
    console.log('🔵 Requesting public key (popup should appear)...');
    
    // Step 2: Request public key - THIS TRIGGERS THE POPUP
    const publicKey = await freighterApi.getPublicKey();
    
    console.log('🔵 Received public key:', publicKey);
    
    // Step 3: Validate the response
    if (!publicKey || publicKey === '') {
      console.error('❌ No public key returned');
      throw new Error('USER_REJECTED');
    }
    
    console.log('✅ Successfully connected! Address:', publicKey.substring(0, 8) + '...' + publicKey.substring(publicKey.length - 4));
    
    return publicKey;
    
  } catch (error) {
    console.error('❌ Freighter connection failed:', error);
    
    // Handle specific error types
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    // User rejected the connection
    if (errorMessage.includes('User declined') || 
        errorMessage.includes('rejected') ||
        errorMessage.includes('USER_REJECTED')) {
      throw new Error('Connection rejected. Please approve the connection request in the Freighter popup.');
    }
    
    // Freighter not found
    if (errorMessage.includes('WALLET_NOT_FOUND') || 
        errorMessage.includes('not installed') ||
        errorMessage.includes('not connected')) {
      throw new Error('Freighter wallet not found. Please install Freighter extension and restart your browser.');
    }
    
    // Freighter is locked
    if (errorMessage.includes('locked')) {
      throw new Error('Freighter is locked. Please unlock your wallet and try again.');
    }
    
    // Generic error
    throw new Error(`Failed to connect: ${errorMessage}`);
  }
}

/**
 * Sign a transaction with Freighter
 * @param {string} xdr - Transaction XDR string
 * @returns {Promise<string>} - Signed transaction XDR
 */
export async function signTransactionWithFreighter(xdr) {
  console.log('🔵 Signing transaction...');
  
  try {
    // Check if Freighter is available
    const isInstalled = await isFreighterInstalled();
    if (!isInstalled) {
      throw new Error('Freighter wallet not found');
    }
    
    // Sign the transaction
    const signedXDR = await freighterApi.signTransaction(xdr, {
      networkPassphrase: 'Test SDF Network ; September 2015',
    });
    
    console.log('✅ Transaction signed successfully');
    return signedXDR;
    
  } catch (error) {
    console.error('❌ Transaction signing failed:', error);
    
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    if (errorMessage.includes('User declined') || errorMessage.includes('rejected')) {
      throw new Error('Transaction rejected. Please approve the transaction in Freighter.');
    }
    
    throw new Error(`Failed to sign transaction: ${errorMessage}`);
  }
}

/**
 * Connect wallet (alias for connectFreighter)
 * @returns {Promise<object>}
 */
export async function connectWallet() {
  const publicKey = await connectFreighter();
  return {
    publicKey,
    walletType: 'freighter',
  };
}

/**
 * Sign transaction (alias for signTransactionWithFreighter)
 * @param {string} xdr
 * @returns {Promise<string>}
 */
export async function signTransaction(xdr) {
  return await signTransactionWithFreighter(xdr);
}

/**
 * Disconnect wallet
 */
export function disconnectWallet() {
  localStorage.removeItem('stellar_public_key');
  console.log('✅ Wallet disconnected');
}

/**
 * Get user-friendly error message
 * @param {Error} error
 * @returns {string}
 */
export function getWalletErrorMessage(error) {
  const errorMsg = error?.message || error?.toString() || '';
  
  // Map common errors to user-friendly messages
  const errorMappings = {
    'not found': 'Freighter wallet not found. Please install Freighter extension.',
    'not installed': 'Freighter wallet not installed. Visit https://www.freighter.app/ to install.',
    'rejected': 'You rejected the request. Please try again and approve the request.',
    'declined': 'You declined the request. Please try again and approve the request.',
    'locked': 'Freighter is locked. Please unlock your wallet and try again.',
    'Insufficient balance': 'Insufficient XLM balance. You need more XLM to complete this transaction.',
    'Invalid address': 'Invalid Stellar address. Please check the address and try again.',
    'Account not found': 'Account not found. Please fund your account from the Stellar testnet faucet.',
    'Network error': 'Network error. Please check your internet connection and try again.',
  };
  
  // Find matching error
  for (const [key, message] of Object.entries(errorMappings)) {
    if (errorMsg.toLowerCase().includes(key.toLowerCase())) {
      return message;
    }
  }
  
  // Return original error message if no mapping found
  return errorMsg || 'An unexpected error occurred. Please try again.';
}

/**
 * Get network configuration
 * @returns {object}
 */
export function getNetworkConfig() {
  return {
    network: 'TESTNET',
    networkPassphrase: 'Test SDF Network ; September 2015',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
  };
}

// Export all functions
export default {
  isFreighterInstalled,
  connectFreighter,
  signTransactionWithFreighter,
  connectWallet,
  signTransaction,
  disconnectWallet,
  getWalletErrorMessage,
  getNetworkConfig,
};
