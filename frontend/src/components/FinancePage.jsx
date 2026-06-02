import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Edit2, 
  Percent, Calendar, Tag, ChevronDown, Check, X, Scale, HelpCircle 
} from 'lucide-react';

const FinancePage = ({ inventory, transactions, onAddTransaction, onUpdateTransaction, onDeleteTransaction }) => {
  // Local form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrans, setNewTrans] = useState({
    type: 'EXPENSE',
    category: 'Feed',
    amount: '',
    description: '',
    comment: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Editing transaction state
  const [editingId, setEditingId] = useState(null);
  const [editTrans, setEditTrans] = useState({
    type: 'EXPENSE',
    category: 'Feed',
    amount: '',
    description: '',
    comment: '',
    date: ''
  });

  // ROI Calculator states
  const [marketPrice, setMarketPrice] = useState(4.5); // USD per kg

  // P&L Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

  // Expense breakdown calculations
  const expenseCategories = ['Feed', 'Medicine', 'Maintenance', 'Equipment', 'Labor', 'Other'];
  
  const expenseByCategory = expenseCategories.reduce((acc, cat) => {
    const sum = transactions
      .filter(t => t.type === 'EXPENSE' && t.category === cat)
      .reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    acc[cat] = sum;
    return acc;
  }, {});

  // Calculate total crop weight from inventory
  const totalCropWeight = inventory.reduce((sum, fish) => {
    return sum + (fish.quantity * parseFloat(fish.weight || 0));
  }, 0);

  const projectedROI = totalCropWeight * marketPrice;

  // Handle new transaction submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTrans.amount || parseFloat(newTrans.amount) <= 0) return;
    
    onAddTransaction({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      type: newTrans.type,
      category: newTrans.category,
      amount: parseFloat(newTrans.amount),
      description: newTrans.description,
      comment: newTrans.comment,
      date: newTrans.date
    });

    setNewTrans({
      type: 'EXPENSE',
      category: 'Feed',
      amount: '',
      description: '',
      comment: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const handleStartEdit = (t) => {
    setEditingId(t.id);
    setEditTrans({
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description || '',
      comment: t.comment || '',
      date: t.date || new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveEdit = (id) => {
    if (!editTrans.amount || parseFloat(editTrans.amount) <= 0) return;
    onUpdateTransaction({
      id,
      type: editTrans.type,
      category: editTrans.category,
      amount: parseFloat(editTrans.amount),
      description: editTrans.description,
      comment: editTrans.comment,
      date: editTrans.date
    });
    setEditingId(null);
  };

  return (
    <div className="dashboard-content finance-page">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Finance & P&L Reports</h1>
          <p>Analyze operational costs, track revenues, and estimate crop market valuation.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ 
            padding: '12px 24px', 
            borderRadius: '8px', 
            border: 'none', 
            background: 'var(--accent-cyan)', 
            color: 'black', 
            fontWeight: '600', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Plus size={18} /> Record Transaction
        </button>
      </div>

      {/* P&L Cards Row */}
      <div className="grid grid-cols-4" style={{ marginBottom: '24px' }}>
        
        {/* Total Income */}
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Revenue</span>
            <div className="stat-icon green" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '8px', borderRadius: '50%' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
              ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Cash inflow transactions</div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Expenses</span>
            <div className="stat-icon red" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '8px', borderRadius: '50%' }}>
              <TrendingDown size={20} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="stat-value" style={{ color: 'var(--accent-red)' }}>
              ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Operational outflows</div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">Net Profit</span>
            <div className="stat-icon cyan" style={{ background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', padding: '8px', borderRadius: '50%' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="stat-value" style={{ color: netProfit >= 0 ? 'var(--accent-cyan)' : 'var(--accent-red)' }}>
              ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Net operating income</div>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">Profit Margin</span>
            <div className="stat-icon purple" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', padding: '8px', borderRadius: '50%' }}>
              <Percent size={20} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="stat-value">
              {profitMargin}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Profit to revenue ratio</div>
          </div>
        </div>

      </div>

      {/* Record Transaction Form (Slide down / Show when clicked) */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '24px', border: '1px solid var(--accent-cyan)' }}>
          <div className="card-header">
            <h3 className="card-title">Record New Transaction</h3>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Type</label>
              <select
                value={newTrans.type}
                onChange={(e) => setNewTrans({ ...newTrans, type: e.target.value, category: e.target.value === 'INCOME' ? 'Sales' : 'Feed' })}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
              >
                <option value="EXPENSE">Expense (Outflow)</option>
                <option value="INCOME">Income (Inflow)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Category</label>
              <select
                value={newTrans.category}
                onChange={(e) => setNewTrans({ ...newTrans, category: e.target.value })}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
              >
                {newTrans.type === 'INCOME' ? (
                  <>
                    <option value="Sales">Fish Sales</option>
                    <option value="Subsidy">Government/Subsidy</option>
                    <option value="Other">Other Revenue</option>
                  </>
                ) : (
                  <>
                    <option value="Feed">Feed Stock</option>
                    <option value="Medicine">Medicine & Bio-treatments</option>
                    <option value="Maintenance">Pond Maintenance</option>
                    <option value="Equipment">Hardware & Equipment</option>
                    <option value="Labor">Labor Salaries</option>
                    <option value="Other">Other Bills</option>
                  </>
                )}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="250.00"
                value={newTrans.amount}
                onChange={(e) => setNewTrans({ ...newTrans, amount: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Date</label>
              <input
                type="date"
                value={newTrans.date}
                onChange={(e) => setNewTrans({ ...newTrans, date: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Description</label>
              <input
                type="text"
                placeholder="e.g., Purchased 5 bags of protein grower pellets"
                value={newTrans.description}
                onChange={(e) => setNewTrans({ ...newTrans, description: e.target.value })}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
              />
            </div>

            <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Comment / Audit Notes</label>
              <input
                type="text"
                placeholder="e.g., Approved, check clearance"
                value={newTrans.comment}
                onChange={(e) => setNewTrans({ ...newTrans, comment: e.target.value })}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer', fontWeight: '500' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ flex: 1, padding: '12px', borderRadius: '6px', background: 'var(--accent-cyan)', color: 'black', cursor: 'pointer', fontWeight: '600' }}
              >
                Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Visuals + Ledger */}
      <div className="main-grid">
        
        {/* Left Column: Visual breakdown and ROI calculator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Expense breakdown chart card */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={18} style={{ color: 'var(--accent-red)' }} /> Expense Breakdown
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Categorized outflows</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {expenseCategories.map(cat => {
                const amount = expenseByCategory[cat] || 0;
                const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(0) : '0';
                
                return (
                  <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{cat}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({percentage}%)
                      </span>
                    </div>
                    {/* Native progress bar using absolute styling for maximum control */}
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-base)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        background: cat === 'Feed' ? 'var(--accent-cyan)' : cat === 'Medicine' ? 'var(--accent-purple)' : 'var(--accent-blue)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease-in-out'
                      }}></div>
                    </div>
                  </div>
                );
              })}
              {totalExpense === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No expense records found. Record expenses to see chart breakdown.
                </div>
              )}
            </div>
          </div>

          {/* Calculator: ROI & Crop Valuation */}
          <div className="card" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={18} style={{ color: 'var(--accent-purple)' }} /> Projected Harvest Valuation
              </h3>
              <span className="status-badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', fontSize: '11px' }}>ROI Calculator</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
              Valuate your active crop. Multiplies total weight in inventory by current wholesale market pricing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Stock Biomass</span>
                <span style={{ color: 'white', fontWeight: '600' }}>{totalCropWeight.toFixed(1)} kg</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Market Price ($ per kg)</span>
                  <span style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>${marketPrice.toFixed(2)} / kg</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="12.0" 
                  step="0.1"
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-purple)', background: 'var(--bg-base)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>$1.00</span>
                  <span>$4.50 (Tilapia Avg)</span>
                  <span>$12.00 (Premium Koi)</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Est. Harvest Gross Value</span>
                  <h2 style={{ color: 'var(--accent-purple)', fontSize: '24px', fontWeight: '700', margin: '4px 0 0 0' }}>
                    ${projectedROI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', maxWidth: '140px' }}>
                  Calculated based on {inventory.length} active fish groups.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Transaction Ledger */}
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <h3 className="card-title">Transaction Ledger</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {transactions.length} record{transactions.length !== 1 && 's'}
            </span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Comment</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    {editingId === t.id ? (
                      // Inline Editing Row
                      <>
                        <td>
                          <input
                            type="date"
                            value={editTrans.date}
                            onChange={(e) => setEditTrans({ ...editTrans, date: e.target.value })}
                            style={{ padding: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', width: '120px' }}
                          />
                        </td>
                        <td>
                          <select
                            value={editTrans.type}
                            onChange={(e) => setEditTrans({ ...editTrans, type: e.target.value, category: e.target.value === 'INCOME' ? 'Sales' : 'Feed' })}
                            style={{ padding: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                          >
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={editTrans.category}
                            onChange={(e) => setEditTrans({ ...editTrans, category: e.target.value })}
                            style={{ padding: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                          >
                            {editTrans.type === 'INCOME' ? (
                              <>
                                <option value="Sales">Fish Sales</option>
                                <option value="Subsidy">Subsidy</option>
                                <option value="Other">Other</option>
                              </>
                            ) : (
                              <>
                                <option value="Feed">Feed</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Labor">Labor</option>
                                <option value="Other">Other</option>
                              </>
                            )}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editTrans.description}
                            onChange={(e) => setEditTrans({ ...editTrans, description: e.target.value })}
                            style={{ padding: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', width: '100%' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editTrans.comment}
                            onChange={(e) => setEditTrans({ ...editTrans, comment: e.target.value })}
                            placeholder="Add comments..."
                            style={{ padding: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', width: '100%' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={editTrans.amount}
                            onChange={(e) => setEditTrans({ ...editTrans, amount: e.target.value })}
                            style={{ padding: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', width: '80px' }}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleSaveEdit(t.id)} style={{ color: 'var(--accent-green)', cursor: 'pointer' }}><Check size={16} /></button>
                            <button onClick={() => setEditingId(null)} style={{ color: 'var(--accent-red)', cursor: 'pointer' }}><X size={16} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Regular Display Row
                      <>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                            <Calendar size={14} />
                            <span>{t.date}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            background: t.type === 'INCOME' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                            color: t.type === 'INCOME' ? 'var(--accent-green)' : 'var(--accent-red)'
                          }}>
                            {t.type}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                            <Tag size={13} style={{ color: 'var(--text-muted)' }} />
                            <span>{t.category}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{t.description || '-'}</span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>{t.comment || '-'}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: '600', color: t.type === 'INCOME' ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                            {t.type === 'INCOME' ? '+' : '-'}${parseFloat(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleStartEdit(t)} title="Edit" style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer' }}><Edit2 size={15} /></button>
                            <button onClick={() => onDeleteTransaction(t.id)} title="Delete" style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No transactions recorded. Record an income or expense to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinancePage;
