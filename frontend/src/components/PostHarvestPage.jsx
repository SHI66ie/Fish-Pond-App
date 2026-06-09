import React, { useState } from 'react';
import { ShoppingCart, Package, TrendingUp, Search, Plus, Filter, FileText } from 'lucide-react';

export default function PostHarvestPage({ inventory = [], onSell, onAdd }) {
  const [activeTab, setActiveTab] = useState('inventory');
  
  return (
    <div className="dashboard-content" style={{ paddingBottom: '40px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div className="dashboard-title">
          <h1>Post-Harvest & Sales</h1>
          <p>Manage cold storage inventory, log sales, and trace product lots.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="action-btn" onClick={() => setActiveTab('inventory')} style={{ background: activeTab === 'inventory' ? 'var(--accent-cyan)' : 'var(--bg-surface)', color: activeTab === 'inventory' ? 'black' : 'white', border: '1px solid var(--border-color)', fontWeight: '600' }}>
            <Package size={16} /> Cold Storage
          </button>
          <button className="action-btn" onClick={() => setActiveTab('sales')} style={{ background: activeTab === 'sales' ? 'var(--accent-cyan)' : 'var(--bg-surface)', color: activeTab === 'sales' ? 'black' : 'white', border: '1px solid var(--border-color)', fontWeight: '600' }}>
            <ShoppingCart size={16} /> Sales & Orders
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 className="card-title">Processed Fish Inventory</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-green)', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
              <Plus size={16} /> Add Stock
            </button>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Lot Number</th>
                <th style={{ padding: '12px 8px' }}>Product Type</th>
                <th style={{ padding: '12px 8px' }}>Available (kg)</th>
                <th style={{ padding: '12px 8px' }}>Harvest Date</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock data for now */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 8px', color: 'var(--accent-cyan)' }}>LOT-2026-A1</td>
                <td style={{ padding: '12px 8px' }}>Whole Frozen Tilapia</td>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>450.0</td>
                <td style={{ padding: '12px 8px' }}>2026-05-20</td>
                <td style={{ padding: '12px 8px' }}>
                  <button style={{ background: 'transparent', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Record Sale
                  </button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 8px', color: 'var(--accent-cyan)' }}>LOT-2026-B3</td>
                <td style={{ padding: '12px 8px' }}>Catfish Fillets</td>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>120.5</td>
                <td style={{ padding: '12px 8px' }}>2026-05-25</td>
                <td style={{ padding: '12px 8px' }}>
                  <button style={{ background: 'transparent', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Record Sale
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 className="card-title">Recent Sales Orders</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface-elevated)', color: 'white', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
              <Filter size={16} /> Filter
            </button>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <ShoppingCart size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
            <p>No recent sales found.</p>
            <p style={{ fontSize: '12px' }}>Record a sale from the Cold Storage inventory tab.</p>
          </div>
        </div>
      )}
    </div>
  );
}
