import React, { useState, useEffect } from 'react';
import { 
  Droplet, Thermometer, Activity, Settings, LayoutDashboard, 
  Fish, Bell, Search, Waves, CalendarClock, AlertTriangle, 
  Info, ArrowUpRight, ArrowDownRight, Wind, TrendingUp, TrendingDown,
  Edit2, Save, X, MoreHorizontal, ChevronLeft, Sun, Moon, DollarSign, MessageSquare, Package
} from 'lucide-react';
import FishEditPage from './components/FishEditPage';
import FishInventoryPage from './components/FishInventoryPage';
import FeedingSchedulePage from './components/FeedingSchedulePage';
import SettingsPage from './components/SettingsPage';
import ActivityLogPage from './components/ActivityLogPage';
import FinancePage from './components/FinancePage';
import CommentsPage from './components/CommentsPage';
import WaterSensorsPage from './components/WaterSensorsPage';
import HarvestPage from './components/HarvestPage';
import PostHarvestPage from './components/PostHarvestPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('aquapond-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aquapond-theme', theme);
  }, [theme]);

  const [currency, setCurrency] = useState(() => localStorage.getItem('aquapond-currency') || '#');

  useEffect(() => {
    localStorage.setItem('aquapond-currency', currency);
  }, [currency]);

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('aquapond-audit-logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('aquapond-audit-logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addLog = (action, entity, details) => {
    const newLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toLocaleString(),
      action,
      entity,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [fishInventory, setFishInventory] = useState([
    { id: 1, species: 'Koi (Kohaku)', quantity: 450, weight: '1.2', health: 'excellent', healthText: 'Excellent', feedType: 'Protein Pellets', feedingTimes: ['08:00', '16:00'] },
    { id: 2, species: 'Tilapia', quantity: 620, weight: '0.8', health: 'good', healthText: 'Good', feedType: 'Mixed Feed', feedingTimes: ['10:00', '14:00'] },
    { id: 3, species: 'Catfish', quantity: 170, weight: '2.5', health: 'fair', healthText: 'Monitor', feedType: 'Sinking Pellets', feedingTimes: ['20:00'] }
  ]);
  const [editingFishId, setEditingFishId] = useState(null);
  const [editFishQty, setEditFishQty] = useState('');
  const [selectedFish, setSelectedFish] = useState(null);

  // Financial Ledger State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('aquapond-transactions');
    if (saved) return JSON.parse(saved);
    
    // Initial seed data
    return [
      { id: 't1', type: 'INCOME', category: 'Sales', amount: 4520.00, description: 'Sold 300kg of Koi harvest to distributors', comment: 'Wire transfer cleared', date: '2026-05-15' },
      { id: 't2', type: 'EXPENSE', category: 'Feed', amount: 650.00, description: 'Purchased grower protein pellets', comment: 'Receipt #29384', date: '2026-05-18' },
      { id: 't3', type: 'EXPENSE', category: 'Medicine', amount: 120.00, description: 'Water bio-treatment chemical dose', comment: 'Emergency algae treatment', date: '2026-05-20' },
      { id: 't4', type: 'INCOME', category: 'Sales', amount: 2120.00, description: 'Sold 150kg of Catfish crop', comment: 'Paid in cash', date: '2026-05-22' },
      { id: 't5', type: 'EXPENSE', category: 'Maintenance', amount: 350.00, description: 'Aerator filter maintenance', comment: 'Monthly preventative service', date: '2026-05-25' },
      { id: 't6', type: 'EXPENSE', category: 'Labor', amount: 320.50, description: 'Assistant technician wage', comment: 'Weekly payroll', date: '2026-05-26' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('aquapond-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Client Comments State (with soft deletion tracking)
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('aquapond-comments');
    if (saved) return JSON.parse(saved);

    // Initial issues
    return [
      {
        id: 'c1',
        subject: 'Pond C pH fluctuation',
        content: 'pH readings hit 8.2 today. The Tilapia stock seems active and healthy, but should we buffer the water chemistry?',
        category: 'Pond Health',
        priority: 'Medium',
        authorName: 'Client John',
        authorRole: 'Client',
        timestamp: '2026-05-24 09:12 AM',
        status: 'Pending',
        deletedByClient: false,
        replies: []
      },
      {
        id: 'c2',
        subject: 'Algae bloom west cage',
        content: 'Heavy blue-green algae bloom starting on the west cage. Need clarification on recommended copper sulfate dosage for this pond size.',
        category: 'Water Quality',
        priority: 'High',
        authorName: 'Client Sarah',
        authorRole: 'Client',
        timestamp: '2026-05-25 14:35 PM',
        status: 'Pending',
        deletedByClient: false,
        replies: []
      },
      {
        id: 'c3',
        subject: 'Request invoice copy',
        content: 'Could I please get a PDF copy of my wholesale fish sales ledger for last month? Need it for tax reporting.',
        category: 'Billing & Finance',
        priority: 'Low',
        authorName: 'Client David',
        authorRole: 'Client',
        timestamp: '2026-05-20 11:20 AM',
        status: 'Resolved',
        deletedByClient: false,
        replies: [
          {
            id: 'r1',
            authorName: 'Admin User',
            authorRole: 'Admin',
            content: 'Invoice uploaded directly to your accounting page. Let us know if you need additional exports.',
            timestamp: '2026-05-20 16:00 PM'
          }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('aquapond-comments', JSON.stringify(comments));
  }, [comments]);

  const handleQuickEdit = (fish) => {
    setEditingFishId(fish.id);
    setEditFishQty(fish.quantity);
  };

  const saveQuickEdit = (id) => {
    const fish = fishInventory.find(f => f.id === id);
    if (fish) addLog('UPDATE', 'Fish Inventory', `Quick edited quantity for ${fish.species} to ${editFishQty}`);
    setFishInventory(fishInventory.map(f => f.id === id ? { ...f, quantity: parseInt(editFishQty) } : f));
    setEditingFishId(null);
  };

  const openDetailedEdit = (fish) => {
    setSelectedFish(fish);
    setActiveTab('fish-edit');
  };

  const handleAddFish = (newFish) => {
    addLog('CREATE', 'Fish Inventory', `Added new fish record: ${newFish.species}`);
    setFishInventory([...fishInventory, newFish]);
  };

  const handleUpdateFish = (updatedFish) => {
    addLog('UPDATE', 'Fish Inventory', `Extensively edited details for ${updatedFish.species}`);
    setFishInventory(fishInventory.map(f => f.id === updatedFish.id ? updatedFish : f));
  };

  const handleDeleteFish = (fishId) => {
    const fishToDelete = fishInventory.find(f => f.id === fishId);
    if (fishToDelete) addLog('DELETE', 'Fish Inventory', `Deleted fish record: ${fishToDelete.species}`);
    setFishInventory(fishInventory.filter(f => f.id !== fishId));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { id: 'fish', label: 'Fish Inventory', icon: <Fish /> },
    { id: 'finance', label: 'Finance & P&L', icon: <DollarSign /> },
    { id: 'water', label: 'Water Sensors', icon: <Waves /> },
    { id: 'harvest', label: 'Harvesting', icon: <Fish /> },
    { id: 'postharvest', label: 'Post-Harvest', icon: <Package /> },
    { id: 'feed', label: 'Feeding Schedule', icon: <CalendarClock /> },
    { id: 'comments', label: 'Client Feedback', icon: <MessageSquare /> },
    { id: 'logs', label: 'Activity Logs', icon: <Activity /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> }
  ];

  const totalFishCount = fishInventory.reduce((sum, f) => sum + f.quantity, 0);
  const statCards = [
    { title: 'Water Temp', value: '24.5', unit: '°C', icon: <Thermometer size={24} />, color: 'blue', trend: 'up', trendVal: '+0.5°' },
    { title: 'Dissolved O2', value: '6.8', unit: 'mg/L', icon: <Wind size={24} />, color: 'cyan', trend: 'neutral', trendVal: 'Stable' },
    { title: 'Fish Count', value: totalFishCount.toLocaleString(), unit: '', icon: <Fish size={24} />, color: 'teal', trend: 'up', trendVal: `+${fishInventory.length}` },
    { title: 'Water Level', value: '85', unit: '%', icon: <Droplet size={24} />, color: 'purple', trend: 'down', trendVal: '-2%' },
  ];

  // Dynamic P&L Dashboard metrics
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const netProfit = totalIncome - totalExpense;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Waves size={24} />
          </div>
          <div className="logo-text">AquaPond</div>
        </div>
        
        <nav className="nav-menu">
          {navItems.map(item => (
            <div 
              key={item.id} 
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="search-bar">
            <Search />
            <input type="text" placeholder="Search sensors, fish types..." />
          </div>
          
          <div className="topbar-actions">
            <button 
              className="action-btn" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="action-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="profile">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=00e0ff&color=fff&bold=true" alt="Profile" className="profile-img" />
              <div className="profile-info">
                <span className="profile-name">Admin User</span>
                <span className="profile-role">Pond Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="dashboard-title">
              <h1>Overview</h1>
              <p>Monitor your pond's health and ecosystem.</p>
            </div>
            <div className="dashboard-date">
              <CalendarClock size={16} />
              <span>Oct 24, 2026 - 14:30 PM</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4">
            {statCards.map((stat, idx) => (
              <div className="card stat-card" key={idx}>
                <div className="stat-header">
                  <span className="stat-title">{stat.title}</span>
                  <div className={`stat-icon ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <div className="stat-value">
                    {stat.value} <span className="stat-unit">{stat.unit}</span>
                  </div>
                  <div className="stat-footer">
                    <span className={`trend ${stat.trend}`}>
                      {stat.trend === 'up' && <ArrowUpRight size={14} />}
                      {stat.trend === 'down' && <ArrowDownRight size={14} />}
                      {stat.trend === 'neutral' && <Activity size={14} />}
                      {stat.trendVal}
                    </span>
                    <span style={{color: 'var(--text-muted)'}}>vs last week</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Overview */}
          <div className="financial-overview-section" style={{ marginTop: '24px', marginBottom: '24px' }}>
            <div className="card financial-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('finance')}>
              <div className="card-header">
                <h3 className="card-title">Financial Overview</h3>
                <span className="card-action">View Report →</span>
              </div>
              <div className="financial-stats-container">
                <div className="fin-stat income">
                  <div className="fin-icon-wrapper"><TrendingUp size={20} /></div>
                  <div className="fin-details">
                    <span className="fin-label">Total Income</span>
                    <h4 className="fin-amount" style={{ color: 'var(--accent-green)' }}>
                      {currency}{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                  </div>
                </div>
                <div className="fin-stat expenses">
                  <div className="fin-icon-wrapper"><TrendingDown size={20} /></div>
                  <div className="fin-details">
                    <span className="fin-label">Total Expenses</span>
                    <h4 className="fin-amount" style={{ color: 'var(--accent-red)' }}>
                      {currency}{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                  </div>
                </div>
                <div className="fin-stat net">
                  <div className="fin-icon-wrapper"><DollarSign size={20} /></div>
                  <div className="fin-details">
                    <span className="fin-label">Net Profit</span>
                    <h4 className="fin-amount" style={{ color: netProfit >= 0 ? 'var(--accent-cyan)' : 'var(--accent-red)' }}>
                      {currency}{netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="main-grid">
            {/* Left Column */}
            <div className="grid grid-cols-1" style={{gap: '24px'}}>
              
              {/* Fish Inventory */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Fish Inventory</h3>
                  <span className="card-action">View All</span>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Species</th>
                        <th>Quantity</th>
                        <th>Avg Weight</th>
                        <th>Health Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fishInventory.map(fish => (
                        <tr key={fish.id}>
                          <td>
                            <div className="fish-cell">
                              <span className="fish-name">{fish.species}</span>
                            </div>
                          </td>
                          <td>
                            {editingFishId === fish.id ? (
                              <input 
                                type="number" 
                                className="quick-edit-input"
                                value={editFishQty}
                                onChange={(e) => setEditFishQty(e.target.value)}
                                style={{ width: '70px', padding: '4px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'white', border: '1px solid var(--accent-cyan)' }}
                              />
                            ) : (
                              fish.quantity
                            )}
                          </td>
                          <td>{fish.weight} kg</td>
                          <td>
                            <div className="health-status">
                              <span className={`health-dot ${fish.health}`}></span>
                              {fish.healthText}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                              {editingFishId === fish.id ? (
                                <>
                                  <button onClick={() => saveQuickEdit(fish.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer' }}><Save size={16} /></button>
                                  <button onClick={() => setEditingFishId(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}><X size={16} /></button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleQuickEdit(fish)} title="Quick Edit Quantity" style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                  <button onClick={() => openDetailedEdit(fish)} title="Extensive Edit" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="grid grid-cols-1" style={{gap: '24px'}}>
              
              {/* pH Level */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">pH Level</h3>
                  <span className="card-action">History</span>
                </div>
                <div className="water-quality">
                  <div className="ph-indicator">
                    <div className="ph-value-container">
                      <div className="ph-label">Current</div>
                      <div className="ph-value">7.2</div>
                      <div className="ph-status">Optimal</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed Schedule */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Today's Feeding Schedule</h3>
                  <span className="card-action">Manage</span>
                </div>
                <div className="feed-schedule">
                  {fishInventory
                    .flatMap(fish => (fish.feedingTimes || []).map(time => ({ ...fish, time })))
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((fish, idx) => (
                      <div className="feed-item" key={`${fish.id}-${idx}`}>
                        <div className="feed-info">
                          <div className="feed-time">{fish.time}</div>
                          <div className="feed-details">
                            <h4>{fish.feedType || 'Standard Feed'} ({fish.species})</h4>
                            <p>{fish.quantity.toLocaleString()} fish • {fish.weight}kg avg</p>
                          </div>
                        </div>
                        <span className="status-badge upcoming">Scheduled</span>
                      </div>
                    ))}
                  {fishInventory.flatMap(fish => fish.feedingTimes || []).length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No feeding schedule set. Add feeding times in Fish Inventory.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
        )}

        {activeTab === 'fish' && (
          <FishInventoryPage 
            inventory={fishInventory}
            onAddFish={handleAddFish}
            onEditFish={(fish) => {
              setSelectedFish(fish);
              setActiveTab('fish-edit');
            }}
            onDeleteFish={handleDeleteFish}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'fish-edit' && (
          <FishEditPage 
            fish={selectedFish} 
            onBack={() => setActiveTab('fish')} 
            onSave={(data) => {
              setFishInventory(fishInventory.map(f => f.id === data.id ? { ...f, ...data } : f));
              setActiveTab('fish');
            }}
          />
        )}
        {activeTab === 'feed' && (
          <FeedingSchedulePage 
            inventory={fishInventory}
            onUpdateFish={(updatedFish) => {
              const oldFish = fishInventory.find(f => f.id === updatedFish.id);
              if (oldFish) {
                 if ((oldFish.feedingTimes?.length || 0) < (updatedFish.feedingTimes?.length || 0)) {
                   addLog('UPDATE', 'Feeding Schedule', `Added feeding time for ${updatedFish.species}`);
                 } else if ((oldFish.feedingTimes?.length || 0) > (updatedFish.feedingTimes?.length || 0)) {
                   addLog('UPDATE', 'Feeding Schedule', `Removed feeding time for ${updatedFish.species}`);
                 }
              }
              setFishInventory(fishInventory.map(f => f.id === updatedFish.id ? updatedFish : f));
            }}
          />
        )}

        {activeTab === 'finance' && (
          <FinancePage 
            inventory={fishInventory}
            transactions={transactions}
            currency={currency}
            onAddTransaction={(t) => {
              addLog('CREATE', 'Financials', `Recorded ${t.type} of ${currency}${t.amount} under ${t.category}`);
              setTransactions(prev => [t, ...prev]);
            }}
            onUpdateTransaction={(updated) => {
              addLog('UPDATE', 'Financials', `Updated transaction details for category ${updated.category}`);
              setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
            }}
            onDeleteTransaction={(id) => {
              const target = transactions.find(t => t.id === id);
              if (target) addLog('DELETE', 'Financials', `Deleted transaction of ${currency}${target.amount} (${target.category})`);
              setTransactions(prev => prev.filter(t => t.id !== id));
            }}
          />
        )}

        {activeTab === 'water' && (
          <WaterSensorsPage inventory={fishInventory} />
        )}

        {activeTab === 'harvest' && (
          <HarvestPage />
        )}

        {activeTab === 'postharvest' && (
          <PostHarvestPage currency={currency} />
        )}

        {activeTab === 'comments' && (
          <CommentsPage 
            comments={comments}
            onAddComment={(newComment) => {
              addLog('CREATE', 'Comments', `Client submitted feedback topic: "${newComment.subject}"`);
              setComments(prev => [newComment, ...prev]);
            }}
            onDeleteComment={(id) => {
              const target = comments.find(c => c.id === id);
              if (target) {
                addLog('DELETE', 'Comments', `Client deleted feedback topic: "${target.subject}"`);
                setComments(prev => prev.map(c => c.id === id ? { ...c, deletedByClient: true } : c));
              }
            }}
            onAddReply={(commentId, reply) => {
              const target = comments.find(c => c.id === commentId);
              if (target) addLog('CREATE', 'Comments', `Admin published response to issue: "${target.subject}"`);
              setComments(prev => prev.map(c => {
                if (c.id === commentId) {
                  return {
                    ...c,
                    status: 'Replied',
                    replies: [...c.replies, reply]
                  };
                }
                return c;
              }));
            }}
            onResolveComment={(id, newStatus) => {
              const target = comments.find(c => c.id === id);
              if (target) addLog('UPDATE', 'Comments', `Marked issue "${target.subject}" as ${newStatus}`);
              setComments(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
            }}
          />
        )}

        {activeTab === 'logs' && (
          <ActivityLogPage logs={auditLogs} />
        )}

        {activeTab === 'settings' && (
          <SettingsPage 
            theme={theme}
            onThemeChange={setTheme}
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        )}
      </main>
    </div>
  );
}

export default App;
