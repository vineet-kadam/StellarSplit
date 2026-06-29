import { useState, useEffect } from 'react';
import { connectFreighter, disconnectWallet, getWalletErrorMessage } from '../utils/wallet';
import { getAccountBalance, shortenAddress } from '../utils/stellar';

function WalletCard({ onWalletConnect, onWalletDisconnect }) {
  const [publicKey, setPublicKey] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if wallet was previously connected
    const savedPublicKey = localStorage.getItem('stellar_public_key');
    if (savedPublicKey) {
      setPublicKey(savedPublicKey);
      onWalletConnect(savedPublicKey);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      console.log('WalletCard: Initiating connection...');
      const key = await connectFreighter();
      console.log('WalletCard: Connection successful');
      
      setPublicKey(key);
      localStorage.setItem('stellar_public_key', key);
      onWalletConnect(key);
    } catch (err) {
      console.error('WalletCard: Connection failed', err);
      const friendlyError = getWalletErrorMessage(err);
      setError(friendlyError);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    localStorage.removeItem('stellar_public_key');
    disconnectWallet();
    onWalletDisconnect();
  };

  return (
    <div className="wallet-card">
      <div className="wallet-header">
        <h3>Wallet Connection</h3>
        <div className="wallet-status">
          <span className={`status-dot ${publicKey ? 'connected' : 'disconnected'}`}></span>
          <span>{publicKey ? 'Connected' : 'Not Connected'}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {!publicKey ? (
        <div className="wallet-connect-section">
          <p className="wallet-description">
            Connect your Freighter wallet to start splitting expenses on Stellar
          </p>
          <button
            className="btn btn-primary btn-large"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <span className="wallet-icon">🔗</span>
                Connect Freighter
              </>
            )}
          </button>
          <p className="wallet-help">
            Don't have Freighter?{' '}
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Install it here
            </a>
          </p>
          
          <div style={{marginTop: '20px', padding: '15px', background: '#1e293b', borderRadius: '8px', border: '1px dashed #334155'}}>
            <p style={{fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px'}}>
              <strong>Having Freighter issues?</strong> Test without wallet:
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const testKey = 'GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCD';
                setPublicKey(testKey);
                localStorage.setItem('stellar_public_key', testKey);
                onWalletConnect(testKey);
              }}
              style={{width: '100%'}}
            >
              Use Test Address (Demo Mode)
            </button>
            <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '8px'}}>
              ⚠️ Demo mode only - won't send real transactions
            </p>
          </div>
        </div>
      ) : (
        <div className="wallet-info-section">
          <div className="wallet-address">
            <label>Public Key</label>
            <div className="address-display">
              <code>{shortenAddress(publicKey, 8)}</code>
              <button
                className="btn-icon"
                onClick={() => navigator.clipboard.writeText(publicKey)}
                title="Copy address"
              >
                📋
              </button>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-small"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default WalletCard;
