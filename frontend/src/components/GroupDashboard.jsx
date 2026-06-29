import { useState, useEffect } from 'react';
import { shortenAddress, formatXLM } from '../utils/stellar';

function GroupDashboard({ publicKey, onGroupSelect, refreshTrigger }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    loadGroups();
  }, [refreshTrigger]);

  const loadGroups = () => {
    const storedGroups = JSON.parse(localStorage.getItem('stellar_groups') || '[]');
    setGroups(storedGroups);
  };

  const handleGroupClick = (group) => {
    setSelectedGroupId(group.id);
    if (onGroupSelect) {
      onGroupSelect(group);
    }
  };

  const calculateGroupStats = (group) => {
    const totalExpenses = group.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const userExpenses = group.expenses?.filter(exp => exp.paidBy === publicKey).length || 0;
    const pendingSettlements = group.settlements?.filter(s => !s.isSettled).length || 0;

    return {
      totalExpenses,
      userExpenses,
      pendingSettlements,
      memberCount: group.members.length,
    };
  };

  if (!publicKey) {
    return (
      <div className="dashboard-card">
        <h2>My Groups</h2>
        <div className="info-message">
          Please connect your wallet to view groups
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h2>My Groups</h2>
        <div className="dashboard-stats">
          <span className="stat-badge">{groups.length} Groups</span>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Groups Yet</h3>
          <p>Create your first group to start splitting expenses</p>
        </div>
      ) : (
        <div className="groups-list">
          {groups.map((group) => {
            const stats = calculateGroupStats(group);
            const isSelected = selectedGroupId === group.id;

            return (
              <div
                key={group.id}
                className={`group-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleGroupClick(group)}
              >
                <div className="group-header">
                  <div className="group-icon">👥</div>
                  <div className="group-info">
                    <h3>{group.name}</h3>
                    <p className="group-creator">
                      Created by {group.creator === publicKey ? 'You' : shortenAddress(group.creator)}
                    </p>
                  </div>
                  {isSelected && <span className="selected-badge">✓</span>}
                </div>

                <div className="group-stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Members</span>
                    <span className="stat-value">{stats.memberCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Expenses</span>
                    <span className="stat-value">{group.expenses?.length || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">{formatXLM(stats.totalExpenses.toString())} XLM</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value">{stats.pendingSettlements}</span>
                  </div>
                </div>

                {group.expenses && group.expenses.length > 0 && (
                  <div className="recent-expenses">
                    <p className="section-label">Recent Expenses</p>
                    {group.expenses.slice(-3).reverse().map((expense) => (
                      <div key={expense.id} className="expense-item">
                        <span className="expense-desc">{expense.description}</span>
                        <span className="expense-amount">{formatXLM(expense.amount.toString())} XLM</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GroupDashboard;
