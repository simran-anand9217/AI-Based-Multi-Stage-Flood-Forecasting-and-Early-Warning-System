import React from 'react';
import { 
  Waves, 
  ShieldAlert, 
  Cpu, 
  MapPin, 
  Clock, 
  FileText, 
  Lock, 
  Volume2, 
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { USER_ROLES } from '../services/securityEngine';

export default function Navbar({
  selectedBasin,
  setSelectedBasin,
  basins,
  timeHorizon,
  setTimeHorizon,
  userRole,
  setUserRole,
  onOpenSynopsis,
  onOpenSecurity,
  onOpenEvaluation,
  onOpenAlert,
  riskAssessment
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 14, 28, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Top Banner: Alert Ticker */}
      <div style={{
        background: riskAssessment.classification === 'High' 
          ? 'linear-gradient(90deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))'
          : 'linear-gradient(90deg, rgba(14,165,233,0.15), rgba(16,185,129,0.05))',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '6px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`badge ${riskAssessment.classification === 'High' ? 'badge-coral' : 'badge-cyan'}`}>
            <span className={`pulse-dot ${riskAssessment.classification === 'High' ? 'pulse-dot-red' : 'pulse-dot-green'}`}></span>
            STAGE 6 // EARLY WARNING STATUS: {riskAssessment.classification.toUpperCase()} RISK
          </span>
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            {selectedBasin.name} — Projected Peak: {riskAssessment.score}/100 Vulnerability Index
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} style={{ color: 'var(--cyan-400)' }} />
            Monsoon Real-Time Telemetry Feed: Active
          </span>
          <span className="mono" style={{ color: 'var(--cyan-400)', fontSize: '0.75rem' }}>
            NODE STATUS: 100% OPERATIONAL
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)'
          }}>
            <Waves size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                HYDRO<span style={{ color: 'var(--cyan-400)' }}>AI</span> GUARD
              </h1>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                CSE - Cyber Security Mini Project
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Multi-Stage AI Flood Forecasting & Early Warning System • GNIOT / AKTU
            </p>
          </div>
        </div>

        {/* Global Controls: Basin & Horizon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Basin Selector */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
            <MapPin size={15} style={{ color: 'var(--cyan-400)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Basin:</span>
            <select
              value={selectedBasin.id}
              onChange={(e) => setSelectedBasin(basins[e.target.value])}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="baitarani" style={{ background: '#0b1322' }}>Baitarani Basin (Odisha)</option>
              <option value="yamunaHindon" style={{ background: '#0b1322' }}>Yamuna-Hindon (Greater Noida/NCR)</option>
              <option value="customSimulator" style={{ background: '#0b1322' }}>Custom Simulation Sandbox</option>
            </select>
          </div>

          {/* Time Horizon Selector (1h, 6h, 12h, 24h as per Synopsis) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', padding: '0 8px' }}>Horizon:</span>
            {['1h', '6h', '12h', '24h'].map((h) => (
              <button
                key={h}
                onClick={() => setTimeHorizon(h)}
                style={{
                  background: timeHorizon === h ? 'var(--cyan-500)' : 'transparent',
                  color: timeHorizon === h ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Role Switcher */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px' }}>
            <UserCheck size={14} style={{ color: 'var(--purple-400)' }} />
            <select
              value={userRole.id}
              onChange={(e) => setUserRole(USER_ROLES[e.target.value])}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                fontSize: '0.78rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="CITIZEN" style={{ background: '#0b1322' }}>Citizen Portal</option>
              <option value="OFFICER" style={{ background: '#0b1322' }}>Disaster Response Officer</option>
              <option value="ADMIN" style={{ background: '#0b1322' }}>ML & Cyber Admin</option>
            </select>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={onOpenSynopsis} className="btn btn-outline btn-sm">
            <FileText size={14} style={{ color: 'var(--cyan-400)' }} />
            Synopsis & Guide
          </button>

          <button onClick={onOpenSecurity} className="btn btn-outline btn-sm">
            <Lock size={14} style={{ color: 'var(--emerald-400)' }} />
            Cyber Security
          </button>

          <button onClick={onOpenEvaluation} className="btn btn-outline btn-sm">
            <Cpu size={14} style={{ color: 'var(--purple-400)' }} />
            ML Metrics & Retrain
          </button>

          <button 
            onClick={onOpenAlert} 
            className={`btn btn-sm ${riskAssessment.classification === 'High' ? 'btn-danger' : 'btn-primary'}`}
          >
            <ShieldAlert size={15} />
            Early Warning Hub
          </button>
        </div>
      </div>
    </header>
  );
}
