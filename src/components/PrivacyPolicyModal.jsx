import React from 'react';
import { X, Shield, Lock, Database, Eye, FileCheck, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title">
      <div
        className="modal-content"
        style={{ maxWidth: '820px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(56, 189, 248, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
              }}
            >
              <Shield size={22} color="#ffffff" aria-hidden="true" />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                LEGAL COMPLIANCE &amp; ETHICAL DATA GOVERNANCE
              </span>
              <h2 id="privacy-modal-title" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                Privacy &amp; Telemetry Data Policy
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Privacy Policy Modal"
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

        {/* Content Body */}
        <div style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Overview Alert */}
            <div
              className="glass-card"
              style={{
                padding: '16px',
                borderLeft: '4px solid var(--cyan-400)',
                background: 'rgba(14, 165, 233, 0.08)'
              }}
            >
              <h4 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={16} color="var(--cyan-400)" />
                Commitment to Transparent, Open Hydrological Data
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                The <strong>HydroAI Guard</strong> platform operates as an advanced hydrological forecasting and disaster early warning system. This policy explains our handling of simulated telemetry, browser state, security logs, and user privacy rights.
              </p>
            </div>

            {/* Section 1: Telemetry Data & Integrity */}
            <div className="glass-card" style={{ padding: '18px' }}>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="var(--emerald-400)" />
                1. Sensor Telemetry &amp; Cryptographic Integrity
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '8px' }}>
                River gauge telemetry and precipitation feeds ingested by HydroAI Guard are subjected to <strong>HMAC-SHA256 signature verification</strong> to detect physical or spoofed replay attacks. No personally identifiable sensor operator data is broadcast across public websockets.
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: 1.6 }}>
                <li>Telemetry timestamps, rainfall (mm), and water levels are treated as open public environmental observations.</li>
                <li>Digital signatures ensure end-to-end provenance from field gauges to the predictive AI model layer.</li>
              </ul>
            </div>

            {/* Section 2: Browser Storage & Analytics */}
            <div className="glass-card" style={{ padding: '18px' }}>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={16} color="var(--cyan-400)" />
                2. Local Storage &amp; Analytics Directives
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '8px' }}>
                This site utilizes client-side local storage exclusively to remember user operational preferences (such as selected river basin, forecast lead time horizon, and active simulation parameters).
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Aggregated, anonymized telemetry (e.g. simulation runs, error frequencies) may be processed via privacy-compliant analytics to improve hydrological predictive accuracy without cross-site tracking or commercial data sales.
              </p>
            </div>

            {/* Section 3: Academic Attribution & Licensing */}
            <div className="glass-card" style={{ padding: '18px' }}>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={16} color="var(--amber-400)" />
                3. Academic Attribution &amp; Disclaimer of Liability
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Forecasts generated by HydroAI Guard are produced by hybrid Machine Learning and hydrodynamic models (TFT, LSTM, Manning flow velocity). While trained on historical CWC (Central Water Commission) and IMD datasets, this platform is an academic engineering decision-support tool. Critical public safety evacuations must always be verified with local State Disaster Management Authorities (SDMA).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(7, 14, 28, 0.7)'
          }}
        >
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            Effective: Operational Cycle 2026-2027
          </span>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.82rem' }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
