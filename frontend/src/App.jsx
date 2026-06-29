import { useState } from 'react';
import './App.css';
import Hero from './components/Hero';
import WalletCard from './components/WalletCard';
import BalanceCard from './components/BalanceCard';
import SendXLMForm from './components/SendXLMForm';
import CreateGroupForm from './components/CreateGroupForm';
import AddMemberForm from './components/AddMemberForm';
import AddExpenseForm from './components/AddExpenseForm';
import GroupDashboard from './components/GroupDashboard';
import SettlementDashboard from './components/SettlementDashboard';
import AnalyticsCards from './components/AnalyticsCards';

function App() {
  const [publicKey, setPublicKey] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('groups'); // 'groups', 'send', 'expenses'

  const handleWalletConnect = (key) => {
    setPublicKey(key);
  };

  const handleWalletDisconnect = () => {
    setPublicKey(null);
    setSelectedGroup(null);
  };

  const handleTransactionComplete = () => {
    // Trigger balance refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleGroupCreated = (group) => {
    setRefreshTrigger(prev => prev + 1);
    setSelectedGroup(group);
    setActiveTab('expenses');
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  const handleMemberAdded = (updatedGroup) => {
    setSelectedGroup(updatedGroup);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleExpenseAdded = (updatedGroup) => {
    setSelectedGroup(updatedGroup);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <Hero />

      <div className="container">
        {/* Wallet and Balance Section */}
        <div className="top-section">
          <WalletCard
            onWalletConnect={handleWalletConnect}
            onWalletDisconnect={handleWalletDisconnect}
          />
          {publicKey && (
            <BalanceCard
              publicKey={publicKey}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>

        {/* Analytics Cards */}
        {publicKey && (
          <AnalyticsCards publicKey={publicKey} />
        )}

        {/* Navigation Tabs */}
        {publicKey && (
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              📊 Groups & Settlements
            </button>
            <button
              className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
              onClick={() => setActiveTab('expenses')}
            >
              💰 Manage Expenses
            </button>
            <button
              className={`tab ${activeTab === 'send' ? 'active' : ''}`}
              onClick={() => setActiveTab('send')}
            >
              💸 Send XLM
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {publicKey && (
          <>
            {activeTab === 'groups' && (
              <div className="content-grid">
                <div className="content-left">
                  <GroupDashboard
                    publicKey={publicKey}
                    onGroupSelect={handleGroupSelect}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
                <div className="content-right">
                  <CreateGroupForm
                    publicKey={publicKey}
                    onGroupCreated={handleGroupCreated}
                  />
                  {selectedGroup && (
                    <SettlementDashboard
                      publicKey={publicKey}
                      selectedGroup={selectedGroup}
                      onSettlementComplete={handleTransactionComplete}
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="content-grid">
                <div className="content-left">
                  <GroupDashboard
                    publicKey={publicKey}
                    onGroupSelect={handleGroupSelect}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
                <div className="content-right">
                  <AddMemberForm
                    publicKey={publicKey}
                    selectedGroup={selectedGroup}
                    onMemberAdded={handleMemberAdded}
                  />
                  <AddExpenseForm
                    publicKey={publicKey}
                    selectedGroup={selectedGroup}
                    onExpenseAdded={handleExpenseAdded}
                  />
                </div>
              </div>
            )}

            {activeTab === 'send' && (
              <div className="content-centered">
                <SendXLMForm
                  publicKey={publicKey}
                  onTransactionComplete={handleTransactionComplete}
                />
              </div>
            )}
          </>
        )}

        {/* Welcome Message for Non-Connected Users */}
        {!publicKey && (
          <div className="welcome-section">
            <div className="welcome-card">
              <h2>Welcome to StellarSplit! 🚀</h2>
              <p>
                StellarSplit is a decentralized expense splitting application built on the Stellar blockchain.
                Connect your wallet to get started.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <div>
                    <h4>Create Groups</h4>
                    <p>Organize expenses with friends, family, or colleagues</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <div>
                    <h4>Track Expenses</h4>
                    <p>Record shared expenses and split them automatically</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <div>
                    <h4>Settle on Stellar</h4>
                    <p>Pay back your friends directly with XLM on Stellar</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <div>
                    <h4>Low Fees</h4>
                    <p>Enjoy near-instant transactions with minimal fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Built on Stellar Testnet • 
          <a href="https://stellar.org" target="_blank" rel="noopener noreferrer"> Learn More</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
