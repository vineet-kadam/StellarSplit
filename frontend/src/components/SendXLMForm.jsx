import { useState } from 'react';
import { sendPayment, isValidAddress } from '../utils/stellar';
import { signTransactionWithFreighter, getWalletErrorMessage } from '../utils/wallet';

function SendXLMForm({ publicKey, onTransactionComplete }) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [status, setStatus] = useState(null); // 'pending', 'success', 'failure'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isValidAddress(destination)) {
      setError('Invalid destination address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSending(true);
    setError(null);
    setTxHash(null);
    setStatus('pending');

    try {
      const result = await sendPayment(
        publicKey,
        destination,
        amount,
        signTransactionWithFreighter
      );

      setStatus('success');
      setTxHash(result.hash);
      setDestination('');
      setAmount('');
      setMemo('');
      
      // Notify parent component to refresh balance
      if (onTransactionComplete) {
        onTransactionComplete(result);
      }
    } catch (err) {
      console.error('Send error:', err);
      setStatus('failure');
      setError(getWalletErrorMessage(err));
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setStatus(null);
    setTxHash(null);
    setError(null);
  };

  if (!publicKey) {
    return (
      <div className="send-form-card">
        <h3>Send XLM</h3>
        <div className="info-message">
          Please connect your wallet to send XLM
        </div>
      </div>
    );
  }

  return (
    <div className="send-form-card">
      <h3>Send XLM</h3>

      {status === 'success' && txHash ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Transaction Successful!</h4>
          <div className="tx-hash-display">
            <label>Transaction Hash:</label>
            <code className="tx-hash">{txHash}</code>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="explorer-link"
            >
              View on Explorer →
            </a>
          </div>
          <button className="btn btn-primary" onClick={resetForm}>
            Send Another Transaction
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="send-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {status === 'pending' && (
            <div className="pending-message">
              <span className="spinner"></span>
              Transaction pending...
            </div>
          )}

          <div className="form-group">
            <label htmlFor="destination">Destination Address</label>
            <input
              type="text"
              id="destination"
              placeholder="G..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={isSending}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (XLM)</label>
            <input
              type="number"
              id="amount"
              placeholder="0.00"
              step="0.0000001"
              min="0.0000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSending}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="memo">Memo (Optional)</label>
            <input
              type="text"
              id="memo"
              placeholder="Payment description"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={isSending}
              maxLength={28}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              'Send XLM'
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default SendXLMForm;
