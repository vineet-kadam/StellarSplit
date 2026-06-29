import { useState, useEffect } from 'react';
import { formatXLM } from '../utils/stellar';

function AnalyticsCards({ publicKey }) {
  const [analytics, setAnalytics] = useState({
    totalGroups: 0,
    totalExpenses: 0,
    totalAmount: 0,
    pendingSettlements: 0,
  });

  useEffect(() => {
    if (publicKey) {
      calculateAnalytics();
    }
  }, [publicKey]);

  const calculateAnalytics = () => {
    const groups = JSON.parse(localStorage.getItem('stellar_groups') || '[]');
    
    let totalExpenses = 0;
    let totalAmount = 0;
    let pendingSettlements = 0;

    groups.forEach(group => {
      if (group.expenses) {
        totalExpenses += group.expenses.length;
        totalAmount += group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      }
      
      if (group.settlements) {
        pendingSettlements += group.settlements.filter(s => !s.isSettled).length;
      }
    });

    setAnalytics({
      totalGroups: groups.length,
      totalExpenses,
      totalAmount,
      pendingSettlements,
    });
  };

  if (!publicKey) {
    return null;
  }

  return (
    <div className="analytics-container">
      <div className="analytics-card">
        <div className="analytics-icon">👥</div>
        <div className="analytics-content">
          <h3>{analytics.totalGroups}</h3>
          <p>Total Groups</p>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-icon">💰</div>
        <div className="analytics-content">
          <h3>{analytics.totalExpenses}</h3>
          <p>Total Expenses</p>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-icon">📊</div>
        <div className="analytics-content">
          <h3>{formatXLM(analytics.totalAmount.toString())} XLM</h3>
          <p>Total Amount</p>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-icon">⏳</div>
        <div className="analytics-content">
          <h3>{analytics.pendingSettlements}</h3>
          <p>Pending Settlements</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCards;
