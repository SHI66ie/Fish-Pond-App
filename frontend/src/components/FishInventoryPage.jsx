import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, ArrowUpDown, Fish, Scale, HeartPulse, Clock, Utensils } from 'lucide-react';

const FishInventoryPage = ({ inventory, onAddFish, onEditFish, onDeleteFish, onBack }) => {
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

  return (
    <div className="dashboard-content fish-inventory-page">
      <div className="dashboard-header">
        <div className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            ← Back
          </button>
          <div>
            <h1>Fish Inventory Management</h1>
            <p>Add, edit, and manage your fish stock inventory</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--accent-cyan)', color: 'black', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add New Fish
        </button>
      </div>

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
            {filteredAndSortedInventory.length} {filteredAndSortedInventory.length === 1 ? 'fish' : 'fish types'}
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
                      <span className="fish-name">{fish.species}</span>
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
                        title="Edit"
                        style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteFish(fish.id)}
                        title="Delete"
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
    </div>
  );
};

export default FishInventoryPage;
