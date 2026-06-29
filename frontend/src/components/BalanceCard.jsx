import { useState, useEffect } from 'react';
import { getAccountBalance, formatXLM } from '../utils/stellar';

function BalanceCard({ publicKey, refreshTrigger }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey, refreshTrigger]);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const bal = await getAccountBalance(publicKey);
      setBalance(bal);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return null;
  }

  return (
    <div className="balance-card">
      <div className="balance-header">
        <h3>XLM Balance</h3>
        <button
          className="btn-icon"
          onClick={fetchBalance}
          disabled={loading}
          title="Refresh balance"
        >
          {loading ? '⟳' : '🔄'}
        </button>
      </div>

      {error ? (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          {error.includes('not found') && (
            <a
              href="https://laboratory.stellar.org/#account-creator?network=test"
              target="_blank"
              rel="noopener noreferrer"
              className="fund-link"
            >
              Fund Account
            </a>
          )}
        </div>
      ) : (
        <div className="balance-display">
          {loading ? (
            <div className="loading-skeleton">
              <span className="spinner"></span>
              Loading...
            </div>
          ) : (
            <>
              <div className="balance-amount">
                <span className="balance-value">{balance ? formatXLM(balance) : '0'}</span>
                <span className="balance-currency">XLM</span>
              </div>
              <p className="balance-subtitle">Stellar Lumens</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BalanceCard;
