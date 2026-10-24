import React from 'react';
import { 
  CloudRain, 
  TrendingUp, 
  Compass, 
  AlertOctagon, 
  Wind, 
  Layers, 
  Gauge, 
  Activity,
  Droplets,
  Clock
} from 'lucide-react';

export default function StageCards({
  rainfallData,
  waterLevelData,
  waterBehaviour,
  riskAssessment,
  timeHorizon,
  modelType,
  setModelType
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Stage 1: Rainfall Prediction */}
      <div className="glass-panel" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CloudRain size={18} color="var(--cyan-400)" />
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                STAGE 1 // AI METEOROLOGY
              </span>
              <h3 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Rainfall Prediction</h3>
            </div>
          </div>
          <span className={`badge ${rainfallData.category.color === 'coral' ? 'badge-coral' : 'badge-cyan'}`}>
            {rainfallData.category.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {rainfallData.forecasts[timeHorizon]}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>mm ({timeHorizon} forecast)</span>
        </div>

        {/* Breakdown parameters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
          <div className="glass-card" style={{ padding: '8px 10px' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Atmospheric Instability</span>
            <span className="mono" style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>{rainfallData.capeProxy} J/kg (CAPE)</span>
          </div>
          <div className="glass-card" style={{ padding: '8px 10px' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Moisture Flux Index</span>
            <span className="mono" style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>{rainfallData.moistureIndex} / 10.0</span>
          </div>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>Radar Reflectivity: 48 dBZ</span>
          <span style={{ color: 'var(--emerald-400)' }}>Confidence: {rainfallData.confidence}%</span>
        </div>
      </div>

      {/* Stage 2: River Water-Level Prediction */}
      <div className="glass-panel" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: waterLevelData.status === 'danger'
            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
            : 'linear-gradient(90deg, #3b82f6, #6366f1)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={18} color="var(--blue-500)" />
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                STAGE 2 // HYDROLOGICAL MODEL
              </span>
              <h3 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Water-Level Forecast</h3>
            </div>
          </div>

          {/* Model selector dropdown */}
          <select
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              color: 'var(--cyan-400)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="TFT">TFT (Temporal Fusion)</option>
            <option value="LSTM">Bi-LSTM Network</option>
            <option value="CNN">1D-CNN Sequence</option>
            <option value="RF">Random Forest</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {waterLevelData.predictedLevel}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>meters</span>
          <span style={{
            fontSize: '0.75rem',
            marginLeft: 'auto',
            color: waterLevelData.marginToDanger <= 0 ? 'var(--coral-400)' : 'var(--amber-400)',
            fontWeight: 700
          }}>
            {waterLevelData.marginToDanger <= 0 
              ? `BREACHED (+${Math.abs(waterLevelData.marginToDanger).toFixed(2)}m)`
              : `Danger Margin: ${waterLevelData.marginToDanger}m`}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
          <div className="glass-card" style={{ padding: '8px 10px' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Danger Threshold</span>
            <span className="mono" style={{ color: 'var(--coral-400)', fontWeight: 600 }}>{waterLevelData.dangerLevel} m</span>
          </div>
          <div className="glass-card" style={{ padding: '8px 10px' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Projected Discharge</span>
            <span className="mono" style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>{waterLevelData.projectedDischarge.toLocaleString()} m³/s</span>
          </div>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>Current Gauge: {waterLevelData.currentLevel}m</span>
          <span style={{ color: 'var(--cyan-400)' }}>Model Accuracy: {waterLevelData.modelAccuracy}%</span>
        </div>
      </div>

      {/* Stage 3: Water Behaviour Analysis */}
      <div className="glass-panel" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #10b981, #06b6d4)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass size={18} color="var(--emerald-400)" />
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                STAGE 3 // HYDRODYNAMICS
              </span>
              <h3 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Water Behaviour</h3>
            </div>
          </div>
          <span className="badge badge-emerald">
            {waterBehaviour.compassDirection}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {waterBehaviour.flowVelocity}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>m/s flow velocity</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
          <div className="glass-card" style={{ padding: '8px 10px' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Inundation Spread</span>
            <span className="mono" style={{ color: 'var(--amber-400)', fontWeight: 600 }}>~{waterBehaviour.estimatedSpreadAreaKm2} sq.km</span>
          </div>
          <div className="glass-card" style={{ padding: '8px 10px' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Downstream Wave ETA</span>
            <span className="mono" style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>{waterBehaviour.downstreamArrivalTimeMinutes} mins</span>
          </div>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>Manning's n: {waterBehaviour.manningsN}</span>
          <span>Flow Azimuth: {waterBehaviour.flowAzimuth}°</span>
        </div>
      </div>

      {/* Stage 4: Flood Risk Assessment */}
      <div className="glass-panel" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: riskAssessment.classification === 'High'
            ? 'linear-gradient(90deg, #ef4444, #f43f5e)'
            : riskAssessment.classification === 'Medium'
            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
            : 'linear-gradient(90deg, #10b981, #34d399)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: riskAssessment.classification === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertOctagon size={18} color={riskAssessment.classification === 'High' ? 'var(--coral-400)' : 'var(--amber-400)'} />
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                STAGE 4 // RISK CLASSIFIER
              </span>
              <h3 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Flood Risk Index</h3>
            </div>
          </div>
          <span className={`badge ${riskAssessment.badgeColor === 'coral' ? 'badge-coral' : riskAssessment.badgeColor === 'amber' ? 'badge-amber' : 'badge-emerald'}`}>
            <span className={`pulse-dot ${riskAssessment.badgeColor === 'coral' ? 'pulse-dot-red' : 'pulse-dot-amber'}`}></span>
            {riskAssessment.classification.toUpperCase()} RISK
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {riskAssessment.score}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>/ 100 Multi-Criteria Score</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
          <div className="glass-card" style={{ padding: '6px 8px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Hazard</span>
            <span className="mono" style={{ color: 'var(--coral-400)', fontWeight: 700 }}>{riskAssessment.breakdown.hazard}/40</span>
          </div>
          <div className="glass-card" style={{ padding: '6px 8px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Exposure</span>
            <span className="mono" style={{ color: 'var(--amber-400)', fontWeight: 700 }}>{riskAssessment.breakdown.exposure}/30</span>
          </div>
          <div className="glass-card" style={{ padding: '6px 8px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Vulnerability</span>
            <span className="mono" style={{ color: 'var(--cyan-400)', fontWeight: 700 }}>{riskAssessment.breakdown.vulnerability}/30</span>
          </div>
        </div>

        <div style={{ marginTop: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-main)' }}>Protocol:</strong> {riskAssessment.recommendedAction}
        </div>
      </div>
    </div>
  );
}
