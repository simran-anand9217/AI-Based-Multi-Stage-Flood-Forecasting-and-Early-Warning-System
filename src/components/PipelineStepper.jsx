import React from 'react';
import { 
  Database, 
  CloudRain, 
  TrendingUp, 
  Compass, 
  ShieldAlert, 
  Map, 
  BellRing, 
  RefreshCw 
} from 'lucide-react';

export const PIPELINE_STAGES = [
  { id: 1, title: 'Data Ingestion', sub: 'Preprocessed Feeds', icon: Database, status: 'DONE' },
  { id: 2, title: 'Rainfall Forecast', sub: 'Atmospheric AI', icon: CloudRain, status: 'DONE' },
  { id: 3, title: 'Water-Level Forecast', sub: 'TFT / LSTM Model', icon: TrendingUp, status: 'ACTIVE' },
  { id: 4, title: 'Water Behaviour', sub: "Manning's Hydrodynamics", icon: Compass, status: 'ACTIVE' },
  { id: 5, title: 'Risk Assessment', sub: 'Multi-Criteria Index', icon: ShieldAlert, status: 'ACTIVE' },
  { id: 6, title: 'GIS Visualization', sub: 'Spatial Flood Layer', icon: Map, status: 'ACTIVE' },
  { id: 7, title: 'Early Warning', sub: 'CAP Siren Broadcast', icon: BellRing, status: 'ACTIVE' },
  { id: 8, title: 'Model Update', sub: 'Adaptive Retraining', icon: RefreshCw, status: 'READY' }
];

export default function PipelineStepper({ activeStage, setActiveStage }) {
  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-400)', letterSpacing: '0.05em' }}>
            METHODOLOGY ARCHITECTURE PIPELINE
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            (Sequential Multi-Stage Execution from Project Synopsis)
          </span>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
          Real-Time Pipeline Synchronized
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '8px'
      }}>
        {PIPELINE_STAGES.map((stage) => {
          const Icon = stage.icon;
          const isSelected = activeStage === stage.id;
          return (
            <div
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className="glass-card"
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderLeft: isSelected ? '3px solid var(--cyan-400)' : '3px solid transparent',
                background: isSelected ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 31, 62, 0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isSelected ? 'var(--cyan-500)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={16} color={isSelected ? '#ffffff' : 'var(--cyan-400)'} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Stage {stage.id}
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {stage.title}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {stage.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
