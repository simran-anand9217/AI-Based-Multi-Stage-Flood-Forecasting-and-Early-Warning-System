import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#040810',
          color: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            background: 'rgba(16, 31, 62, 0.8)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={24} color="#ef4444" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Runtime Incident Detected</h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>An unexpected error occurred during rendering</p>
              </div>
            </div>

            <div style={{
              background: '#02050b',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: '#f87171',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              maxHeight: '180px',
              overflowY: 'auto',
              marginBottom: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {this.state.error && this.state.error.toString()}
            </div>

            <button
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={15} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
