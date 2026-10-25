import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import StageCards from './components/StageCards';
import SimulationControls from './components/SimulationControls';
import Breadcrumbs from './components/Breadcrumbs';
import { useSeo } from './hooks/useSeo';
import { 
  getApiConfig, 
  saveApiConfig, 
  startTelemetryStream, 
  fetchLiveBasinTelemetry 
} from './services/realtimeDatabase';

// Performance optimization: Code-split heavy GIS, Charting, and Modal components
const GisMap = lazy(() => import('./components/GisMap'));
const HydroCharts = lazy(() => import('./components/HydroCharts'));
const EarlyWarningModal = lazy(() => import('./components/EarlyWarningModal'));
const ModelEvaluationModal = lazy(() => import('./components/ModelEvaluationModal'));
const CyberSecurityPanel = lazy(() => import('./components/CyberSecurityPanel'));
const PrivacyPolicyModal = lazy(() => import('./components/PrivacyPolicyModal'));
const ContactModal = lazy(() => import('./components/ContactModal'));
const RealtimeDatabaseModal = lazy(() => import('./components/RealtimeDatabaseModal'));

import { BASINS } from './data/basinsData';
import { 
  predictRainfall, 
  predictWaterLevel, 
  analyzeWaterBehaviour, 
  assessFloodRisk, 
  BASELINE_ML_METRICS,
  adaptModelWithNewObservations 
} from './services/floodAiEngine';
import { USER_ROLES } from './services/securityEngine';

