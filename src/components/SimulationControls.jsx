import React from 'react';
import { Sliders, RotateCcw, Zap, CloudLightning, ShieldAlert, Droplets } from 'lucide-react';

export default function SimulationControls({
  simParams,
  setSimParams,
  onReset
}) {
  const applyPreset = (presetName) => {
    if (presetName === 'normal') {
      setSimParams({
        rainfallIntensity: 1.0,
        upstreamDischargeMultiplier: 1.0,
        soilSaturation: 0.70,
        manningsN: 0.035
      });
    } else if (presetName === 'cloudburst') {
      setSimParams({
        rainfallIntensity: 2.2,
        upstreamDischargeMultiplier: 1.3,
        soilSaturation: 0.92,
        manningsN: 0.035
      });
    } else if (presetName === 'damRelease') {
      setSimParams({
        rainfallIntensity: 1.4,
        upstreamDischargeMultiplier: 2.2,
        soilSaturation: 0.85,
        manningsN: 0.032
      });
    } else if (presetName === 'worstCase') {
      setSimParams({
        rainfallIntensity: 2.8,
        upstreamDischargeMultiplier: 2.4,
        soilSaturation: 0.98,
        manningsN: 0.038
      });
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
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
            <Sliders size={18} color="var(--cyan-400)" />
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              HYDROLOGICAL SANDBOX // WHAT-IF SIMULATOR
            </span>
            <h3 style={{ fontSize: '1rem', color: '#ffffff' }}>Environmental Stress Testing</h3>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Presets:</span>
          <button
            onClick={() => applyPreset('normal')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.72rem' }}
          >
            Normal Monsoon
          </button>
          <button
            onClick={() => applyPreset('cloudburst')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.72rem', borderColor: 'var(--cyan-400)' }}
          >
            <CloudLightning size={12} color="#38bdf8" />
            Cloudburst
          </button>
          <button
            onClick={() => applyPreset('damRelease')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.72rem', borderColor: 'var(--amber-400)' }}
          >
            <Droplets size={12} color="#fbbf24" />
            Dam Spillway Surge
          </button>
          <button
            onClick={() => applyPreset('worstCase')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.72rem', borderColor: 'var(--coral-500)', color: 'var(--coral-400)' }}
          >
            <ShieldAlert size={12} color="#ef4444" />
            Maximum Probable Flood
          </button>
          <button
            onClick={onReset}
            className="btn btn-outline btn-sm"
            style={{ padding: '4px 8px' }}
            title="Reset to defaults"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        {/* Slider 1: Rainfall Intensity */}
        <div className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Rainfall Multiplier</span>
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--cyan-400)', fontWeight: 700 }}>
              {simParams.rainfallIntensity}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={simParams.rainfallIntensity}
            onChange={(e) => setSimParams({ ...simParams, rainfallIntensity: parseFloat(e.target.value) })}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            <span>0.5x (Drizzle)</span>
            <span>3.0x (Extreme Cloudburst)</span>
          </div>
        </div>

        {/* Slider 2: Upstream Dam Discharge */}
        <div className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Upstream Inflow / Dam Release</span>
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--amber-400)', fontWeight: 700 }}>
              {simParams.upstreamDischargeMultiplier}x
            </span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.5"
            step="0.1"
            value={simParams.upstreamDischargeMultiplier}
            onChange={(e) => setSimParams({ ...simParams, upstreamDischargeMultiplier: parseFloat(e.target.value) })}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            <span>0.8x (Controlled)</span>
            <span>2.5x (Spillway Breach)</span>
          </div>
        </div>

        {/* Slider 3: Soil Saturation Index */}
        <div className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Soil Moisture Saturation</span>
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--emerald-400)', fontWeight: 700 }}>
              {Math.round(simParams.soilSaturation * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.98"
            step="0.02"
            value={simParams.soilSaturation}
            onChange={(e) => setSimParams({ ...simParams, soilSaturation: parseFloat(e.target.value) })}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            <span>20% (Dry Substrate)</span>
            <span>98% (Zero Infiltration)</span>
          </div>
        </div>

        {/* Slider 4: Manning's Roughness Coefficient */}
        <div className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Channel Manning's (n)</span>
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--purple-400)', fontWeight: 700 }}>
              {simParams.manningsN}
            </span>
          </div>
          <input
            type="range"
            min="0.020"
            max="0.055"
            step="0.002"
            value={simParams.manningsN}
            onChange={(e) => setSimParams({ ...simParams, manningsN: parseFloat(e.target.value) })}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            <span>0.020 (Smooth Canal)</span>
            <span>0.055 (Heavily Vegetated)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
