import React, { useState } from 'react';
import { ShoppingCart, Package, Flame, Sun, Search, Plus, Filter, FileText, ArrowRight, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

export default function PostHarvestPage({ inventory = [], onSell, onAdd }) {
  const [activeTab, setActiveTab] = useState('processing');
  
  return (
    <div className="dashboard-content" style={{ paddingBottom: '40px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div className="dashboard-title">
          <h1>Post-Harvest Operations</h1>
          <p>Manage fish processing (smoking, drying), cold/dry storage, and sales.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="action-btn" onClick={() => setActiveTab('processing')} style={{ background: activeTab === 'processing' ? 'var(--accent-cyan)' : 'var(--bg-surface)', color: activeTab === 'processing' ? 'black' : 'white', border: '1px solid var(--border-color)', fontWeight: '600' }}>
            <Flame size={16} /> Processing
          </button>
          <button className="action-btn" onClick={() => setActiveTab('inventory')} style={{ background: activeTab === 'inventory' ? 'var(--accent-cyan)' : 'var(--bg-surface)', color: activeTab === 'inventory' ? 'black' : 'white', border: '1px solid var(--border-color)', fontWeight: '600' }}>
            <Package size={16} /> Storage Inventory
          </button>
          <button className="action-btn" onClick={() => setActiveTab('sales')} style={{ background: activeTab === 'sales' ? 'var(--accent-cyan)' : 'var(--bg-surface)', color: activeTab === 'sales' ? 'black' : 'white', border: '1px solid var(--border-color)', fontWeight: '600' }}>
            <ShoppingCart size={16} /> Sales & Orders
          </button>
        </div>
      </div>

      {activeTab === 'processing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Processing Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {/* Smoking Station */}
            <div className="card" style={{ borderTop: '4px solid var(--accent-orange)' }}>
              <div className="card-header" style={{ marginBottom: '16px' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame color="var(--accent-orange)" size={20} /> Smokehouse Log
                </h3>
              </div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Input Raw Fish (Lot #)</label>
                  <select style={{ width: '100%', padding: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}>
                    <option>LOT-2026-A1 (Catfish - 150kg available)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Input Weight (kg)</label>
                    <input type="number" placeholder="e.g. 50" style={{ width: '100%', padding: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '16px' }}>
                    <ArrowRight size={20} color="var(--text-muted)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Smoked Output (kg)</label>
                    <input type="number" placeholder="e.g. 15 (Yield: 30%)" style={{ width: '100%', padding: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Smoking Wood / Flavor</label>
                  <input type="text" placeholder="e.g. Hickory, Mesquite" style={{ width: '100%', padding: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                </div>
                <button type="button" style={{ marginTop: '8px', padding: '10px', background: 'var(--accent-orange)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Complete Smoking Batch
                </button>
              </form>
            </div>

            {/* Drying Station */}
            <div className="card" style={{ borderTop: '4px solid var(--accent-yellow)' }}>
              <div className="card-header" style={{ marginBottom: '16px' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun color="var(--accent-yellow)" size={20} /> Sun-Drying / Dehydrator
                </h3>
              </div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Input Raw Fish (Lot #)</label>
                  <select style={{ width: '100%', padding: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}>
                    <option>LOT-2026-B3 (Tilapia - 200kg available)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Input Weight (kg)</label>
                    <input type="number" placeholder="e.g. 100" style={{ width: '100%', padding: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '16px' }}>
                    <ArrowRight size={20} color="var(--text-muted)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dried Output (kg)</label>
                    <input type="number" placeholder="e.g. 20 (Yield: 20%)" style={{ width: '100%', padding: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drying Method</label>
                  <select style={{ width: '100%', padding: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}>
                    <option>Solar/Sun Dried</option>
                    <option>Electric Dehydrator</option>
                    <option>Salt Cured & Dried</option>
                  </select>
                </div>
                <button type="button" style={{ marginTop: '8px', padding: '10px', background: 'var(--accent-yellow)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Complete Drying Batch
                </button>
              </form>
            </div>
          </div>

          {/* Processing History Tracker */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Recent Processing Activity</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '8px' }}>Date</th>
                  <th style={{ padding: '8px' }}>Type</th>
                  <th style={{ padding: '8px' }}>Raw Input</th>
                  <th style={{ padding: '8px' }}>Yield Output</th>
                  <th style={{ padding: '8px' }}>Loss %</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px' }}>Today, 08:30 AM</td>
                  <td style={{ padding: '12px 8px' }}><span style={{ color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '4px' }}><Flame size={14}/> Smoked Catfish</span></td>
                  <td style={{ padding: '12px 8px' }}>50 kg</td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>14.5 kg</td>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-red)' }}>71%</td>
                  <td style={{ padding: '12px 8px' }}><CheckCircle2 size={16} color="var(--accent-green)"/></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px' }}>Yesterday, 14:00 PM</td>
                  <td style={{ padding: '12px 8px' }}><span style={{ color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: '4px' }}><Sun size={14}/> Sun-Dried Tilapia</span></td>
                  <td style={{ padding: '12px 8px' }}>100 kg</td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>22.0 kg</td>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-red)' }}>78%</td>
                  <td style={{ padding: '12px 8px' }}><CheckCircle2 size={16} color="var(--accent-green)"/></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 className="card-title">Storage & Packaging Inventory</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-green)', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
              <Plus size={16} /> Add Custom Stock
            </button>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Lot Number</th>
                <th style={{ padding: '12px 8px' }}>Product Type</th>
                <th style={{ padding: '12px 8px' }}>Storage Condition</th>
                <th style={{ padding: '12px 8px' }}>Available (kg)</th>
                <th style={{ padding: '12px 8px' }}>Date Processed</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock data */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 8px', color: 'var(--accent-cyan)' }}>LOT-SMK-102</td>
                <td style={{ padding: '12px 8px' }}>Smoked Catfish</td>
                <td style={{ padding: '12px 8px' }}><span style={{ padding: '2px 8px', background: 'rgba(251, 146, 60, 0.1)', color: 'var(--accent-orange)', borderRadius: '12px', fontSize: '11px' }}>Dry/Ambient</span></td>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>14.5</td>
                <td style={{ padding: '12px 8px' }}>2026-06-09</td>
                <td style={{ padding: '12px 8px' }}>
                  <button style={{ background: 'transparent', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Record Sale
                  </button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 8px', color: 'var(--accent-cyan)' }}>LOT-DRY-305</td>
                <td style={{ padding: '12px 8px' }}>Sun-Dried Tilapia</td>
                <td style={{ padding: '12px 8px' }}><span style={{ padding: '2px 8px', background: 'rgba(250, 204, 21, 0.1)', color: 'var(--accent-yellow)', borderRadius: '12px', fontSize: '11px' }}>Dry/Ambient</span></td>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>22.0</td>
                <td style={{ padding: '12px 8px' }}>2026-06-08</td>
                <td style={{ padding: '12px 8px' }}>
                  <button style={{ background: 'transparent', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Record Sale
                  </button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 8px', color: 'var(--accent-cyan)' }}>LOT-FRZ-001</td>
                <td style={{ padding: '12px 8px' }}>Whole Frozen Koi</td>
                <td style={{ padding: '12px 8px' }}><span style={{ padding: '2px 8px', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-cyan)', borderRadius: '12px', fontSize: '11px' }}>Cold Storage (-18°C)</span></td>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>450.0</td>
                <td style={{ padding: '12px 8px' }}>2026-05-20</td>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Sales Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
               <div className="stat-header">
                 <span className="stat-title">Total Sales This Month</span>
                 <DollarSign size={20} color="var(--accent-green)" />
               </div>
               <div className="stat-value">$8,450.00</div>
            </div>
            <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
               <div className="stat-header">
                 <span className="stat-title">Smoked Fish Revenue</span>
                 <Flame size={20} color="var(--accent-orange)" />
               </div>
               <div className="stat-value">$2,100.00</div>
            </div>
            <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
               <div className="stat-header">
                 <span className="stat-title">Pending Orders</span>
                 <Package size={20} color="var(--accent-cyan)" />
               </div>
               <div className="stat-value">4</div>
            </div>
          </div>

          {/* Sales Ledger */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 className="card-title">Recent Sales Orders</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface-elevated)', color: 'white', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <Filter size={16} /> Filter Types
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-green)', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                  <Plus size={16} /> New Order
                </button>
              </div>
            </div>
            
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Order ID</th>
                  <th style={{ padding: '12px 8px' }}>Product</th>
                  <th style={{ padding: '12px 8px' }}>Customer</th>
                  <th style={{ padding: '12px 8px' }}>Quantity</th>
                  <th style={{ padding: '12px 8px' }}>Total Price</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>ORD-001</td>
                  <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Flame size={14} color="var(--accent-orange)"/> Smoked Catfish</td>
                  <td style={{ padding: '12px 8px' }}>Local Market Vendor</td>
                  <td style={{ padding: '12px 8px' }}>10 kg</td>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-green)', fontWeight: 'bold' }}>$250.00</td>
                  <td style={{ padding: '12px 8px' }}><span style={{ padding: '2px 8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', borderRadius: '12px', fontSize: '11px' }}>Completed</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>ORD-002</td>
                  <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Sun size={14} color="var(--accent-yellow)"/> Sun-Dried Tilapia</td>
                  <td style={{ padding: '12px 8px' }}>Export Partner A</td>
                  <td style={{ padding: '12px 8px' }}>50 kg</td>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-green)', fontWeight: 'bold' }}>$800.00</td>
                  <td style={{ padding: '12px 8px' }}><span style={{ padding: '2px 8px', background: 'rgba(250, 204, 21, 0.1)', color: 'var(--accent-yellow)', borderRadius: '12px', fontSize: '11px' }}>Pending Delivery</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>ORD-003</td>
                  <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Package size={14} color="var(--accent-cyan)"/> Whole Frozen Koi</td>
                  <td style={{ padding: '12px 8px' }}>Distributor West</td>
                  <td style={{ padding: '12px 8px' }}>200 kg</td>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-green)', fontWeight: 'bold' }}>$1,200.00</td>
                  <td style={{ padding: '12px 8px' }}><span style={{ padding: '2px 8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', borderRadius: '12px', fontSize: '11px' }}>Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
