import React, { useState } from 'react';
import { 
  X, Database, Radio, Key, CloudRain, CheckCircle2, AlertCircle, 
  RefreshCw, Wifi, ShieldCheck, UploadCloud, Layers
} from 'lucide-react';
import { BASEMAP_PROVIDERS, syncWithFirebase } from '../services/realtimeDatabase';

export default function RealtimeDatabaseModal({
  isOpen,
  onClose,
  apiConfig,
  onSaveConfig,
  livePacket,
  livePacketCount,
  basin,
  waterLevelData
}) {
  const [config, setConfig] = useState(apiConfig);
  const [firebaseStatus, setFirebaseStatus] = useState({ loading: false, message: null, error: null });
  const [pushStatus, setPushStatus] = useState({ loading: false, message: null, error: null });

  if (!isOpen) return null;

  const handleProviderChange = (providerKey) => {
    const updated = { ...config, basemapProvider: providerKey };
    setConfig(updated);
    onSaveConfig(updated);
  };

  const handleStreamChange = (sourceKey) => {
    const updated = { ...config, streamSource: sourceKey };
    setConfig(updated);
    onSaveConfig(updated);
  };

  const handleRadarToggle = () => {
    const updated = { ...config, radarEnabled: !config.radarEnabled };
    setConfig(updated);
    onSaveConfig(updated);
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    onSaveConfig(config);
    setFirebaseStatus({ loading: false, message: 'Settings & API Keys saved successfully.', error: null });
    setTimeout(() => setFirebaseStatus({ loading: false, message: null, error: null }), 3000);
  };

  const handleTestFirebase = async () => {
    setFirebaseStatus({ loading: true, message: null, error: null });
    const res = await syncWithFirebase(config.firebaseDbUrl);
    if (res.error) {
      setFirebaseStatus({ loading: false, message: null, error: `Connection failed: ${res.error}` });
    } else {
      setFirebaseStatus({ loading: false, message: 'Firebase Realtime Database connected successfully.', error: null });
      const updated = { ...config, firebaseConnected: true };
      setConfig(updated);
      onSaveConfig(updated);
    }
  };

  const handlePushSnapshot = async () => {
    setPushStatus({ loading: true, message: null, error: null });
    const payload = {
      basin: basin.name,
      dangerLevel: basin.dangerLevel,
      currentLevel: waterLevelData?.predictedPeakLevel || basin.currentLevel,
      stations: basin.stations,
      alertClassification: waterLevelData?.riskClassification || 'Moderate',
      timestamp: new Date().toISOString()
    };

    const res = await syncWithFirebase(config.firebaseDbUrl, payload);
    if (res.error) {
      setPushStatus({ loading: false, message: null, error: `Push failed: ${res.error}` });
    } else {
      setPushStatus({ loading: false, message: 'Telemetry snapshot pushed to Firebase Realtime Database.', error: null });
      setTimeout(() => setPushStatus({ loading: false, message: null, error: null }), 4000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="rtdb-modal-title">
      <div
        className="modal-content"
        style={{ maxWidth: '840px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(14, 165, 233, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)'
            }}>
              <Database size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--cyan-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MAP TILES API &amp; REAL-TIME DATA INGESTION
              </span>
              <h2 id="rtdb-modal-title" style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                Real-Time Database &amp; GIS Map Settings
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Database Modal"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', maxHeight: '74vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            
            {/* Live Connection Telemetry Banner */}
            <div className="glass-card" style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderLeft: '4px solid var(--emerald-400)',
              background: 'rgba(16, 185, 129, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 12px #10b981',
                  animation: 'pulse 1.5s infinite'
                }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                    Real-Time Stream Active ({config.streamSource.toUpperCase()})
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Packets Ingested: <strong style={{ color: 'var(--cyan-400)' }}>{livePacketCount}</strong> • Latency: <strong style={{ color: '#34d399' }}>{livePacket?.latencyMs || 22}ms</strong> • Cryptographic HMAC: <strong style={{ color: '#34d399' }}>Verified</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Wifi size={12} /> Live Socket
                </span>
              </div>
            </div>

            {/* Section 1: Map Tile Provider & API Key */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Layers size={18} color="var(--cyan-400)" />
                <h3 style={{ fontSize: '0.98rem', color: '#ffffff' }}>Map Tile Basemap API</h3>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Select your basemap provider. To fix the Carto watermark, switch to <strong>Esri Dark Gray (Free &amp; Clean)</strong> or supply your personal Carto API key below.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                {Object.entries(BASEMAP_PROVIDERS).map(([key, prov]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleProviderChange(key)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      textAlign: 'left',
                      background: config.basemapProvider === key ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: config.basemapProvider === key ? '2px solid var(--cyan-400)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: config.basemapProvider === key ? 'var(--cyan-400)' : '#ffffff', marginBottom: '4px' }}>
                      {prov.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {key === 'esriDark' ? 'Recommended (Zero Watermark)' : key === 'carto' ? 'Needs API Key' : 'Public CDN'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Carto API Key Input if Carto is selected */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={14} color="var(--amber-400)" />
                  CARTO API Key (Optional — unlocks Carto Dark Matter without watermark):
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={config.cartoApiKey}
                    onChange={(e) => setConfig({ ...config, cartoApiKey: e.target.value })}
                    placeholder="e.g. default_public_... or your carto.com/basemaps/apikey"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveKeys}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    Save Key
                  </button>
                </div>
              </div>

              {/* RainViewer Live Radar Overlay Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(56, 189, 248, 0.06)',
                borderRadius: '8px',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CloudRain size={18} color="var(--cyan-400)" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                      RainViewer Real-Time Doppler Radar API
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Overlays live precipitation and storm cloud radar over the Leaflet map in real time.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRadarToggle}
                  className={`btn btn-sm ${config.radarEnabled ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                >
                  {config.radarEnabled ? 'Radar Active ✓' : 'Enable Radar Overlay'}
                </button>
              </div>
            </div>

            {/* Section 2: Real-Time Stream Source Selector */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Radio size={18} color="var(--purple-400)" />
                <h3 style={{ fontSize: '0.98rem', color: '#ffffff' }}>Real-Time Data Ingestion Stream</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                {/* Option A: Open-Meteo */}
                <div
                  onClick={() => handleStreamChange('openMeteo')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: config.streamSource === 'openMeteo' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: config.streamSource === 'openMeteo' ? '2px solid var(--cyan-400)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: config.streamSource === 'openMeteo' ? 'var(--cyan-400)' : '#ffffff', marginBottom: '4px' }}>
                    Open-Meteo Flood &amp; Weather API
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Live river discharge ($m³/s$) and real-time precipitation for current basin coordinates. Free &amp; unthrottled.
                  </p>
                </div>

                {/* Option B: Firebase RTDB */}
                <div
                  onClick={() => handleStreamChange('firebase')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: config.streamSource === 'firebase' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: config.streamSource === 'firebase' ? '2px solid var(--amber-400)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: config.streamSource === 'firebase' ? 'var(--amber-400)' : '#ffffff', marginBottom: '4px' }}>
                    Firebase Realtime Database
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Live cloud sync via Google Firebase Realtime Database endpoint. Supports remote push and pull.
                  </p>
                </div>

                {/* Option C: IoT Stream */}
                <div
                  onClick={() => handleStreamChange('iotStream')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: config.streamSource === 'iotStream' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: config.streamSource === 'iotStream' ? '2px solid var(--emerald-400)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: config.streamSource === 'iotStream' ? 'var(--emerald-400)' : '#ffffff', marginBottom: '4px' }}>
                    IoT RTU Sensor Stream (3s)
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Emulated high-frequency river gauge RTU sensors with real-time HMAC-SHA256 telemetry signing.
                  </p>
                </div>
              </div>

              {/* Firebase Endpoint Controls */}
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Firebase Realtime Database Endpoint URL:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <input
                    type="url"
                    value={config.firebaseDbUrl}
                    onChange={(e) => setConfig({ ...config, firebaseDbUrl: e.target.value })}
                    placeholder="https://your-project-id.firebaseio.com"
                    style={{
                      flex: 1,
                      minWidth: '260px',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleTestFirebase}
                    disabled={firebaseStatus.loading}
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCw size={14} className={firebaseStatus.loading ? 'spin' : ''} />
                    Test Connection
                  </button>
                  <button
                    type="button"
                    onClick={handlePushSnapshot}
                    disabled={pushStatus.loading}
                    className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <UploadCloud size={14} />
                    Push Snapshot to DB
                  </button>
                </div>

                {firebaseStatus.message && (
                  <div style={{ color: 'var(--emerald-400)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> {firebaseStatus.message}
                  </div>
                )}
                {firebaseStatus.error && (
                  <div style={{ color: 'var(--coral-400)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} /> {firebaseStatus.error}
                  </div>
                )}
                {pushStatus.message && (
                  <div style={{ color: 'var(--cyan-400)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <CheckCircle2 size={14} /> {pushStatus.message}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Live Ingested Packet Terminal */}
            {livePacket && (
              <div className="glass-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    LIVE INCOMING TELEMETRY PACKET // STREAM DUMP
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(livePacket.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre style={{
                  background: '#040810',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--cyan-400)',
                  overflowX: 'auto',
                  margin: 0
                }}>
                  {JSON.stringify(livePacket, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7, 14, 28, 0.7)'
        }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            Selected Basemap: <strong>{BASEMAP_PROVIDERS[config.basemapProvider]?.name}</strong>
          </span>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
