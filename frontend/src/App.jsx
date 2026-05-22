import React, { useState } from 'react';
import { 
  Droplet, Thermometer, Activity, Settings, LayoutDashboard, 
  Fish, Bell, Search, Waves, CalendarClock, AlertTriangle, 
  Info, ArrowUpRight, ArrowDownRight, Wind
} from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="fish-cell">
                            <span className="fish-name">Koi (Kohaku)</span>
                          </div>
                        </td>
                        <td>450</td>
                        <td>1.2 kg</td>
                        <td>
                          <div className="health-status">
                            <span className="health-dot excellent"></span>
                            Excellent
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="fish-cell">
                            <span className="fish-name">Tilapia</span>
                          </div>
                        </td>
                        <td>620</td>
                        <td>0.8 kg</td>
                        <td>
                          <div className="health-status">
                            <span className="health-dot good"></span>
                            Good
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="fish-cell">
                            <span className="fish-name">Catfish</span>
                          </div>
                        </td>
                        <td>170</td>
                        <td>2.5 kg</td>
                        <td>
                          <div className="health-status">
                            <span className="health-dot fair"></span>
                            Monitor
                          </div>
                        </td>
                      </tr>
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
      </main>
    </div>
  );
}

export default App;
