import React, { useState } from 'react';
import { X, Lock, ShieldAlert, ShieldCheck, Key, Terminal, AlertTriangle, Bug } from 'lucide-react';
import { verifySensorPacketIntegrity } from '../services/securityEngine';

export default function CyberSecurityPanel({
  isOpen,
  onClose,
  basin,
  userRole
}) {
  const [tamperedNodeId, setTamperedNodeId] = useState(null);
  const [verificationResults, setVerificationResults] = useState({});
  const [securityLogs, setSecurityLogs] = useState([
    { time: '18:14:02', type: 'INFO', msg: 'PKI Root Certificate initialized for Basin Telemetry Grid' },
    { time: '18:15:30', type: 'SUCCESS', msg: 'Sensor Node BTR-01 HMAC-SHA256 handshake verified' },
    { time: '18:17:11', type: 'SUCCESS', msg: 'CAP Emergency Message digital signature issued (ECDSA-256)' }
  ]);

  const handleTestTampering = async (station) => {
    const isCurrentlyTampered = tamperedNodeId === station.id;
    const nextTampered = !isCurrentlyTampered;

    setTamperedNodeId(nextTampered ? station.id : null);
    const result = await verifySensorPacketIntegrity(station, nextTampered);

    setVerificationResults(prev => ({
      ...prev,
      [station.id]: result
    }));

    const newLog = {
      time: new Date().toLocaleTimeString(),
      type: nextTampered ? 'CRITICAL' : 'RECOVERED',
      msg: nextTampered
        ? `[ALERT] Cryptographic integrity verification FAILED on node ${station.id}! Spoofed payload quarantined.`
        : `[SECURE] Node ${station.id} telemetry integrity restored and verified.`
    };

    setSecurityLogs(prev => [newLog, ...prev.slice(0, 7)]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '860px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
            }}>
              <Lock size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                TELEMETRY SECURITY &amp; INTEGRITY DEFENSE
              </span>
              <h2 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                IoT Telemetry Cryptographic Integrity & Anti-Spoofing
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Architecture info */}
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            In safety-critical flood warning networks, malicious adversaries may perform <strong>Man-In-The-Middle (MitM) telemetry injection</strong> to forge normal river levels during a catastrophic storm or cause mass hysteria by spoofing artificial flash floods. This system enforces <strong>per-packet HMAC-SHA256 signatures</strong> and PKI alert broadcasts.
          </p>

          {/* Sensor Nodes Security Table */}
          <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={16} color="var(--emerald-400)" />
              Hydrological Station Telemetry Node Verification
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {basin.stations.map((st) => {
                const isTampered = tamperedNodeId === st.id;
                const vResult = verificationResults[st.id];

                return (
                  <div
                    key={st.id}
                    style={{
                      background: isTampered ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                      border: isTampered ? '1px solid var(--coral-500)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>{st.name}</span>
                        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>[{st.id}]</span>
                        <span className={`badge ${isTampered ? 'badge-coral' : 'badge-emerald'}`} style={{ fontSize: '0.65rem' }}>
                          {isTampered ? 'TAMPERED / SPOOFED' : 'CRYPTOGRAPHICALLY VALID'}
                        </span>
                      </div>
                      <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Key: {st.sensorKey} • Reported: {isTampered ? '12.00m (SPOOFED)' : `${st.waterLevel}m`}
                      </div>
                      {isTampered && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--coral-400)', marginTop: '4px', fontWeight: 600 }}>
                          ⚠ Telemetry Digest Mismatch: SHA256 checksum validation failed. Stream quarantined!
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleTestTampering(st)}
                      className={`btn btn-sm ${isTampered ? 'btn-primary' : 'btn-danger'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Bug size={13} />
                      {isTampered ? 'Restore Valid Telemetry' : 'Simulate Packet Spoofing Attack'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Intrusion & Security Terminal Log */}
          <div className="glass-card" style={{ padding: '14px', background: '#02050b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Terminal size={14} color="var(--emerald-400)" />
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--emerald-400)', fontWeight: 600 }}>
                SECURITY EVENT AUDIT LOG [LIVE]
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
              {securityLogs.map((log, idx) => (
                <div key={idx} className="mono" style={{ fontSize: '0.72rem', color: log.type === 'CRITICAL' ? 'var(--coral-400)' : log.type === 'SUCCESS' ? 'var(--emerald-400)' : 'var(--text-muted)' }}>
                  [{log.time}] {log.msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
