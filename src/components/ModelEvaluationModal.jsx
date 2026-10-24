import React, { useState } from 'react';
import { X, Cpu, RefreshCw, CheckCircle, BarChart2, Award, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ModelEvaluationModal({
  isOpen,
  onClose,
  metrics,
  onTriggerRetraining
}) {
  const [retrainingInProgress, setRetrainingInProgress] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);

  const handleRetrain = () => {
    setRetrainingInProgress(true);
    setRetrainSuccess(false);

    setTimeout(() => {
      onTriggerRetraining();
      setRetrainingInProgress(false);
      setRetrainSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => setRetrainSuccess(false), 5000);
    }, 1200);
  };

  if (!isOpen) return null;

  const cm = metrics.confusionMatrix;
  const totalCorrect = cm.matrix[0][0] + cm.matrix[1][1] + cm.matrix[2][2];
  const overallAccuracy = ((totalCorrect / cm.totalSamples) * 100).toFixed(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(168, 85, 247, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)'
            }}>
              <Cpu size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                STAGE 8 // MODEL EVALUATION & CONTINUOUS RETRAINING
              </span>
              <h2 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                Hydrological Machine Learning Benchmark
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
          {/* Top Performance Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div className="glass-card" style={{ padding: '12px 14px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Water Level MAE</span>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-400)', margin: '4px 0' }}>
                {metrics.waterLevelModel.mae} m
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mean Absolute Error</span>
            </div>

            <div className="glass-card" style={{ padding: '12px 14px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Water Level RMSE</span>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--purple-400)', margin: '4px 0' }}>
                {metrics.waterLevelModel.rmse} m
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Root Mean Square</span>
            </div>

            <div className="glass-card" style={{ padding: '12px 14px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Classification F1</span>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-400)', margin: '4px 0' }}>
                {metrics.waterLevelModel.f1Score}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Precision: {metrics.waterLevelModel.precision}</span>
            </div>

            <div className="glass-card" style={{ padding: '12px 14px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Overall Accuracy</span>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                {overallAccuracy}%
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cm.totalSamples} Evaluation Points</span>
            </div>
          </div>

          {/* Confusion Matrix Section */}
          <div className="glass-card" style={{ padding: '18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={16} color="var(--purple-400)" />
                3x3 Flood Risk Confusion Matrix (Low / Medium / High)
              </h4>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                Multi-Class Validation
              </span>
            </div>

            {/* Matrix Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Ground Truth \ Predicted</th>
                    <th style={{ padding: '8px', color: 'var(--emerald-400)' }}>Pred Low</th>
                    <th style={{ padding: '8px', color: 'var(--amber-400)' }}>Pred Med</th>
                    <th style={{ padding: '8px', color: 'var(--coral-400)' }}>Pred High</th>
                    <th style={{ padding: '8px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cm.labels.map((rowLabel, rIdx) => {
                    const rowSum = cm.matrix[rIdx].reduce((a, b) => a + b, 0);
                    return (
                      <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-main)' }}>
                          {rowLabel}
                        </td>
                        {cm.matrix[rIdx].map((val, cIdx) => {
                          const isDiagonal = rIdx === cIdx;
                          return (
                            <td
                              key={cIdx}
                              style={{
                                padding: '10px 8px',
                                background: isDiagonal ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
                                fontWeight: isDiagonal ? 700 : 400,
                                color: isDiagonal ? '#ffffff' : 'var(--text-dim)'
                              }}
                            >
                              <span className="mono">{val}</span>
                            </td>
                          );
                        })}
                        <td style={{ padding: '10px 8px', color: 'var(--text-muted)' }} className="mono">
                          {rowSum}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '8px' }}>
              * Diagonal cells denote correctly classified hydrological flood risk scenarios.
            </div>
          </div>

          {/* Adaptive Retraining Trigger Banner */}
          <div className="glass-card" style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(56,189,248,0.1))',
            border: '1px solid rgba(168,85,247,0.3)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="var(--purple-400)" />
                <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Adaptive Real-Time Observation Retraining</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {retrainSuccess ? (
                  <span style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>
                    ✓ Model updated with 12 new sensor batches! Loss backpropagated and MAE reduced to {metrics.waterLevelModel.mae}m.
                  </span>
                ) : (
                  <>Current Epochs: <strong>{metrics.rainfallModel.epochsTrained}</strong> • Last Retraining: {metrics.waterLevelModel.lastUpdated}</>
                )}
              </p>
            </div>

            <button
              onClick={handleRetrain}
              disabled={retrainingInProgress}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                boxShadow: '0 4px 14px rgba(168,85,247,0.4)'
              }}
            >
              <RefreshCw size={14} className={retrainingInProgress ? 'spin' : ''} />
              {retrainingInProgress ? 'Ingesting Batch & Retraining...' : 'Stream New Observations & Retrain'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
