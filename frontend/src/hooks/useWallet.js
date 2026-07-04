import { useState, useEffect, useCallback } from 'react';
import freighterApi from '@stellar/freighter-api';

// Destructure Freighter API methods
const {
  isConnected,
  isAllowed,
  requestAccess,
  getPublicKey,
  getNetwork,
  signTransaction
} = freighterApi;

// Network constants
const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';
const MAINNET_PASSPHRASE = 'Public Global Stellar Network ; September 2015';

// Demo wallet addresses
const DEMO_ADDRESSES = [
  'GDEMO1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  'GDEMO2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'GCLIENT1CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
  'GCLIENT2DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
];

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [networkOk, setNetworkOk] = useState(false);
  const [installed, setInstalled] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Generate random demo address
  const getRandomDemoAddress = () => {
    return DEMO_ADDRESSES[Math.floor(Math.random() * DEMO_ADDRESSES.length)];
  };

  // Validate network
  const validateNetwork = (networkPassphrase) => {
    if (networkPassphrase === TESTNET_PASSPHRASE) {
      setNetwork('TESTNET');
      setNetworkOk(true);
      return true;
    } else if (networkPassphrase === MAINNET_PASSPHRASE) {
      setNetwork('MAINNET');
      setNetworkOk(true);
      return true;
    } else {
      setNetwork(null);
      setNetworkOk(false);
      return false;
    }
  };

  // Auto-detect Freighter with retry logic
  const detectFreighter = useCallback(async () => {
    const delays = [200, 400, 700, 1200, 2000];
    
    for (let i = 0; i < delays.length; i++) {
      try {
        // Check if window.freighter exists as backup
        if (typeof window !== 'undefined' && window.freighter) {
          setInstalled(true);
          return true;
        }
        
        // Use Freighter API
        const connected = await isConnected();
        if (connected) {
          setInstalled(true);
          return true;
        }
      } catch (err) {
        console.log(`Freighter detection attempt ${i + 1} failed:`, err);
      }
      
      // Wait before next attempt
      if (i < delays.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
    
    setInstalled(false);
    return false;
  }, []);

  // Auto-restore session if previously connected
  const restoreSession = useCallback(async () => {
    try {
      const allowed = await isAllowed();
      if (allowed) {
        const walletAddress = await getPublicKey();
        if (walletAddress) {
          setAddress(walletAddress);
          
          // Get network info
          try {
            const networkDetails = await getNetwork();
            if (networkDetails && networkDetails.network) {
              validateNetwork(networkDetails.network);
            }
          } catch (err) {
            console.warn('Could not get network info:', err);
            setNetwork('TESTNET');
            setNetworkOk(true);
          }
          
          // Save to localStorage
          localStorage.setItem('stellarsplit_wallet', walletAddress);
          localStorage.setItem('stellarsplit_wallet_type', 'freighter');
        }
      }
    } catch (err) {
      console.warn('Session restore failed:', err);
    }
  }, []);

  // Connect to Freighter wallet
  const connectFreighter = async () => {
    setConnecting(true);
    setError(null);

    try {
      // Check if Freighter is installed
      const freighterInstalled = await isConnected();
      if (!freighterInstalled) {
        throw new Error('Freighter wallet extension is not installed. Please install it from the Chrome Web Store or your browser\'s extension marketplace.');
      }

      // Request access with timeout
      const accessPromise = requestAccess();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 30000)
      );

      const result = await Promise.race([accessPromise, timeoutPromise]);

      // Handle user rejection
      if (!result || result.error) {
        throw new Error('Connection request was declined. Please try again and approve the connection in Freighter.');
      }

      // Get wallet address
      const walletAddress = await getPublicKey();
      if (!walletAddress) {
        throw new Error('Could not retrieve wallet address from Freighter. Please make sure you have an account set up.');
      }

      // Get network
      try {
        const networkDetails = await getNetwork();
        if (networkDetails && networkDetails.network) {
          validateNetwork(networkDetails.network);
        } else {
          setNetwork('TESTNET');
          setNetworkOk(true);
        }
      } catch (err) {
        console.warn('Could not get network, defaulting to TESTNET:', err);
        setNetwork('TESTNET');
        setNetworkOk(true);
      }

      setAddress(walletAddress);
      
      // Save to localStorage
      localStorage.setItem('stellarsplit_wallet', walletAddress);
      localStorage.setItem('stellarsplit_wallet_type', 'freighter');
      
      setError(null);
    } catch (err) {
      console.error('Freighter connection error:', err);
      
      // Handle specific error cases
      if (err.message === 'TIMEOUT') {
        setError('Connection timed out. Please check if Freighter is responding and try again.');
      } else if (err.message.includes('not installed')) {
        setError(err.message);
        setInstalled(false);
      } else if (err.message.includes('declined')) {
        setError(err.message);
      } else if (err.message.includes('locked')) {
        setError('Freighter wallet is locked. Please unlock it and try again.');
      } else if (err.message.includes('Could not retrieve')) {
        setError(err.message);
      } else if (err.message.includes('not a function') || err.name === 'TypeError') {
        setError('Freighter extension appears to be corrupted. Please try: 1) Reinstalling Freighter, 2) Restarting browser, or 3) Use Demo Mode below.');
      } else {
        setError(`Failed to connect: ${err.message}`);
      }
      
      setAddress(null);
      setNetwork(null);
      setNetworkOk(false);
    } finally {
      setConnecting(false);
    }
  };

  // Connect to demo wallet
  const connectDemo = async () => {
    setConnecting(true);
    setError(null);

    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 900));

      const demoAddress = getRandomDemoAddress();
      setAddress(demoAddress);
      setNetwork('TESTNET');
      setNetworkOk(true);

      // Save to localStorage
      localStorage.setItem('stellarsplit_wallet', demoAddress);
      localStorage.setItem('stellarsplit_wallet_type', 'demo');
      
      setError(null);
    } catch (err) {
      setError('Failed to connect demo wallet');
    } finally {
      setConnecting(false);
    }
  };

  // Main connect function
  const connect = useCallback(async (walletType = 'freighter') => {
    if (walletType === 'demo') {
      await connectDemo();
    } else if (walletType === 'freighter') {
      await connectFreighter();
    } else {
      setError('Invalid wallet type');
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setNetwork(null);
    setNetworkOk(false);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('stellarsplit_wallet');
    localStorage.removeItem('stellarsplit_wallet_type');
  }, []);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      // Check for saved session
      const savedAddress = localStorage.getItem('stellarsplit_wallet');
      const savedType = localStorage.getItem('stellarsplit_wallet_type');

      if (savedAddress && savedType === 'demo') {
        // Restore demo session
        setAddress(savedAddress);
        setNetwork('TESTNET');
        setNetworkOk(true);
        setInstalled(true);
        return;
      }

      // Detect Freighter
      const detected = await detectFreighter();
      
      if (detected && savedAddress && savedType === 'freighter') {
        // Try to restore Freighter session
        await restoreSession();
      }
    };

    initialize();
  }, [detectFreighter, restoreSession]);

  return {
    address,
    network,
    networkOk,
    installed,
    connecting,
    error,
    connect,
    disconnect
  };
}
