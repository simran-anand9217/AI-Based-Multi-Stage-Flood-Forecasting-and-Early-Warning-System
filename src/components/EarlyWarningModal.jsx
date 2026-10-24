import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Send, 
  Radio, 
  PhoneCall, 
  CheckCircle, 
  Lock, 
  Share2 
} from 'lucide-react';
import { signEmergencyAlert } from '../services/securityEngine';

export default function EarlyWarningModal({
  isOpen,
  onClose,
  riskAssessment,
  basin,
  waterLevelData
}) {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [signedAlert, setSignedAlert] = useState(null);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      signEmergencyAlert({
        alertId: `CAP-FLD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        basinName: basin.name,
        riskLevel: riskAssessment.classification,
        timestamp: new Date().toISOString()
      }).then(res => setSignedAlert(res));
    } else {
      stopSiren();
    }
  }, [isOpen, basin, riskAssessment]);

  // Web Audio API Emergency Siren Synthesizer
  const toggleSiren = () => {
    if (sirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.15; // Safe volume

      osc.type = 'sawtooth';
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      let freq = 650;
      let goingUp = true;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.start();
      oscillatorRef.current = osc;

      intervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        if (goingUp) {
          freq += 40;
          if (freq >= 950) goingUp = false;
        } else {
          freq -= 40;
          if (freq <= 550) goingUp = true;
        }
        osc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.05);
      }, 50);

      setSirenPlaying(true);
    } catch (e) {
      console.warn('AudioContext not allowed or supported', e);
    }
  };

  const stopSiren = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    oscillatorRef.current = null;
    audioCtxRef.current = null;
    setSirenPlaying(false);
  };

  const handleSimulateBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: riskAssessment.classification === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: riskAssessment.classification === 'High' ? 'var(--coral-500)' : 'var(--cyan-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(239, 68, 68, 0.5)'
            }}>
              <ShieldAlert size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                STAGE 6 // EARLY WARNING & DISASTER ALERT HUB
              </span>
              <h2 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                {riskAssessment.classification.toUpperCase()} FLOOD ALERT PROTOCOL
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

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Audio Siren Banner */}
          <div className="glass-card" style={{
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: sirenPlaying ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 31, 62, 0.5)',
            border: sirenPlaying ? '1px solid var(--coral-500)' : '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: sirenPlaying ? 'var(--coral-500)' : 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: sirenPlaying ? 'pulse 1s infinite' : 'none'
              }}>
                {sirenPlaying ? <Volume2 size={18} color="#fff" /> : <VolumeX size={18} color="var(--text-muted)" />}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  Acoustic Disaster Siren Simulator
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Synthesized emergency alert warble for community public address audio towers
                </div>
              </div>
            </div>

            <button
              onClick={toggleSiren}
              className={`btn btn-sm ${sirenPlaying ? 'btn-danger' : 'btn-outline'}`}
            >
              {sirenPlaying ? 'Silence Siren' : 'Test Acoustic Siren'}
            </button>
          </div>

          {/* CAP Standard Message Container */}
          <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--cyan-400)', fontWeight: 600 }}>
                COMMON ALERTING PROTOCOL (CAP v1.2 SPECIFICATION)
              </span>
              {signedAlert && (
                <span style={{ fontSize: '0.7rem', color: 'var(--emerald-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} />
                  Signed by {signedAlert.signedBy.split('&')[0]}
                </span>
              )}
            </div>

            <div style={{
              background: '#040914',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              border: '1px solid var(--border-subtle)'
            }}>
              <p><strong>URGENT FLOOD BULLETIN:</strong> {basin.name.toUpperCase()} BASIN</p>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Hydrological models indicate river stage is projected to reach <strong>{waterLevelData.predictedLevel}m</strong>, 
                breaching safety thresholds. Inundation is expected within downstream lowlands with estimated velocity of <strong>{basin.stations[0]?.flowVelocity || 2.4} m/s</strong>.
              </p>
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '16px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                <span>Urgency: Immediate</span>
                <span>Severity: {riskAssessment.classification === 'High' ? 'Severe' : 'Moderate'}</span>
                <span>Certainty: Observed / AI Forecasted</span>
              </div>
            </div>

            {/* Cryptographic Seal */}
            {signedAlert && (
              <div style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span className="mono">Digest: {signedAlert.digitalSignature}</span>
                <span style={{ color: 'var(--cyan-400)' }}>Secured via CSE PKI Subsystem</span>
              </div>
            )}
          </div>

          {/* Action Grid: Evacuation & Helplines */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* Checklist */}
            <div className="glass-card" style={{ padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} color="var(--emerald-400)" />
                Citizen Preparedness Checklist
              </h4>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'none' }}>
                <li>✓ Disconnect main electrical breaker and gas cylinders</li>
                <li>✓ Elevate critical medications, documents & potable water</li>
                <li>✓ Evacuate designated floodplain sectors to nearest shelter</li>
                <li>✓ Do not attempt to drive or wade across flooded spillways</li>
              </ul>
            </div>

            {/* Hotlines */}
            <div className="glass-card" style={{ padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneCall size={15} color="var(--cyan-400)" />
                Emergency Hotline Dispatch
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>NDRF Central Helpline:</span>
                  <strong className="mono" style={{ color: 'var(--cyan-400)' }}>1078</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>State Disaster (SDMA):</span>
                  <strong className="mono" style={{ color: 'var(--cyan-400)' }}>1070</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Ambulance & Medical SOS:</span>
                  <strong className="mono" style={{ color: 'var(--emerald-400)' }}>108</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>District Control Room:</span>
                  <strong className="mono" style={{ color: '#ffffff' }}>112</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Broadcast Trigger Button */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={handleSimulateBroadcast}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              {broadcastSent ? (
                <>
                  <CheckCircle size={16} />
                  CAP Emergency Broadcast Dispatched to 14,200 Registered Citizens & Cell Towers
                </>
              ) : (
                <>
                  <Radio size={16} />
                  Broadcast Signed CAP Alert via SMS, Cell Broadcast & Siren Grid
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
