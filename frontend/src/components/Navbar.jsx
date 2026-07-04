import { useWallet } from '../hooks/useWallet';
import { shortenAddress } from '../utils/stellar';

function Navbar() {
  const wallet = useWallet();

  const handleConnect = (type) => {
    wallet.connect(type);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">✨</span>
          <span className="brand-name">StellarSplit</span>
          {wallet.network && (
            <span className="network-badge">{wallet.network}</span>
          )}
        </div>

        <div className="navbar-actions">
          {!wallet.address ? (
            <div className="connect-buttons">
              <button
                className="btn btn-primary"
                onClick={() => handleConnect('freighter')}
                disabled={wallet.connecting || wallet.installed === null}
              >
                {wallet.connecting ? (
                  <>
                    <span className="spinner-small"></span>
                    Connecting...
                  </>
                ) : wallet.installed === null ? (
                  <>
                    <span className="spinner-small"></span>
                    Detecting...
                  </>
                ) : (
                  <>
                    <span className="wallet-icon">🔗</span>
                    Connect Wallet
                  </>
                )}
              </button>
              <button
                className="btn btn-secondary btn-small"
                onClick={() => handleConnect('demo')}
                disabled={wallet.connecting}
                title="Test with demo wallet (no Freighter needed)"
              >
                Demo
              </button>
            </div>
          ) : (
            <div className="connected-info">
              <div className="address-display">
                <span className="status-indicator"></span>
                <code className="address-text">
                  {shortenAddress(wallet.address, 6)}
                </code>
                <button
                  className="btn-icon"
                  onClick={() => navigator.clipboard.writeText(wallet.address)}
                  title="Copy address"
                >
                  📋
                </button>
              </div>
              <button
                className="btn btn-secondary btn-small"
                onClick={wallet.disconnect}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {wallet.error && (
        <div className="navbar-error">
          <span className="error-icon">⚠️</span>
          {wallet.error}
        </div>
      )}

      {wallet.installed === false && (
        <div className="navbar-warning">
          <span className="warning-icon">⚠️</span>
          Freighter not detected. 
          <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer">
            Install it here
          </a>
          or use Demo mode.
        </div>
      )}
    </nav>
  );
}

export default Navbar;
