import React, { useState } from 'react';
import { X, BookOpen, GraduationCap, Users, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function ProjectSynopsisModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '880px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(56, 189, 248, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
            }}>
              <GraduationCap size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                ACADEMIC MINI PROJECT SYNOPSIS // AUGUST 2026
              </span>
              <h2 style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                AI-Based Multi-Stage Flood Forecasting & Early Warning System
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

        {/* Sub-Nav Tabs */}
        <div style={{
          padding: '8px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '12px',
          background: 'rgba(12, 23, 46, 0.5)'
        }}>
          {[
            { id: 'overview', label: 'Synopsis Overview & Team' },
            { id: 'methodology', label: '8-Stage Methodology' },
            { id: 'objectives', label: 'Project Objectives' },
            { id: 'references', label: 'Literature & References' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--cyan-400)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--cyan-400)' : 'var(--text-muted)',
                padding: '8px 4px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', maxHeight: '65vh', overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <div>
              {/* Institution Banner */}
              <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--cyan-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Greater Noida Institute of Technology (GNIOT), Greater Noida
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Bachelor of Technology in Computer Science & Engineering (Cyber Security) • 2nd Year
                </div>
              </div>

              {/* Team Members & Supervisor */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="glass-card" style={{ padding: '14px 16px' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} color="var(--cyan-400)" />
                    Project Authors / Investigators
                  </h4>
                  <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li><strong>Swati Basliyal</strong> — Roll No: 2501321720060</li>
                    <li><strong>Simran Anand</strong> — Roll No: 2501321720059</li>
                    <li><strong>Ravina Ranjan</strong> — Roll No: 2501321720047</li>
                  </ul>
                </div>

                <div className="glass-card" style={{ padding: '14px 16px' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={16} color="var(--purple-400)" />
                    Faculty Supervisor
                  </h4>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Ms. Arzoo Sorout</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Department of CSE - Cyber Security, GNIOT Greater Noida
                  </div>
                </div>
              </div>

              {/* Synopsis Introduction */}
              <div className="glass-card" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '8px' }}>Project Background & Abstract</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Floods are one of the most common and destructive natural disasters in India, particularly during the monsoon season. Traditional flood monitoring predominantly relies on simple rainfall gauges and predefined river height thresholds without accounting for soil saturation, drainage capacity, and dynamic hydrodynamic flow propagation. This proposed multi-stage system uses AI and deep learning to model the entire flood lifecycle: predicting rainfall, forecasting water stage across 1h, 6h, 12h, and 24h horizons, simulating water behaviour (flow velocity, direction, inundation spread), classifying spatial risk, and issuing cryptographically verified early warnings.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'methodology' && (
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                The core innovation is an 8-stage sequential pipeline replacing traditional monolithic black-box predictors:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { step: 'Step 1: Data Collection', desc: 'Meteorological & hydrological parameters: rainfall, temperature, humidity, river water level, upstream discharge, elevation, soil drainage, and historical flood records.' },
                  { step: 'Step 2: Dataset Preprocessing', desc: 'Outlier detection, temporal alignment, missing value interpolation, and spatial feature normalization.' },
                  { step: 'Step 3: Rainfall Prediction', desc: 'Deep learning models (Bi-LSTM / Transformers) predicting precipitation over multi-hour temporal windows.' },
                  { step: 'Step 4: Water-Level Prediction', desc: 'Forecasting river gauge height by integrating forecasted rainfall, upstream reservoir discharge, and antecedent water level.' },
                  { step: 'Step 5: Water Behaviour Analysis', desc: "Hydrodynamic modeling: flow direction azimuth, Manning's flow velocity (m/s), inundation depth, and spread area (sq. km)." },
                  { step: 'Step 6: Flood Risk Assessment', desc: 'Multi-criteria classification categorizing spatial zones into Low, Medium, or High Risk with associated action protocols.' },
                  { step: 'Step 7: GIS Visualization & Early Warning', desc: 'Interactive geospatial map displaying affected inundation zones, telemetry stations, evacuation centers, and CAP-compliant emergency sirens.' },
                  { step: 'Step 8: Model Evaluation & Updating', desc: 'Continuous online validation using MAE, RMSE, Precision, Recall, F1-score, and automated retraining on streaming observations.' }
                ].map((item, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '10px 14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--cyan-400)' }}>{item.step}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'objectives' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  '1. Develop an AI-based system for early flood forecasting using historical and real-time environmental and hydrological data.',
                  '2. Predict future rainfall using available weather parameters and historical rainfall patterns.',
                  '3. Forecast river or water-body levels using predicted rainfall along with previous water-level and hydrological information.',
                  '4. Analyse water behaviour by estimating possible flow direction, water depth, velocity, and flood spread based on available data.',
                  '5. Estimate flood risk for different locations and classify the risk into Low, Medium, and High levels.',
                  '6. Visualise flood-prone and potentially affected areas using GIS, making prediction easier to understand.',
                  '7. Provide timely early warnings and continuously update the risk assessment as new rainfall and water-level data become available, with periodic model updating or retraining.'
                ].map((obj, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} color="var(--emerald-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'references' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { authors: 'M. Asif, M. M. Kuglitsch, I. Pelivan, and R. Albano', title: 'Review and Intercomparison of Machine Learning Applications for Short-term Flood Forecasting', journal: 'Water Resources Management, vol. 39, pp. 1971–1991, 2025.' },
                { authors: 'B. Kuhaneswaran, G. Sorwar, A. R. Alaei, and F. Tong', title: 'Evolution of Data-Driven Flood Forecasting: Trends, Technologies, and Gaps—A Systematic Mapping Study', journal: 'Water, vol. 17, no. 15, p. 2281, 2025.' },
                { authors: 'Z. McEachran, R. Ghosh, A. Renganathan, et al.', title: 'Knowledge-Guided Machine Learning for Operational Flood Forecasting', journal: 'Water Resources Research, vol. 61, no. 11, e2024WR039064, 2025.' },
                { authors: 'Multi-institutional Study', title: 'Enhancing Flood Forecasting with Deep Learning: A Scalable Alternative to Traditional Hydrodynamic Models', journal: 'Environmental Modelling & Software, vol. 197, p. 106841, 2026.' },
                { authors: 'Research Group', title: 'Spatiotemporal Flood Depth and Velocity Dynamics Using a Convolutional Neural Network within a Sequential Deep-Learning Framework', journal: 'Environmental Modelling & Software, vol. 185, p. 106307, 2025.' },
                { authors: 'F. Piadeh, V. Bakhtiari, K. Behzadian, and F. Piadeh', title: 'AI-assisted framework using physically informed rainfall–drainage features for real-time urban flood risk forecasting', journal: 'Journal of Hydrology, vol. 677, p. 135819, 2026.' }
              ].map((ref, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>
                    [{idx + 1}] {ref.authors}, "{ref.title}"
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '2px' }}>
                    {ref.journal}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
