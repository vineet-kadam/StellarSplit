import { useState } from 'react';
import { shortenAddress } from '../utils/stellar';

function AddExpenseForm({ publicKey, selectedGroup, onExpenseAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const handleMemberToggle = (member) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter(m => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === selectedGroup.members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers([...selectedGroup.members]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!selectedGroup) {
      setError('Please select a group first');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (selectedMembers.length === 0) {
      setError('Please select at least one member to split with');
      return;
    }

    if (!selectedGroup.members.includes(publicKey)) {
      setError('You must be a member of this group');
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      // In production, this would call the smart contract
      const newExpense = {
        id: Date.now(),
        groupId: selectedGroup.id,
        description,
        amount: parseFloat(amount),
        paidBy: publicKey,
        splitAmong: selectedMembers,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage
      const groups = JSON.parse(localStorage.getItem('stellar_groups') || '[]');
      const groupIndex = groups.findIndex(g => g.id === selectedGroup.id);
      
      if (groupIndex !== -1) {
        if (!groups[groupIndex].expenses) {
          groups[groupIndex].expenses = [];
        }
        groups[groupIndex].expenses.push(newExpense);
        localStorage.setItem('stellar_groups', JSON.stringify(groups));
        
        setDescription('');
        setAmount('');
        setSelectedMembers([]);
        
        if (onExpenseAdded) {
          onExpenseAdded(groups[groupIndex]);
        }
      }
    } catch (err) {
      console.error('Add expense error:', err);
      setError(err.message || 'Failed to add expense');
    } finally {
      setIsAdding(false);
    }
  };

  if (!publicKey || !selectedGroup) {
    return (
      <div className="form-card">
        <h3>Add Expense</h3>
        <div className="info-message">
          {!publicKey ? 'Please connect your wallet' : 'Please select a group'}
        </div>
      </div>
    );
  }

  const sharePerPerson = amount ? (parseFloat(amount) / Math.max(selectedMembers.length, 1)).toFixed(2) : '0.00';

  return (
    <div className="form-card">
      <h3>Add Expense to {selectedGroup.name}</h3>
      
      <form onSubmit={handleSubmit} className="expense-form">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            placeholder="e.g., Dinner, Gas, Tickets"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isAdding}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (XLM)</label>
          <input
            type="number"
            id="amount"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isAdding}
            required
          />
          {amount && selectedMembers.length > 0 && (
            <p className="form-helper">
              {sharePerPerson} XLM per person ({selectedMembers.length} members)
            </p>
          )}
        </div>

        <div className="form-group">
          <div className="split-header">
            <label>Split Among</label>
            <button
              type="button"
              className="btn-link"
              onClick={handleSelectAll}
            >
              {selectedMembers.length === selectedGroup.members.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="members-select-list">
            {selectedGroup.members.map((member) => (
              <label key={member} className="member-checkbox">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member)}
                  onChange={() => handleMemberToggle(member)}
                  disabled={isAdding}
                />
                <span className="member-info">
                  <span className="member-avatar">👤</span>
                  <code>{shortenAddress(member, 6)}</code>
                  {member === publicKey && <span className="member-tag">You</span>}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            <>
              <span className="icon">💰</span>
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AddExpenseForm;