export default function App() {
  const [selectedBasin, setSelectedBasin] = useState(BASINS.baitarani);
  const [timeHorizon, setTimeHorizon] = useState('6h');
  const [modelType, setModelType] = useState('TFT');
  const [userRole, setUserRole] = useState(USER_ROLES.OFFICER);

  // Map Tile API & Real-Time Database State
  const [apiConfig, setApiConfig] = useState(getApiConfig());
  const [livePacket, setLivePacket] = useState(null);
  const [livePacketCount, setLivePacketCount] = useState(0);
  const [liveBasinTelemetry, setLiveBasinTelemetry] = useState(null);

  // Simulation controls state
  const [simParams, setSimParams] = useState({
    rainfallIntensity: 1.0,
    upstreamDischargeMultiplier: 1.0,
    soilSaturation: 0.85,
    manningsN: 0.035
  });

  // Machine Learning metrics state
  const [metrics, setMetrics] = useState(BASELINE_ML_METRICS);

  // Modals state
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  // Live IoT telemetry stream & Open-Meteo polling
  useEffect(() => {
    // 1. Fetch live Open-Meteo river discharge & meteorology for selected basin
    fetchLiveBasinTelemetry(selectedBasin).then(telemetry => {
      if (telemetry) {
        setLiveBasinTelemetry(telemetry);
      }
    });

    // 2. Start high-frequency real-time IoT sensor telemetry stream
    const stopStream = startTelemetryStream({
      basin: selectedBasin,
      onPacket: (pkt) => {
        setLivePacket(pkt);
        setLivePacketCount((prev) => prev + 1);
      },
      intervalMs: 3000
    });

    return () => {
      stopStream();
    };
  }, [selectedBasin]);

  const handleSaveApiConfig = (newConfig) => {
    setApiConfig(newConfig);
    saveApiConfig(newConfig);
  };

  // Dynamic Pipeline Calculations
  const rainfallData = useMemo(() => {
    return predictRainfall({
      scenarioIntensity: simParams.rainfallIntensity,
      antecedentRainfall: selectedBasin.stations[0]?.rainfallLast24h || 75
    });
  }, [simParams.rainfallIntensity, selectedBasin]);

  const waterLevelData = useMemo(() => {
    return predictWaterLevel({
      basin: selectedBasin,
      timeHorizon,
      rainfallPredicted: rainfallData.forecasts[timeHorizon],
      upstreamDischargeMultiplier: simParams.upstreamDischargeMultiplier,
      soilSaturation: simParams.soilSaturation,
      modelType
    });
  }, [selectedBasin, timeHorizon, rainfallData, simParams, modelType]);

  const waterBehaviour = useMemo(() => {
    return analyzeWaterBehaviour({
      waterLevelForecast: waterLevelData,
      manningsN: simParams.manningsN
    });
  }, [waterLevelData, simParams.manningsN]);

  const riskAssessment = useMemo(() => {
    return assessFloodRisk({
      waterLevelForecast: waterLevelData,
      waterBehaviour,
      basin: selectedBasin
    });
  }, [waterLevelData, waterBehaviour, selectedBasin]);

  // Synchronize document title, meta description, and canonical URL dynamically
  useSeo({
    title: `HydroAI Guard | ${selectedBasin.name} Flood Forecast & Warning (${timeHorizon})`,
    description: `Real-time multi-stage AI flood forecast for ${selectedBasin.name}. ${timeHorizon} water level projections, hydrodynamic velocity analysis, and GIS inundation mapping.`,
    canonical: `https://hydroai-guard.org/?basin=${selectedBasin.id}&horizon=${timeHorizon}`
  });

  const handleResetSimulation = () => {
    setSimParams({
      rainfallIntensity: 1.0,
      upstreamDischargeMultiplier: 1.0,
      soilSaturation: 0.85,
      manningsN: 0.035
    });
  };

  const handleTriggerRetraining = () => {
    setMetrics(prev => adaptModelWithNewObservations(prev, 1));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        selectedBasin={selectedBasin}
        setSelectedBasin={setSelectedBasin}
        basins={BASINS}
        timeHorizon={timeHorizon}
        setTimeHorizon={setTimeHorizon}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenEvaluation={() => setIsEvaluationOpen(true)}
        onOpenAlert={() => setIsAlertOpen(true)}
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        riskAssessment={riskAssessment}
      />

      {/* Main Dashboard Layout */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '16px 24px 24px 24px', width: '100%', flex: 1 }}>
        {/* Semantic Breadcrumbs Navigation */}
        <Breadcrumbs
          basinName={selectedBasin.name}
          pageTitle="Hydrological Forecast & Basin Analytics"
        />

        {/* Real-time Hydrological & Flood Risk Metrics Cards */}
        <StageCards
          rainfallData={rainfallData}
          waterLevelData={waterLevelData}
          waterBehaviour={waterBehaviour}
          riskAssessment={riskAssessment}
          timeHorizon={timeHorizon}
          modelType={modelType}
          setModelType={setModelType}
        />

        {/* Dual Primary GIS Map & Hydrograph Grid (Code-Split with Suspense) */}
        <Suspense fallback={
          <div style={{
            height: '460px',
            background: 'rgba(12, 23, 46, 0.65)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            color: 'var(--cyan-400)',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', border: '3px solid var(--border-light)', borderTopColor: 'var(--cyan-400)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span>Initializing GIS Spatial Engine &amp; Hydrographs...</span>
            </div>
          </div>
        }>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 1.15fr) minmax(320px, 0.85fr)',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Interactive GIS Map with Clean Basemaps, Doppler Radar & Live DB */}
            <GisMap
              basin={selectedBasin}
              waterLevelData={waterLevelData}
              waterBehaviour={waterBehaviour}
              riskAssessment={riskAssessment}
              apiConfig={apiConfig}
              onOpenDatabaseModal={() => setIsDatabaseOpen(true)}
              livePacket={livePacket}
              livePacketCount={livePacketCount}
            />

            {/* Hydrographs & Model Projections */}
            <HydroCharts
              waterLevelData={waterLevelData}
              rainfallData={rainfallData}
              timeHorizon={timeHorizon}
              modelType={modelType}
            />
          </div>
        </Suspense>

        {/* Hydrological Sandbox Simulation Controls */}
        <SimulationControls
          simParams={simParams}
          setSimParams={setSimParams}
          onReset={handleResetSimulation}
        />
      </main>

      {/* Academic Footer with Crawlable Links */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 14, 28, 0.95)',
        padding: '20px 24px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <strong style={{ color: '#ffffff' }}>AI-Based Flood Forecasting and Early Warning System</strong>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Operational Early Warning &amp; Intelligent Hydrological Simulation Platform
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.72rem', flexWrap: 'wrap' }}>
            <span>Team: <strong>Swati Basliyal, Simran Anand, Ravina Ranjan</strong></span>
            <span>Supervisor: <strong>Ms. Arzoo Sorout</strong></span>
            <a
              href="#database"
              onClick={(e) => { e.preventDefault(); setIsDatabaseOpen(true); }}
              style={{ color: 'var(--cyan-400)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Live DB &amp; Map API
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}
              style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Contact &amp; Feedback
            </a>
            <a
              href="#privacy"
              onClick={(e) => { e.preventDefault(); setIsPrivacyOpen(true); }}
              style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Privacy &amp; Data Policy
            </a>
            <span className="mono" style={{ color: 'var(--cyan-400)' }}>v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Code-Split Modals with Suspense */}
      <Suspense fallback={null}>
        {isAlertOpen && (
          <EarlyWarningModal
            isOpen={isAlertOpen}
            onClose={() => setIsAlertOpen(false)}
            riskAssessment={riskAssessment}
            basin={selectedBasin}
            waterLevelData={waterLevelData}
          />
        )}

        {isEvaluationOpen && (
          <ModelEvaluationModal
            isOpen={isEvaluationOpen}
            onClose={() => setIsEvaluationOpen(false)}
            metrics={metrics}
            onTriggerRetraining={handleTriggerRetraining}
          />
        )}

        {isSecurityOpen && (
          <CyberSecurityPanel
            isOpen={isSecurityOpen}
            onClose={() => setIsSecurityOpen(false)}
            basin={selectedBasin}
            userRole={userRole}
          />
        )}

        {isPrivacyOpen && (
          <PrivacyPolicyModal
            isOpen={isPrivacyOpen}
            onClose={() => setIsPrivacyOpen(false)}
          />
        )}

        {isContactOpen && (
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        )}

        {isDatabaseOpen && (
          <RealtimeDatabaseModal
            isOpen={isDatabaseOpen}
            onClose={() => setIsDatabaseOpen(false)}
            apiConfig={apiConfig}
            onSaveConfig={handleSaveApiConfig}
            livePacket={livePacket}
            livePacketCount={livePacketCount}
            basin={selectedBasin}
            waterLevelData={waterLevelData}
          />
        )}
      </Suspense>
    </div>
  );
}
