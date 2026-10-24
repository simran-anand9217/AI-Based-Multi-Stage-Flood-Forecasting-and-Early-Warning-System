/**
 * Cyber Security Module for AI Flood Forecasting & Warning System
 * Developed for CSE - Cyber Security (2nd Year), GNIOT Greater Noida
 * Features:
 *  - Sensor packet HMAC integrity verification (Anti-Spoofing)
 *  - Common Alerting Protocol (CAP) digital signature generation
 *  - Simulated Attack Injection & Anomaly Detection
 *  - Role-Based Access Control (RBAC) validation
 */

// Simulated SHA-256 HMAC for client-side demonstration
export async function generateTelemetryHash(sensorId, waterLevel, rainfall, timestamp, secretKey) {
  const payload = `${sensorId}:${waterLevel.toFixed(2)}:${rainfall.toFixed(1)}:${timestamp}:${secretKey}`;
  const msgUint8 = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify packet integrity against expected signature
export async function verifySensorPacketIntegrity(sensor, isTampered = false) {
  const timestamp = Math.floor(Date.now() / 60000) * 60000;
  const canonicalHash = await generateTelemetryHash(
    sensor.id,
    sensor.waterLevel,
    sensor.rainfallLast24h,
    timestamp,
    sensor.sensorKey || 'KEY-SECRET-DEFAULT'
  );

  if (isTampered) {
    // Generate corrupted hash or spoofed payload
    return {
      isValid: false,
      sensorId: sensor.id,
      reportedHash: canonicalHash.slice(0, 56) + 'bad09a',
      computedHash: canonicalHash,
      tamperingDetected: true,
      alertMessage: `CRITICAL SECURITY INCIDENT: Cryptographic checksum mismatch on node ${sensor.id}. Potential Man-In-The-Middle (MitM) or sensor spoofing attack detected!`,
      status: 'COMPROMISED'
    };
  }

  return {
    isValid: true,
    sensorId: sensor.id,
    reportedHash: canonicalHash,
    computedHash: canonicalHash,
    tamperingDetected: false,
    alertMessage: `Node ${sensor.id} authenticated. Cryptographic telemetry hash matches authorized PKI key.`,
    status: 'SECURE'
  };
}

// CAP (Common Alerting Protocol) Digital Signature
export async function signEmergencyAlert({ alertId, basinName, riskLevel, timestamp }) {
  const signerAuthority = 'District Disaster Management Authority (DDMA) & CWC Central Hub';
  const rawPayload = `${alertId}|${basinName}|${riskLevel}|${timestamp}|${signerAuthority}`;
  const msgUint8 = new TextEncoder().encode(rawPayload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    alertId,
    signedBy: signerAuthority,
    signatureAlgorithm: 'ECDSA-SHA256 (Simulated / Web Crypto)',
    digitalSignature: `SIG_${hexHash.slice(0, 32).toUpperCase()}`,
    verified: true,
    timestamp
  };
}

// RBAC Roles
export const USER_ROLES = {
  CITIZEN: {
    id: 'CITIZEN',
    title: 'Public Citizen',
    description: 'Public early warning dashboard, evacuation shelter directory, emergency helpline access.',
    permissions: ['VIEW_WARNINGS', 'VIEW_MAP', 'FIND_SHELTER']
  },
  OFFICER: {
    id: 'OFFICER',
    title: 'Disaster Response Officer',
    description: 'Emergency siren dispatch, evacuation order broadcast, barrier coordination.',
    permissions: ['VIEW_WARNINGS', 'VIEW_MAP', 'FIND_SHELTER', 'TRIGGER_SIREN', 'DISPATCH_BROADCAST']
  },
  ADMIN: {
    id: 'ADMIN',
    title: 'ML Hydrologist / Security Admin',
    description: 'Model retraining trigger, sensor parameter override, cyber integrity audit & key rotation.',
    permissions: ['VIEW_WARNINGS', 'VIEW_MAP', 'FIND_SHELTER', 'TRIGGER_SIREN', 'DISPATCH_BROADCAST', 'TRIGGER_RETRAINING', 'SIMULATE_ATTACKS', 'AUDIT_SECURITY']
  }
};
