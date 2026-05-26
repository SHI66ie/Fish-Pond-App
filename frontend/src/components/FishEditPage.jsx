import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeft, Save, Trash2, HeartPulse, Scale, Dna, Clock, Utensils, Plus } from 'lucide-react';

const FishEditPage = ({ fish, onBack, onSave }) => {
  const [feedingTimes, setFeedingTimes] = useState(fish?.feedingTimes || []);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...fish,
      mortality: 0,
      notes: ''
    }
  });

  const onSubmit = (data) => {
    const healthTextMap = { excellent: 'Excellent', good: 'Good', fair: 'Monitor', poor: 'Poor' };
    let updatedQuantity = parseInt(data.quantity);
    if (data.mortality && parseInt(data.mortality) > 0) {
      updatedQuantity -= parseInt(data.mortality);
      if (updatedQuantity < 0) updatedQuantity = 0;
    }
    
    onSave({
      ...fish,
      ...data,
      feedingTimes: feedingTimes.filter(t => t.trim() !== ''),
      quantity: updatedQuantity,
      healthText: healthTextMap[data.health] || data.health
    });
  };

  if (!fish) return null;

  return (
    <div className="dashboard-content fish-edit-page">
      <div className="dashboard-header">
        <div className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1>Edit Fish Stock</h1>
            <p>Make extensive updates to the {fish.species} inventory.</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="grid grid-cols-2" style={{ gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dna size={16} /> Species Name
              </label>
              <input 
                {...register("species", { required: true })} 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }} 
              />
              {errors.species && <span style={{ color: 'var(--accent-red)', fontSize: '12px' }}>Species is required</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={16} /> Average Weight (kg)
              </label>
              <input 
                type="number"
                step="0.1"
                {...register("weight", { required: true })} 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }} 
              />
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          <div className="grid grid-cols-2" style={{ gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Current Quantity</label>
              <input 
                type="number"
                {...register("quantity", { required: true })} 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--accent-red)' }}>Report Mortality (Deducts from Quantity)</label>
              <input 
                type="number"
                {...register("mortality")} 
                placeholder="0"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', color: 'white' }} 
              />
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={16} /> Health Status & Notes
            </label>
            <select
              {...register("health")}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', marginBottom: '12px' }}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Monitor / Fair</option>
              <option value="poor">Poor</option>
            </select>

            <textarea
              {...register("notes")}
              placeholder="Add details about treatment, symptoms, or feeding behavior..."
              rows={4}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', resize: 'vertical' }}
            />
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          <div className="grid grid-cols-2" style={{ gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={16} /> Feed Type
              </label>
              <input
                {...register("feedType")}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                placeholder="e.g., Protein Pellets"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> Feeding Times
              </label>
              {feedingTimes.map((time, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const times = [...feedingTimes];
                      times[index] = e.target.value;
                      setFeedingTimes(times);
                    }}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const times = [...feedingTimes];
                      times.splice(index, 1);
                      setFeedingTimes(times);
                    }}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-red)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFeedingTimes([...feedingTimes, ''])}
                style={{ padding: '8px', borderRadius: '8px', border: '1px dashed var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Add Another Time
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
            <button 
              type="button" 
              onClick={onBack}
              style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--accent-cyan)', color: 'black', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FishEditPage;
