import React, { useState } from 'react';
import { Clock, Plus, Trash2, Edit2, Search } from 'lucide-react';

const FeedingSchedulePage = ({ inventory, onUpdateFish }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Flatten the inventory into individual feeding events
  const feedingEvents = inventory
    .flatMap(fish => (fish.feedingTimes || []).map(time => ({ ...fish, time, originalTimes: fish.feedingTimes })))
    .filter(event => event.species.toLowerCase().includes(searchTerm.toLowerCase()) || event.time.includes(searchTerm))
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleDeleteTime = (fishId, timeToRemove) => {
    const fishToUpdate = inventory.find(f => f.id === fishId);
    if (!fishToUpdate) return;
    const newTimes = fishToUpdate.feedingTimes.filter(t => t !== timeToRemove);
    onUpdateFish({ ...fishToUpdate, feedingTimes: newTimes });
  };

  const handleAddTime = (fishId, newTime) => {
    if (!newTime) return;
    const fishToUpdate = inventory.find(f => f.id === fishId);
    if (!fishToUpdate) return;
    if (fishToUpdate.feedingTimes?.includes(newTime)) return;
    const newTimes = [...(fishToUpdate.feedingTimes || []), newTime];
    onUpdateFish({ ...fishToUpdate, feedingTimes: newTimes });
  };

  const [selectedFishId, setSelectedFishId] = useState('');
  const [newTimeInput, setNewTimeInput] = useState('');

  return (
    <div className="dashboard-content feeding-schedule-page">
      <div className="dashboard-header">
        <div className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <h1>Feeding Schedule Table</h1>
            <p>Manage and track feeding times for all your fish species in a tabulated view.</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Select Fish Species</label>
          <select 
            value={selectedFishId}
            onChange={(e) => setSelectedFishId(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
          >
            <option value="">-- Choose Fish --</option>
            {inventory.map(fish => (
              <option key={fish.id} value={fish.id}>{fish.species}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Feeding Time</label>
          <input 
            type="time" 
            value={newTimeInput}
            onChange={(e) => setNewTimeInput(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
          />
        </div>
        <button 
          onClick={() => {
            handleAddTime(parseInt(selectedFishId), newTimeInput);
            setNewTimeInput('');
          }}
          disabled={!selectedFishId || !newTimeInput}
          style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--accent-cyan)', color: 'black', fontWeight: '600', cursor: (!selectedFishId || !newTimeInput) ? 'not-allowed' : 'pointer', opacity: (!selectedFishId || !newTimeInput) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px', height: '46px' }}
        >
          <Plus size={18} /> Add Feeding Time
        </button>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <div className="search-bar" style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by species or time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '250px' }}
            />
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {feedingEvents.length} scheduled feedings
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Species</th>
                <th>Feed Type</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedingEvents.map((event, idx) => (
                <tr key={`${event.id}-${idx}`}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} style={{ color: 'var(--accent-cyan)' }} />
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>{event.time}</span>
                    </div>
                  </td>
                  <td>{event.species}</td>
                  <td>{event.feedType || '-'}</td>
                  <td>{event.quantity.toLocaleString()} fish</td>
                  <td>
                    <button
                      onClick={() => handleDeleteTime(event.id, event.time)}
                      title="Remove Time"
                      style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {feedingEvents.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No feeding times scheduled. Add one above!
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

export default FeedingSchedulePage;
