import { useState, useEffect } from 'react';
import { shortenAddress, formatXLM, sendPayment } from '../utils/stellar';
import { signTransactionWithFreighter, getWalletErrorMessage } from '../utils/wallet';

function SettlementDashboard({ publicKey, selectedGroup, onSettlementComplete }) {
  const [settlements, setSettlements] = useState([]);
  const [balances, setBalances] = useState({});
  const [settlingId, setSettlingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedGroup) {
      calculateSettlements();
    }
  }, [selectedGroup]);

  const calculateSettlements = () => {
    if (!selectedGroup || !selectedGroup.expenses) {
      setSettlements([]);
      setBalances({});
      return;
    }

    // Calculate balances for each member
    const memberBalances = {};
    selectedGroup.members.forEach(member => {
      memberBalances[member] = 0;
    });

    // Process each expense
    selectedGroup.expenses.forEach(expense => {
      const splitCount = expense.splitAmong.length;
      const sharePerPerson = expense.amount / splitCount;

      // Payer gets credited
      memberBalances[expense.paidBy] += expense.amount;

      // Split members get debited
      expense.splitAmong.forEach(member => {
        memberBalances[member] -= sharePerPerson;
      });
    });

    // Calculate settlements (simplified algorithm)
    const creditors = [];
    const debtors = [];

    Object.entries(memberBalances).forEach(([member, balance]) => {
      if (balance > 0.01) {
        creditors.push({ address: member, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ address: member, amount: Math.abs(balance) });
      }
    });

    // Create settlements
    const newSettlements = [];
    let settlementId = 1;

    creditors.forEach(creditor => {
      let remaining = creditor.amount;

      debtors.forEach(debtor => {
        if (remaining > 0.01 && debtor.amount > 0.01) {
          const amount = Math.min(remaining, debtor.amount);
          
          newSettlements.push({
            id: settlementId++,
            groupId: selectedGroup.id,
            from: debtor.address,
            to: creditor.address,
            amount: parseFloat(amount.toFixed(7)),
            isSettled: false,
          });

          remaining -= amount;
          debtor.amount -= amount;
        }
      });
    });

    setBalances(memberBalances);
    setSettlements(newSettlements);
  };

  const handleSettle = async (settlement) => {
    if (!publicKey) {
      setError('Please connect your wallet');
      return;
    }

    if (settlement.from !== publicKey) {
      setError('You can only settle your own debts');
      return;
    }

    setSettlingId(settlement.id);
    setError(null);

    try {
      const result = await sendPayment(
        publicKey,
        settlement.to,
        settlement.amount.toString(),
        signTransactionWithFreighter
      );

      // Mark settlement as settled
      const updatedSettlements = settlements.map(s =>
        s.id === settlement.id
          ? { ...s, isSettled: true, txHash: result.hash }
          : s
      );
      setSettlements(updatedSettlements);

      // Update group in localStorage
      const groups = JSON.parse(localStorage.getItem('stellar_groups') || '[]');
      const groupIndex = groups.findIndex(g => g.id === selectedGroup.id);
      
      if (groupIndex !== -1) {
        if (!groups[groupIndex].settlements) {
          groups[groupIndex].settlements = [];
        }
        groups[groupIndex].settlements.push({
          ...settlement,
          isSettled: true,
          txHash: result.hash,
          settledAt: new Date().toISOString(),
        });
        localStorage.setItem('stellar_groups', JSON.stringify(groups));
      }

      if (onSettlementComplete) {
        onSettlementComplete(result);
      }
    } catch (err) {
      console.error('Settlement error:', err);
      setError(getWalletErrorMessage(err));
    } finally {
      setSettlingId(null);
    }
  };

  if (!publicKey || !selectedGroup) {
    return (
      <div className="dashboard-card">
        <h2>Settlements</h2>
        <div className="info-message">
          {!publicKey ? 'Please connect your wallet' : 'Please select a group'}
        </div>
      </div>
    );
  }

  const pendingSettlements = settlements.filter(s => !s.isSettled);
  const completedSettlements = settlements.filter(s => s.isSettled);
  const userBalance = balances[publicKey] || 0;

  return (
    <div className="dashboard-card">
      <h2>Settlements for {selectedGroup.name}</h2>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="balance-summary">
        <div className="summary-card">
          <label>Your Balance</label>
          <div className={`balance-value ${userBalance >= 0 ? 'positive' : 'negative'}`}>
            {userBalance >= 0 ? '+' : ''}{formatXLM(userBalance.toString())} XLM
          </div>
          <p className="balance-description">
            {userBalance > 0.01
              ? 'You are owed money'
              : userBalance < -0.01
              ? 'You owe money'
              : 'You are settled up'}
          </p>
        </div>
      </div>

      {pendingSettlements.length === 0 && completedSettlements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <h3>All Settled Up!</h3>
          <p>No pending settlements in this group</p>
        </div>
      ) : (
        <>
          {pendingSettlements.length > 0 && (
            <div className="settlements-section">
              <h3>Pending Settlements ({pendingSettlements.length})</h3>
              <div className="settlements-list">
                {pendingSettlements.map((settlement) => (
                  <div key={settlement.id} className="settlement-card">
                    <div className="settlement-info">
                      <div className="settlement-parties">
                        <code className={settlement.from === publicKey ? 'highlight' : ''}>
                          {settlement.from === publicKey ? 'You' : shortenAddress(settlement.from)}
                        </code>
                        <span className="settlement-arrow">→</span>
                        <code className={settlement.to === publicKey ? 'highlight' : ''}>
                          {settlement.to === publicKey ? 'You' : shortenAddress(settlement.to)}
                        </code>
                      </div>
                      <div className="settlement-amount">
                        {formatXLM(settlement.amount.toString())} XLM
                      </div>
                    </div>

                    {settlement.from === publicKey && (
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => handleSettle(settlement)}
                        disabled={settlingId === settlement.id}
                      >
                        {settlingId === settlement.id ? (
                          <>
                            <span className="spinner"></span>
                            Settling...
                          </>
                        ) : (
                          'Settle Now'
                        )}
                      </button>
                    )}

                    {settlement.to === publicKey && (
                      <span className="settlement-status waiting">Waiting for payment</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedSettlements.length > 0 && (
            <div className="settlements-section">
              <h3>Completed Settlements ({completedSettlements.length})</h3>
              <div className="settlements-list">
                {completedSettlements.map((settlement) => (
                  <div key={settlement.id} className="settlement-card completed">
                    <div className="settlement-info">
                      <div className="settlement-parties">
                        <code>{settlement.from === publicKey ? 'You' : shortenAddress(settlement.from)}</code>
                        <span className="settlement-arrow">→</span>
                        <code>{settlement.to === publicKey ? 'You' : shortenAddress(settlement.to)}</code>
                      </div>
                      <div className="settlement-amount">
                        {formatXLM(settlement.amount.toString())} XLM
                      </div>
                    </div>

                    <div className="settlement-status-group">
                      <span className="settlement-status settled">✓ Settled</span>
                      {settlement.txHash && (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${settlement.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tx-link"
                        >
                          View TX
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SettlementDashboard;
