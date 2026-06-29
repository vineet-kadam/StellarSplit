import { useState } from 'react';
import { isValidAddress, shortenAddress } from '../utils/stellar';

function AddMemberForm({ publicKey, selectedGroup, onMemberAdded }) {
  const [memberAddress, setMemberAddress] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

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

    if (!isValidAddress(memberAddress)) {
      setError('Invalid Stellar address');
      return;
    }

    if (selectedGroup.members.includes(memberAddress)) {
      setError('Member already exists in this group');
      return;
    }

    if (selectedGroup.creator !== publicKey) {
      setError('Only the group creator can add members');
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      // In production, this would call the smart contract
      // For now, update localStorage
      const groups = JSON.parse(localStorage.getItem('stellar_groups') || '[]');
      const groupIndex = groups.findIndex(g => g.id === selectedGroup.id);
      
      if (groupIndex !== -1) {
        groups[groupIndex].members.push(memberAddress);
        localStorage.setItem('stellar_groups', JSON.stringify(groups));
        
        setMemberAddress('');
        
        if (onMemberAdded) {
          onMemberAdded(groups[groupIndex]);
        }
      }
    } catch (err) {
      console.error('Add member error:', err);
      setError(err.message || 'Failed to add member');
    } finally {
      setIsAdding(false);
    }
  };

  if (!publicKey || !selectedGroup) {
    return (
      <div className="form-card">
        <h3>Add Member</h3>
        <div className="info-message">
          {!publicKey ? 'Please connect your wallet' : 'Please select a group'}
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h3>Add Member to {selectedGroup.name}</h3>
      
      <form onSubmit={handleSubmit} className="member-form">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="current-members">
          <label>Current Members ({selectedGroup.members.length})</label>
          <div className="members-list">
            {selectedGroup.members.map((member, index) => (
              <div key={index} className="member-item">
                <span className="member-avatar">👤</span>
                <code className="member-address">{shortenAddress(member, 6)}</code>
                {member === selectedGroup.creator && (
                  <span className="member-badge">Creator</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="memberAddress">New Member Address</label>
          <input
            type="text"
            id="memberAddress"
            placeholder="G..."
            value={memberAddress}
            onChange={(e) => setMemberAddress(e.target.value)}
            disabled={isAdding}
            required
          />
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
              <span className="icon">👥</span>
              Add Member
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AddMemberForm;
