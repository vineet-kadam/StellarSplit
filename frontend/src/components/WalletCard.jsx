import { useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { shortenAddress } from '../utils/stellar';

function WalletCard({ onWalletConnect, onWalletDisconnect }) {
  const wallet = useWallet();

  // Notify parent component when wallet state changes
  useEffect(() => {
    if (wallet.address) {
      onWalletConnect(wallet.address);
    } else {
      onWalletDisconnect();
    }
  }, [wallet.address, onWalletConnect, onWalletDisconnect]);

  const handleConnect = async (type = 'freighter') => {
    await wallet.connect(type);
  };

  const handleDisconnect = () => {
    wallet.disconnect();
  };

  return (
    <div className="wallet-card">
      <div className="wallet-header">
        <h3>Wallet Connection</h3>
        <div className="wallet-status">
          <span className={`status-dot ${wallet.address ? 'connected' : 'disconnected'}`}></span>
          <span>{wallet.address ? 'Connected' : 'Not Connected'}</span>
          {wallet.network && (
            <span className="network-badge">{wallet.network}</span>
          )}
        </div>
      </div>

      {/* Freighter detection status */}
      {wallet.installed === false && (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          Freighter wallet not detected. Please install it to connect.
        </div>
      )}

      {wallet.error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {wallet.error}
        </div>
      )}

      {!wallet.address ? (
        <div className="wallet-connect-section">
          <p className="wallet-description">
            Connect your Freighter wallet to start splitting expenses on Stellar
          </p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => handleConnect('freighter')}
            disabled={wallet.connecting || wallet.installed === null}
          >
            {wallet.connecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : wallet.installed === null ? (
              <>
                <span className="spinner"></span>
                Detecting Freighter...
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
              onClick={() => handleConnect('demo')}
              disabled={wallet.connecting}
              style={{width: '100%'}}
            >
              Use Demo Wallet (Test Mode)
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
              <code>{shortenAddress(wallet.address, 8)}</code>
              <button
                className="btn-icon"
                onClick={() => navigator.clipboard.writeText(wallet.address)}
                title="Copy address"
              >
                📋
              </button>
            </div>
          </div>
          {wallet.networkOk && (
            <div className="network-info">
              <span className="success-icon">✓</span>
              <span>Connected to {wallet.network}</span>
            </div>
          )}
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
