import React from 'react';
import { Sun, Moon, Monitor, Settings } from 'lucide-react';

const SettingsPage = ({ theme, onThemeChange }) => {
  return (
    <div className="dashboard-content settings-page">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>App Settings</h1>
          <p>Configure your AquaPond application preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1" style={{ gap: '24px', maxWidth: '800px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Monitor size={20} style={{ color: 'var(--accent-cyan)' }} /> Appearance
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Choose between light and dark mode to customize the app's look and feel.
            </p>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => onThemeChange('dark')}
                style={{ 
                  flex: 1, 
                  padding: '24px', 
                  borderRadius: '12px', 
                  border: `2px solid ${theme === 'dark' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  background: 'var(--bg-base)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: '50%' }}>
                  <Moon size={32} style={{ color: 'var(--accent-purple)' }} />
                </div>
                <span style={{ fontWeight: '600' }}>Dark Mode</span>
              </button>

              <button 
                onClick={() => onThemeChange('light')}
                style={{ 
                  flex: 1, 
                  padding: '24px', 
                  borderRadius: '12px', 
                  border: `2px solid ${theme === 'light' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  background: '#f8fafc',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ padding: '16px', background: '#ffffff', borderRadius: '50%', border: '1px solid #e2e8f0' }}>
                  <Sun size={32} style={{ color: 'var(--accent-orange)' }} />
                </div>
                <span style={{ fontWeight: '600' }}>Light Mode</span>
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} style={{ color: 'var(--text-muted)' }} /> General Settings
            </h3>
          </div>
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            More settings coming soon!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
