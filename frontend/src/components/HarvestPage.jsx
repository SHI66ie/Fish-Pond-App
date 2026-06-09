import React, { useState } from 'react';
import { Scissors, Scale, Calendar, CheckSquare, List } from 'lucide-react';

export default function HarvestPage({ ponds = [], fishInventory = [] }) {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <div className="dashboard-content" style={{ paddingBottom: '40px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div className="dashboard-title">
          <h1>Harvest Management</h1>
          <p>Plan upcoming harvests and record actual yields.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="action-btn" onClick={() => setActiveTab('planning')} style={{ background: activeTab === 'planning' ? 'var(--accent-cyan)' : 'var(--bg-surface)', color: activeTab === 'planning' ? 'black' : 'white', border: '1px solid var(--border-color)', fontWeight: '600' }}>
            <Calendar size={16} /> Planning
          </button>
          <button className="action-btn" onClick={() => setActiveTab('log')} style={{ background: activeTab === 'log' ? 'var(--accent-cyan)' : 'var(--bg-surface)', color: activeTab === 'log' ? 'black' : 'white', border: '1px solid var(--border-color)', fontWeight: '600' }}>
            <CheckSquare size={16} /> Log Harvest
          </button>
        </div>
      </div>

      {activeTab === 'planning' && (
        <div className="card">
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <h3 className="card-title">Ponds Ready for Harvest</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* Mock Card */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'white' }}>Pond A (Tilapia)</h4>
                  <span style={{ fontSize: '12px', color: 'var(--accent-green)' }}>Target Weight Reached</span>
                </div>
                <Scissors size={20} color="var(--accent-cyan)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Current Stock:</span> <span style={{ color: 'white' }}>1,200 pcs</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Est. Avg Weight:</span> <span style={{ color: 'white' }}>0.8 kg</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>Expected Yield:</span> <span style={{ color: 'var(--accent-cyan)' }}>~960 kg</span></div>
              </div>
              <button style={{ width: '100%', padding: '8px', background: 'var(--accent-cyan)', color: 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Schedule Harvest
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'log' && (
        <div className="card" style={{ maxWidth: '600px' }}>
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <h3 className="card-title">Record Actual Harvest</h3>
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Select Pond / Stock</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white' }}>
                <option>Pond A - Tilapia (Batch 1)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Total Weight (kg)</label>
                <input type="number" placeholder="e.g. 950" style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Total Fish Count</label>
                <input type="number" placeholder="e.g. 1180" style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Quality Notes</label>
              <textarea placeholder="Any comments on disease, deformities, or size distribution..." rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', resize: 'vertical' }}></textarea>
            </div>
            <button type="button" style={{ padding: '12px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={18} /> Complete Harvest & Transfer to Cold Storage
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
