import React, { useState } from 'react';
import { 
  Droplet, Thermometer, Activity, Settings, LayoutDashboard, 
  Fish, Bell, Search, Waves, CalendarClock, AlertTriangle, 
  Info, ArrowUpRight, ArrowDownRight, Wind, TrendingUp, TrendingDown,
  Edit2, Save, X, MoreHorizontal, ChevronLeft
} from 'lucide-react';
import FishEditPage from './components/FishEditPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fishInventory, setFishInventory] = useState([
    { id: 1, species: 'Koi (Kohaku)', quantity: 450, weight: '1.2', health: 'excellent', healthText: 'Excellent' },
    { id: 2, species: 'Tilapia', quantity: 620, weight: '0.8', health: 'good', healthText: 'Good' },
    { id: 3, species: 'Catfish', quantity: 170, weight: '2.5', health: 'fair', healthText: 'Monitor' }
  ]);
  const [editingFishId, setEditingFishId] = useState(null);
  const [editFishQty, setEditFishQty] = useState('');
  const [selectedFish, setSelectedFish] = useState(null);

  const handleQuickEdit = (fish) => {
    setEditingFishId(fish.id);
    setEditFishQty(fish.quantity);
  };

  const saveQuickEdit = (id) => {
    setFishInventory(fishInventory.map(f => f.id === id ? { ...f, quantity: parseInt(editFishQty) } : f));
    setEditingFishId(null);
  };

  const openDetailedEdit = (fish) => {
    setSelectedFish(fish);
    setActiveTab('fish-edit');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { id: 'fish', label: 'Fish Inventory', icon: <Fish /> },
    { id: 'water', label: 'Water Sensors', icon: <Waves /> },
    { id: 'feed', label: 'Feeding Schedule', icon: <CalendarClock /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> }
  ];

  const statCards = [
    { title: 'Water Temp', value: '24.5', unit: '°C', icon: <Thermometer size={24} />, color: 'blue', trend: 'up', trendVal: '+0.5°' },
    { title: 'Dissolved O2', value: '6.8', unit: 'mg/L', icon: <Wind size={24} />, color: 'cyan', trend: 'neutral', trendVal: 'Stable' },
    { title: 'Fish Count', value: '1,240', unit: '', icon: <Fish size={24} />, color: 'teal', trend: 'up', trendVal: '+12' },
    { title: 'Water Level', value: '85', unit: '%', icon: <Droplet size={24} />, color: 'purple', trend: 'down', trendVal: '-2%' },
  ];

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
            <div className="card financial-card">
              <div className="card-header">
                <h3 className="card-title">Financial Overview</h3>
                <span className="card-action">View Report</span>
              </div>
              <div className="financial-stats-container">
                <div className="fin-stat income">
                  <div className="fin-icon-wrapper"><TrendingUp size={20} /></div>
                  <div className="fin-details">
                    <span className="fin-label">Total Income</span>
                    <h4 className="fin-amount">$4,520.00</h4>
                  </div>
                </div>
                <div className="fin-stat expenses">
                  <div className="fin-icon-wrapper"><TrendingDown size={20} /></div>
                  <div className="fin-details">
                    <span className="fin-label">Total Expenses</span>
                    <h4 className="fin-amount">$1,240.50</h4>
                  </div>
                </div>
                <div className="fin-stat net">
                  <div className="fin-icon-wrapper"><Activity size={20} /></div>
                  <div className="fin-details">
                    <span className="fin-label">Net Profit</span>
                    <h4 className="fin-amount">$3,279.50</h4>
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
                  <h3 className="card-title">Today's Feeding</h3>
                  <span className="card-action">Manage</span>
                </div>
                <div className="feed-schedule">
                  <div className="feed-item">
                    <div className="feed-info">
                      <div className="feed-time">08:00</div>
                      <div className="feed-details">
                        <h4>Morning Feed (Protein)</h4>
                        <p>Zone A & B • 2.5kg</p>
                      </div>
                    </div>
                    <span className="status-badge completed">Done</span>
                  </div>
                  <div className="feed-item">
                    <div className="feed-info">
                      <div className="feed-time">14:00</div>
                      <div className="feed-details">
                        <h4>Afternoon Feed (Mix)</h4>
                        <p>All Zones • 3.0kg</p>
                      </div>
                    </div>
                    <span className="status-badge completed">Done</span>
                  </div>
                  <div className="feed-item">
                    <div className="feed-info">
                      <div className="feed-time">20:00</div>
                      <div className="feed-details">
                        <h4>Evening Feed (Light)</h4>
                        <p>Zone A • 1.5kg</p>
                      </div>
                    </div>
                    <span className="status-badge upcoming">Upcoming</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
        )}

        {activeTab === 'fish-edit' && (
          <FishEditPage 
            fish={selectedFish} 
            onBack={() => setActiveTab('dashboard')} 
            onSave={(data) => {
              setFishInventory(fishInventory.map(f => f.id === data.id ? { ...f, ...data } : f));
              setActiveTab('dashboard');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
