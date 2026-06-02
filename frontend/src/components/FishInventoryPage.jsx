import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Search, ArrowUpDown, Fish, Scale, HeartPulse, 
  Clock, Utensils, Calculator, Gauge, ShieldAlert, Target, Sparkles, BookOpen 
} from 'lucide-react';

const FishInventoryPage = ({ inventory, onAddFish, onEditFish, onDeleteFish, onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' or 'calculators'
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('species');
  const [sortOrder, setSortOrder] = useState('asc');
  const [newFish, setNewFish] = useState({
    species: '',
    quantity: '',
    weight: '',
    health: 'good',
    feedType: '',
    feedingTimes: [''],
    notes: ''
  });

  // Calculator-specific States
  const [selectedFishId, setSelectedFishId] = useState(inventory[0]?.id || '');
  const [feedRatePercent, setFeedRatePercent] = useState(2.5); // % of body weight
  
  const [fcrTotalFeed, setFcrTotalFeed] = useState(150); // kg
  const [fcrWeightGained, setFcrWeightGained] = useState(100); // kg
  
  const [pondVolume, setPondVolume] = useState(500); // cubic meters
  
  const [targetHarvestWeight, setTargetHarvestWeight] = useState(1.2); // kg
  const [dailyGrowthRate, setDailyGrowthRate] = useState(5.0); // grams/day

  const currentSelectedFish = inventory.find(f => f.id === Number(selectedFishId)) || inventory[0];

  const filteredAndSortedInventory = inventory
    .filter(fish => fish.species.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'species') comparison = a.species.localeCompare(b.species);
      else if (sortBy === 'quantity') comparison = a.quantity - b.quantity;
      else if (sortBy === 'weight') comparison = parseFloat(a.weight) - parseFloat(b.weight);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleAddFish = (e) => {
    e.preventDefault();
    onAddFish({
      id: Date.now(),
      ...newFish,
      feedingTimes: newFish.feedingTimes.filter(t => t.trim() !== ''),
      quantity: parseInt(newFish.quantity),
      weight: newFish.weight,
      healthText: newFish.health.charAt(0).toUpperCase() + newFish.health.slice(1)
    });
    setNewFish({ species: '', quantity: '', weight: '', health: 'good', feedType: '', feedingTimes: [''], notes: '' });
    setShowAddForm(false);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Calculator Math functions
  const calculateFCR = () => {
    if (!fcrWeightGained || fcrWeightGained <= 0) return 0;
    return (fcrTotalFeed / fcrWeightGained).toFixed(2);
  };

  const getFCRFeedback = (val) => {
    const numeric = parseFloat(val);
    if (numeric <= 0) return { label: 'Invalid Data', color: 'var(--text-muted)' };
    if (numeric < 1.0) return { label: 'Extremely Efficient (Check inputs)', color: 'var(--accent-cyan)' };
    if (numeric <= 1.4) return { label: 'Excellent Conversion Ratio', color: 'var(--accent-green)' };
    if (numeric <= 1.8) return { label: 'Good/Average Ratio', color: 'var(--accent-orange)' };
    return { label: 'Poor Efficiency (Overfeeding/Waste)', color: 'var(--accent-red)' };
  };

  const calculateBiomass = () => {
    if (!currentSelectedFish) return 0;
    return currentSelectedFish.quantity * parseFloat(currentSelectedFish.weight);
  };

  const calculateDailyFeed = () => {
    const biomass = calculateBiomass();
    return (biomass * (feedRatePercent / 100)).toFixed(1);
  };

  const calculateStockingDensity = () => {
    if (!currentSelectedFish || !pondVolume || pondVolume <= 0) return { count: 0, biomass: 0 };
    const countDensity = (currentSelectedFish.quantity / pondVolume).toFixed(2);
    const weightDensity = (calculateBiomass() / pondVolume).toFixed(2);
    return { count: countDensity, biomass: weightDensity };
  };

  const calculateDaysToHarvest = () => {
    if (!currentSelectedFish || !targetHarvestWeight || !dailyGrowthRate || dailyGrowthRate <= 0) return 0;
    const currentWeightGrams = parseFloat(currentSelectedFish.weight) * 1000;
    const targetWeightGrams = targetHarvestWeight * 1000;
    const difference = targetWeightGrams - currentWeightGrams;
    if (difference <= 0) return 0;
    return Math.ceil(difference / dailyGrowthRate);
  };

  const densityDetails = calculateStockingDensity();
  const daysToHarvest = calculateDaysToHarvest();
  const fcrVal = calculateFCR();
  const fcrFeedback = getFCRFeedback(fcrVal);

  return (
    <div className="dashboard-content fish-inventory-page">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            ← Back
          </button>
          <div>
            <h1>Fish Inventory Management</h1>
            <p>Add, edit, and audit your stock alongside professional aquaculture calculators.</p>
          </div>
        </div>

        {/* Tab & Form Toggles */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setActiveSubTab('list')}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '6px', 
                fontSize: '14px', 
                fontWeight: '500', 
                transition: 'var(--transition-fast)', 
                background: activeSubTab === 'list' ? 'var(--accent-cyan-dim)' : 'transparent', 
                color: activeSubTab === 'list' ? 'var(--accent-cyan)' : 'var(--text-secondary)' 
              }}
            >
              Stock List
            </button>
            <button 
              onClick={() => setActiveSubTab('calculators')}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '6px', 
                fontSize: '14px', 
                fontWeight: '500', 
                transition: 'var(--transition-fast)', 
                background: activeSubTab === 'calculators' ? 'var(--accent-cyan-dim)' : 'transparent', 
                color: activeSubTab === 'calculators' ? 'var(--accent-cyan)' : 'var(--text-secondary)' 
              }}
            >
              Calculators
            </button>
          </div>
          
          {activeSubTab === 'list' && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--accent-cyan)', color: 'black', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} /> Add New Fish
            </button>
          )}
        </div>
      </div>

      {/* RENDER TAB 1: STOCK LIST */}
      {activeSubTab === 'list' && (
        <>
          {showAddForm && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <h3 className="card-title">Add New Fish to Inventory</h3>
              </div>
              <form onSubmit={handleAddFish} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Fish size={16} /> Species Name
                  </label>
                  <input
                    type="text"
                    value={newFish.species}
                    onChange={(e) => setNewFish({ ...newFish, species: e.target.value })}
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    placeholder="e.g., Tilapia, Catfish, Koi"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Scale size={16} /> Average Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFish.weight}
                    onChange={(e) => setNewFish({ ...newFish, weight: e.target.value })}
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    placeholder="0.5"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Quantity</label>
                  <input
                    type="number"
                    value={newFish.quantity}
                    onChange={(e) => setNewFish({ ...newFish, quantity: e.target.value })}
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    placeholder="100"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HeartPulse size={16} /> Health Status
                  </label>
                  <select
                    value={newFish.health}
                    onChange={(e) => setNewFish({ ...newFish, health: e.target.value })}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Monitor / Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Utensils size={16} /> Feed Type
                  </label>
                  <input
                    type="text"
                    value={newFish.feedType}
                    onChange={(e) => setNewFish({ ...newFish, feedType: e.target.value })}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    placeholder="e.g., Protein Pellets, Mixed Feed"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} /> Feeding Times
                  </label>
                  {newFish.feedingTimes.map((time, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const times = [...newFish.feedingTimes];
                          times[index] = e.target.value;
                          setNewFish({ ...newFish, feedingTimes: times });
                        }}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', flex: 1 }}
                      />
                      {newFish.feedingTimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const times = [...newFish.feedingTimes];
                            times.splice(index, 1);
                            setNewFish({ ...newFish, feedingTimes: times });
                          }}
                          style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-red)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewFish({ ...newFish, feedingTimes: [...newFish.feedingTimes, ''] })}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px dashed var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}
                  >
                    + Add Another Time
                  </button>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Notes</label>
                  <textarea
                    value={newFish.notes}
                    onChange={(e) => setNewFish({ ...newFish, notes: e.target.value })}
                    rows={2}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', resize: 'vertical' }}
                    placeholder="Additional notes about this fish stock..."
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--accent-cyan)', color: 'black', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Add Fish
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card">
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="search-bar" style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}>
                  <Search size={16} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search fish species..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '200px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleSort('species')}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                  >
                    Species <ArrowUpDown size={12} />
                  </button>
                  <button
                    onClick={() => handleSort('quantity')}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                  >
                    Quantity <ArrowUpDown size={12} />
                  </button>
                  <button
                    onClick={() => handleSort('weight')}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                  >
                    Weight <ArrowUpDown size={12} />
                  </button>
                </div>
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {filteredAndSortedInventory.length} {filteredAndSortedInventory.length === 1 ? 'fish type' : 'fish types'}
              </span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Species</th>
                    <th>Quantity</th>
                    <th>Avg Weight</th>
                    <th>Total Weight</th>
                    <th>Health Status</th>
                    <th>Feed Type</th>
                    <th>Feeding Times</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedInventory.map(fish => (
                    <tr key={fish.id}>
                      <td>
                        <div className="fish-cell">
                          <span className="fish-name" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{fish.species}</span>
                        </div>
                      </td>
                      <td>{fish.quantity.toLocaleString()}</td>
                      <td>{fish.weight} kg</td>
                      <td>{(fish.quantity * parseFloat(fish.weight)).toFixed(1)} kg</td>
                      <td>
                        <div className="health-status">
                          <span className={`health-dot ${fish.health}`}></span>
                          {fish.healthText}
                        </div>
                      </td>
                      <td>{fish.feedType || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {fish.feedingTimes?.map((t, i) => (
                            <span key={i} style={{ background: 'var(--bg-surface-elevated)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', border: '1px solid var(--border-color)' }}>
                              {t}
                            </span>
                          ))}
                          {(!fish.feedingTimes || fish.feedingTimes.length === 0) && '-'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => onEditFish(fish)}
                            title="Edit Details"
                            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteFish(fish.id)}
                            title="Delete Stock"
                            style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedInventory.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No fish found. Add your first fish to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* RENDER TAB 2: AQUACULTURE CALCULATORS */}
      {activeSubTab === 'calculators' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Global Fish Selector for Auto-population */}
          <div className="card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--accent-cyan-dim)', borderRadius: '8px', padding: '8px', color: 'var(--accent-cyan)' }}>
                <Fish size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Active Stock Integration</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Select a species to pre-populate calculations with current inventory data.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <select
                value={selectedFishId}
                onChange={(e) => setSelectedFishId(e.target.value)}
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)', 
                  background: 'var(--bg-surface-elevated)', 
                  color: 'white',
                  minWidth: '200px',
                  fontWeight: '500'
                }}
              >
                {inventory.map(f => (
                  <option key={f.id} value={f.id}>{f.species} ({f.quantity.toLocaleString()} fish)</option>
                ))}
                {inventory.length === 0 && <option value="">No Fish in Inventory</option>}
              </select>

              {currentSelectedFish && (
                <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '6px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                  <span>Qty: <strong>{currentSelectedFish.quantity.toLocaleString()}</strong></span>
                  <span style={{ color: 'var(--border-color)' }}>|</span>
                  <span>Avg Wt: <strong>{currentSelectedFish.weight} kg</strong></span>
                  <span style={{ color: 'var(--border-color)' }}>|</span>
                  <span>Total Biomass: <strong>{calculateBiomass().toFixed(1)} kg</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Calculator Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            
            {/* Calculator 1: Daily Feed Requirement */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calculator size={18} style={{ color: 'var(--accent-cyan)' }} /> Daily Feed Requirement
                  </h3>
                  <span className="status-badge" style={{ background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>Biomass Based</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                  Calculate feed quotas based on total fish weight and feeding intensity percentages.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Daily Feed Rate (% of body weight)</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>{feedRatePercent}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="8.0" 
                      step="0.1"
                      value={feedRatePercent}
                      onChange={(e) => setFeedRatePercent(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-cyan)', background: 'var(--bg-base)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>0.5% (Maintenance)</span>
                      <span>2.5% (Standard)</span>
                      <span>8.0% (Fingerlings)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 224, 255, 0.04)', border: '1px solid rgba(0, 224, 255, 0.1)', borderRadius: '10px', padding: '16px', marginTop: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Estimated Daily Feed</span>
                    <h2 style={{ color: 'var(--accent-cyan)', fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0' }}>
                      {calculateDailyFeed()} <span style={{ fontSize: '14px', fontWeight: '500' }}>kg</span>
                    </h2>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Per Feed Session</span>
                    <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0' }}>
                      {(calculateDailyFeed() / Math.max(1, currentSelectedFish?.feedingTimes?.length || 2)).toFixed(1)} <span style={{ fontSize: '14px', fontWeight: '500' }}>kg</span>
                    </h2>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} /> Divided across {currentSelectedFish?.feedingTimes?.length || 2} feeding sessions defined for this species.
                </div>
              </div>
            </div>

            {/* Calculator 2: Feed Conversion Ratio (FCR) */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gauge size={18} style={{ color: 'var(--accent-green)' }} /> Feed Conversion Ratio (FCR)
                  </h3>
                  <span className="status-badge" style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>Efficiency Index</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                  Measure feeding performance. A lower ratio means higher efficiency and lower costs.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Feed Distributed (kg)</label>
                    <input 
                      type="number" 
                      value={fcrTotalFeed}
                      onChange={(e) => setFcrTotalFeed(parseFloat(e.target.value) || 0)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Weight Gained (kg)</label>
                    <input 
                      type="number" 
                      value={fcrWeightGained}
                      onChange={(e) => setFcrWeightGained(parseFloat(e.target.value) || 0)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '10px', padding: '16px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Calculated FCR</span>
                    <h2 style={{ color: 'var(--accent-green)', fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0' }}>
                      {fcrVal}
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>FCR Assessment</span>
                    <div style={{ color: fcrFeedback.color, fontWeight: '600', fontSize: '14px', marginTop: '6px' }}>
                      {fcrFeedback.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator 3: Pond Stocking Density */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} style={{ color: 'var(--accent-purple)' }} /> Pond Stocking Density
                  </h3>
                  <span className="status-badge" style={{ background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>Safety Audit</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                  Verify that your fish count does not exceed safety thresholds of water volume.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Pond Water Volume (m³)</label>
                  <input 
                    type="number" 
                    value={pondVolume}
                    onChange={(e) => setPondVolume(parseFloat(e.target.value) || 0)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '10px', padding: '16px', marginTop: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Density (Fish/m³)</span>
                    <h2 style={{ color: 'var(--accent-purple)', fontSize: '24px', fontWeight: '700', margin: '4px 0 0 0' }}>
                      {densityDetails.count} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>fish/m³</span>
                    </h2>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Biomass (kg/m³)</span>
                    <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: '4px 0 0 0' }}>
                      {densityDetails.biomass} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>kg/m³</span>
                    </h2>
                  </div>
                </div>
                {parseFloat(densityDetails.count) > 30 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-red)', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                    ⚠️ Warning: Stocking density is high. Ensure active oxygenation and biofiltration!
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-green)', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                    ✓ Safe stocking density for semi-intensive pond structures.
                  </div>
                )}
              </div>
            </div>

            {/* Calculator 4: Growth & Harvest Forecast */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={18} style={{ color: 'var(--accent-cyan)' }} /> Growth & Harvest Projector
                  </h3>
                  <span className="status-badge" style={{ background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>Growth Forecast</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                  Project time remaining and date estimations to reach target harvest size.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Target Harvest Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={targetHarvestWeight}
                      onChange={(e) => setTargetHarvestWeight(parseFloat(e.target.value) || 0)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Growth Rate (g / day)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={dailyGrowthRate}
                      onChange={(e) => setDailyGrowthRate(parseFloat(e.target.value) || 0)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 224, 255, 0.04)', border: '1px solid rgba(0, 224, 255, 0.1)', borderRadius: '10px', padding: '16px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Days to Harvest Size</span>
                    <h2 style={{ color: 'var(--accent-cyan)', fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0' }}>
                      {daysToHarvest} <span style={{ fontSize: '14px', fontWeight: '500' }}>Days</span>
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Estimated Date</span>
                    <div style={{ color: 'white', fontWeight: '600', fontSize: '14px', marginTop: '6px' }}>
                      {daysToHarvest > 0 
                        ? new Date(Date.now() + daysToHarvest * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Achieved / N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Educational / Resource Section */}
          <div className="card" style={{ padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ color: 'var(--accent-orange)' }}><BookOpen size={24} /></div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Aquaculture Standards Reference Guide</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                For warm-water species like Tilapia or Catfish, standard feed conversion ratios sit between <strong>1.2 and 1.6</strong>. Stocking densities under <strong>10 kg/m³</strong> are safe for standard pond cages, while intensive aeration and biofiltration can support up to <strong>40-60 kg/m³</strong>. Growth rates usually vary from <strong>3g to 7g per day</strong> depending on feeding quality and temperature levels.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default FishInventoryPage;
