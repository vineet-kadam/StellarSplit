import { useState } from 'react';

function CreateGroupForm({ publicKey, onGroupCreated }) {
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // In production, this would call the smart contract
      // For now, simulate group creation
      const newGroup = {
        id: Date.now(),
        name: groupName,
        creator: publicKey,
        members: [publicKey],
        expenses: [],
        settlements: [],
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for demo
      const groups = JSON.parse(localStorage.getItem('stellar_groups') || '[]');
      groups.push(newGroup);
      localStorage.setItem('stellar_groups', JSON.stringify(groups));

      setGroupName('');
      
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }
    } catch (err) {
      console.error('Create group error:', err);
      setError(err.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="form-card">
        <h3>Create Group</h3>
        <div className="info-message">
          Please connect your wallet to create a group
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h3>Create New Group</h3>
      
      <form onSubmit={handleSubmit} className="group-form">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="groupName">Group Name</label>
          <input
            type="text"
            id="groupName"
            placeholder="e.g., Weekend Trip, Office Lunch"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={isCreating}
            maxLength={50}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <span className="spinner"></span>
              Creating...
            </>
          ) : (
            <>
              <span className="icon">➕</span>
              Create Group
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateGroupForm;
