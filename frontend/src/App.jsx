import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BalanceCard from './components/BalanceCard';
import SendXLMForm from './components/SendXLMForm';
import CreateGroupForm from './components/CreateGroupForm';
import AddMemberForm from './components/AddMemberForm';
import AddExpenseForm from './components/AddExpenseForm';
import GroupDashboard from './components/GroupDashboard';
import SettlementDashboard from './components/SettlementDashboard';
import AnalyticsCards from './components/AnalyticsCards';
import { useWallet } from './hooks/useWallet';

function App() {
  const wallet = useWallet();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('groups'); // 'groups', 'send', 'expenses'

  // Auto-scroll to content when wallet connects or disconnects
  useEffect(() => {
    if (wallet.address) {
      // Wallet connected - scroll to dashboard
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          const balanceSection = document.querySelector('.balance-section');
          if (balanceSection) {
            balanceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 200);
    } else {
      // Wallet disconnected - scroll to top (hero section)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [wallet.address]);

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
      <Navbar />
      {!wallet.address && <Hero />}

      <div className="container">
        {/* Connected Dashboard */}
        {wallet.address && (
          <div className="dashboard-wrapper">
            {/* Balance Section */}
            <div className="balance-section">
              <BalanceCard
                publicKey={wallet.address}
                refreshTrigger={refreshTrigger}
              />
            </div>

            {/* Analytics Cards */}
            <AnalyticsCards publicKey={wallet.address} />

            {/* Navigation Tabs */}
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

            {/* Main Content Area */}
            <>
              {activeTab === 'groups' && (
                <div className="content-grid">
                  <div className="content-left">
                    <GroupDashboard
                      publicKey={wallet.address}
                      onGroupSelect={handleGroupSelect}
                      refreshTrigger={refreshTrigger}
                    />
                  </div>
                  <div className="content-right">
                    <CreateGroupForm
                      publicKey={wallet.address}
                      onGroupCreated={handleGroupCreated}
                    />
                    {selectedGroup && (
                      <SettlementDashboard
                        publicKey={wallet.address}
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
                      publicKey={wallet.address}
                      onGroupSelect={handleGroupSelect}
                      refreshTrigger={refreshTrigger}
                    />
                  </div>
                  <div className="content-right">
                    <AddMemberForm
                      publicKey={wallet.address}
                      selectedGroup={selectedGroup}
                      onMemberAdded={handleMemberAdded}
                    />
                    <AddExpenseForm
                      publicKey={wallet.address}
                      selectedGroup={selectedGroup}
                      onExpenseAdded={handleExpenseAdded}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'send' && (
                <div className="content-centered">
                  <SendXLMForm
                    publicKey={wallet.address}
                    onTransactionComplete={handleTransactionComplete}
                  />
                </div>
              )}
            </>
          </div>
        )}

        {/* Welcome Message for Non-Connected Users */}
        {!wallet.address && (
          <div className="welcome-section">
            <div className="welcome-card">
              <h2>Welcome to StellarSplit</h2>
              <p>
                The modern way to split expenses with friends, roommates, and groups. 
                Powered by blockchain technology for transparent, instant, and secure settlements.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <div>
                    <h4>Create Groups</h4>
                    <p>Organize expenses with friends, roommates, or travel companions. Keep everything in one place.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <div>
                    <h4>Track Expenses</h4>
                    <p>Add shared expenses and automatically split them among group members with smart calculations.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <div>
                    <h4>Instant Settlements</h4>
                    <p>Settle debts directly on the Stellar blockchain with near-instant transactions and minimal fees.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <div>
                    <h4>Secure & Transparent</h4>
                    <p>All transactions are recorded on-chain, providing complete transparency and security for your group.</p>
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
