import React, { useState, useEffect } from 'react';
import { 
  Droplet, Thermometer, Wind, AlertTriangle, Activity, Settings, 
  RefreshCw, FlaskConical, Beaker, Waves, CheckCircle, Clock
} from 'lucide-react';

const WaterSensorsPage = ({ inventory }) => {
  // Mock Live Sensor Data (Editable via sliders for testing alerts)
  const [sensors, setSensors] = useState({
    do: 6.8,      // Dissolved Oxygen (mg/L)
    ph: 7.2,      // pH Level
    temp: 24.5,   // Temperature (C)
    tan: 0.8,     // Total Ammonia Nitrogen (mg/L)
    nitrite: 0.05,// Nitrite (mg/L)
    salinity: 0   // Salinity (ppt)
  });

  // Calculators State
  const [pondVolume, setPondVolume] = useState(1500); // cubic meters (m3)
  const [pumpFlowRate, setPumpFlowRate] = useState(800); // Liters per minute
  const [exchangePercent, setExchangePercent] = useState(20); // 20% water change

  // --- Ammonia Toxicity (UIA) Calculation ---
  // Calculates toxic un-ionized ammonia fraction based on temp and pH
  const calculateUIA = (tan, temp, ph) => {
    // Emerson equation approximation
    const tempK = temp + 273.15;
    const pKa = 0.09018 + (2729.92 / tempK);
    const fraction = 1 / (Math.pow(10, pKa - ph) + 1);
    return tan * fraction;
  };

  const uia = calculateUIA(sensors.tan, sensors.temp, sensors.ph);
  const uiaToxic = uia > 0.05; // 0.05 mg/L is generally considered stressful/lethal

  // --- Treatment Calculations ---
  // Lime calculation (rough estimation: ~100g of agricultural lime per m3 to raise pH by 1.0)
  const calculateLime = (currentPh, targetPh, volume) => {
    if (currentPh >= targetPh) return 0;
    const diff = targetPh - currentPh;
    return (diff * 0.1 * volume).toFixed(1); // returned in kg
  };
  const suggestedLime = calculateLime(sensors.ph, 7.0, pondVolume);

  // Water Exchange Pump Time
  // volume * 1000 = Liters. (Liters * percent) / pumpFlowRate = minutes
  const calculatePumpTime = () => {
    const targetLiters = pondVolume * 1000 * (exchangePercent / 100);
    const minutes = targetLiters / pumpFlowRate;
    return {
      hours: Math.floor(minutes / 60),
      minutes: Math.floor(minutes % 60)
    };
  };
  const pumpTime = calculatePumpTime();

  // --- Status Checks ---
  const getStatus = (val, min, max, criticalMin, criticalMax) => {
    if (val <= criticalMin || val >= criticalMax) return 'critical';
    if (val < min || val > max) return 'warning';
    return 'optimal';
  };

  const statusDO = getStatus(sensors.do, 5.0, 10.0, 3.0, 15.0);
  const statusPH = getStatus(sensors.ph, 6.5, 8.5, 5.5, 9.5);
  const statusTemp = getStatus(sensors.temp, 22, 28, 15, 33);
  const statusNitrite = getStatus(sensors.nitrite, 0, 0.2, -1, 0.5); // max 0.5 is critical

  // Recommendations Engine
  const getRecommendations = () => {
    const recs = [];
    if (statusDO === 'critical') recs.push("EMERGENCY: DO is critically low! Immediately activate all paddlewheel aerators and cease feeding.");
    else if (statusDO === 'warning') recs.push("DO is dropping. Consider turning on backup aerators, especially at night.");

    if (uiaToxic) recs.push("TOXICITY ALERT: Un-ionized Ammonia (UIA) exceeds safe limits! Perform immediate 30% water exchange and halt feeding.");
    else if (sensors.tan > 2.0) recs.push("Total Ammonia is high. Add bio-filter bacteria and reduce feeding by 50%.");

    if (sensors.ph < 6.0) recs.push(`pH is dangerously acidic. Consider adding ${suggestedLime}kg of agricultural lime.`);
    
    if (statusNitrite === 'critical') recs.push("Nitrite toxicity! Add pond salt (chlorides) immediately to block nitrite uptake in fish gills.");
    
    if (recs.length === 0) recs.push("Water parameters are stable. No immediate actions required.");
    return recs;
  };

  const recommendations = getRecommendations();

  // Reusable Parameter Card
  const ParameterCard = ({ title, value, unit, icon, status, min, max, step, paramKey, color }) => {
    const statusColors = {
      optimal: 'var(--accent-green)',
      warning: 'var(--accent-purple)', // or orange if available
      critical: 'var(--accent-red)'
    };
    const c = statusColors[status] || color;

    return (
      <div className="card" style={{ border: status === 'critical' ? `1px solid ${c}` : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            {icon}
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{title}</span>
          </div>
          <span style={{ 
            fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold',
            background: `${c}22`, color: c, textTransform: 'uppercase'
          }}>
            {status}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
          <span style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{value.toFixed(2)}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{unit}</span>
        </div>
        <div>
          <input 
            type="range" 
            min={min} max={max} step={step}
            value={value}
            onChange={(e) => setSensors({...sensors, [paramKey]: parseFloat(e.target.value)})}
            style={{ width: '100%', accentColor: c }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Simulate Low</span>
            <span>Simulate High</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-content water-sensors-page" style={{ paddingBottom: '40px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div className="dashboard-title">
          <h1>Water Chemistry & Sensors</h1>
          <p>Real-time telemetry, toxicity calculators, and automated treatment regimens.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="action-btn" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'white', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Settings size={16} /> Configure Probes
          </button>
          <button className="action-btn" style={{ background: 'var(--accent-cyan)', color: 'black', fontWeight: '600', display: 'flex', gap: '6px', alignItems: 'center', border: 'none' }}>
            <RefreshCw size={16} /> Sync Telemetry
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Live Gauges & Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card-header" style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={20} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ fontSize: '15px', color: 'white', margin: 0 }}>Active Probe Network: Pond A1</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Last synced: 2 seconds ago. Sliders enabled for simulation.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <ParameterCard title="Dissolved Oxygen" value={sensors.do} unit="mg/L" icon={<Wind size={18}/>} status={statusDO} min="0" max="12" step="0.1" paramKey="do" color="var(--accent-cyan)" />
            <ParameterCard title="pH Level" value={sensors.ph} unit="pH" icon={<FlaskConical size={18}/>} status={statusPH} min="4" max="10" step="0.1" paramKey="ph" color="var(--accent-purple)" />
            <ParameterCard title="Temperature" value={sensors.temp} unit="°C" icon={<Thermometer size={18}/>} status={statusTemp} min="10" max="35" step="0.5" paramKey="temp" color="var(--accent-red)" />
            <ParameterCard title="Total Ammonia (TAN)" value={sensors.tan} unit="mg/L" icon={<Beaker size={18}/>} status={sensors.tan > 2 ? 'critical' : sensors.tan > 0.5 ? 'warning' : 'optimal'} min="0" max="5" step="0.1" paramKey="tan" color="var(--accent-green)" />
            <ParameterCard title="Nitrite (NO2)" value={sensors.nitrite} unit="mg/L" icon={<Droplet size={18}/>} status={statusNitrite} min="0" max="2" step="0.05" paramKey="nitrite" color="var(--accent-blue)" />
            <ParameterCard title="Salinity" value={sensors.salinity} unit="ppt" icon={<Waves size={18}/>} status={sensors.salinity > 15 ? 'warning' : 'optimal'} min="0" max="35" step="1" paramKey="salinity" color="var(--text-secondary)" />
          </div>

          {/* Corrective Actions Engine */}
          <div className="card" style={{ border: '1px solid var(--accent-cyan)' }}>
            <div className="card-header" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--accent-cyan)" />
              <h3 className="card-title">Automated Action Engine</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.map((rec, idx) => {
                const isCrit = rec.includes('EMERGENCY') || rec.includes('TOXICITY');
                return (
                  <div key={idx} style={{ 
                    padding: '12px 16px', 
                    background: isCrit ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.05)', 
                    borderLeft: `4px solid ${isCrit ? 'var(--accent-red)' : 'var(--accent-green)'}`,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    {isCrit ? <AlertTriangle size={18} color="var(--accent-red)"/> : <CheckCircle size={18} color="var(--accent-green)"/>}
                    <span style={{ fontSize: '13px', color: isCrit ? '#ffb3b3' : 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {rec}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Calculators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* UIA Toxicity Calculator */}
          <div className="card" style={{ background: uiaToxic ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-surface)', border: uiaToxic ? '1px solid var(--accent-red)' : '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FlaskConical size={18} color={uiaToxic ? "var(--accent-red)" : "var(--accent-green)"}/>
                UIA Toxicity Engine
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              Total Ammonia Nitrogen (TAN) isn't the full picture. The toxic fraction (Un-ionized Ammonia, NH3) increases rapidly as pH and Temperature rise.
            </p>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Input: pH ({sensors.ph})</span>
                <span>Input: Temp ({sensors.temp}°C)</span>
                <span>Input: TAN ({sensors.tan})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Calculated Toxic NH3:</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: uiaToxic ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                  {uia.toFixed(3)} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>mg/L</span>
                </span>
              </div>
            </div>
            {uiaToxic ? (
              <div style={{ fontSize: '12px', color: '#ffb3b3', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }}/>
                Lethal limits exceeded (&gt;0.05 mg/L). Fish gill damage is actively occurring.
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--accent-green)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <CheckCircle size={14} /> Toxicity is below stressful thresholds.
              </div>
            )}
          </div>

          {/* Water Exchange & Volume Tools */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={18} color="var(--accent-cyan)"/> 
                Water Exchange Estimator
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pond Volume ($m^3$)</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{pondVolume} $m^3$ ({pondVolume * 1000} L)</span>
                </label>
                <input 
                  type="range" min="10" max="5000" step="10" 
                  value={pondVolume} onChange={(e) => setPondVolume(Number(e.target.value))}
                  style={{ accentColor: 'var(--accent-cyan)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Target Exchange %</span>
                  <span style={{ color: 'var(--accent-purple)' }}>{exchangePercent}%</span>
                </label>
                <input 
                  type="range" min="5" max="100" step="5" 
                  value={exchangePercent} onChange={(e) => setExchangePercent(Number(e.target.value))}
                  style={{ accentColor: 'var(--accent-purple)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pump Flow Rate</span>
                  <span>{pumpFlowRate} L/min</span>
                </label>
                <input 
                  type="range" min="100" max="5000" step="100" 
                  value={pumpFlowRate} onChange={(e) => setPumpFlowRate(Number(e.target.value))}
                  style={{ accentColor: 'var(--text-secondary)' }}
                />
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated Pump Runtime</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Clock size={20} color="var(--accent-cyan)" />
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                  {pumpTime.hours > 0 && `${pumpTime.hours}h `}{pumpTime.minutes}m
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                Required to exchange {exchangePercent}% ({(pondVolume * 1000 * (exchangePercent / 100)).toLocaleString()} Liters) of the pond volume.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default WaterSensorsPage;
