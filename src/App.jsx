import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import PipelineStepper from './components/PipelineStepper';
import StageCards from './components/StageCards';
import GisMap from './components/GisMap';
import HydroCharts from './components/HydroCharts';
import SimulationControls from './components/SimulationControls';
import EarlyWarningModal from './components/EarlyWarningModal';
import ModelEvaluationModal from './components/ModelEvaluationModal';
import CyberSecurityPanel from './components/CyberSecurityPanel';
import ProjectSynopsisModal from './components/ProjectSynopsisModal';

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
  const [activeStage, setActiveStage] = useState(3);

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
  const [isSynopsisOpen, setIsSynopsisOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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
        onOpenSynopsis={() => setIsSynopsisOpen(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenEvaluation={() => setIsEvaluationOpen(true)}
        onOpenAlert={() => setIsAlertOpen(true)}
        riskAssessment={riskAssessment}
      />

      {/* Main Dashboard Layout */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px', width: '100%', flex: 1 }}>
        {/* Pipeline Stepper */}
        <PipelineStepper
          activeStage={activeStage}
          setActiveStage={setActiveStage}
        />

        {/* Real-time Stage Metrics Cards (Stages 1-4) */}
        <StageCards
          rainfallData={rainfallData}
          waterLevelData={waterLevelData}
          waterBehaviour={waterBehaviour}
          riskAssessment={riskAssessment}
          timeHorizon={timeHorizon}
          modelType={modelType}
          setModelType={setModelType}
        />

        {/* Dual Primary GIS Map & Hydrograph Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1.15fr) minmax(320px, 0.85fr)',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Stage 5: Interactive GIS Map */}
          <GisMap
            basin={selectedBasin}
            waterLevelData={waterLevelData}
            waterBehaviour={waterBehaviour}
            riskAssessment={riskAssessment}
          />

          {/* Stage 2 & 7: Hydrographs & Model Projections */}
          <HydroCharts
            waterLevelData={waterLevelData}
            rainfallData={rainfallData}
            timeHorizon={timeHorizon}
            modelType={modelType}
          />
        </div>

        {/* Hydrological Sandbox Simulation Controls */}
        <SimulationControls
          simParams={simParams}
          setSimParams={setSimParams}
          onReset={handleResetSimulation}
        />
      </main>

      {/* Academic Footer */}
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
            <strong style={{ color: '#ffffff' }}>AI-Based Multi-Stage Flood Forecasting and Early Warning System</strong>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              B.Tech CSE - Cyber Security (2nd Year) • Greater Noida Institute of Technology (GNIOT) • Dr. A.P.J. Abdul Kalam Technical University (AKTU)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.72rem' }}>
            <span>Project Team: <strong>Swati Basliyal, Simran Anand, Ravina Ranjan</strong></span>
            <span>Supervisor: <strong>Ms. Arzoo Sorout</strong></span>
            <span className="mono" style={{ color: 'var(--cyan-400)' }}>v1.0.0 (August 2026 Release)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EarlyWarningModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        riskAssessment={riskAssessment}
        basin={selectedBasin}
        waterLevelData={waterLevelData}
      />

      <ModelEvaluationModal
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
        metrics={metrics}
        onTriggerRetraining={handleTriggerRetraining}
      />

      <CyberSecurityPanel
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        basin={selectedBasin}
        userRole={userRole}
      />

      <ProjectSynopsisModal
        isOpen={isSynopsisOpen}
        onClose={() => setIsSynopsisOpen(false)}
      />
    </div>
  );
}
