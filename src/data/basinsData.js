// Basin Telemetry & Hydrographic Master Data
export const BASINS = {
  baitarani: {
    id: 'baitarani',
    name: 'Baitarani River Basin',
    state: 'Odisha, India',
    referenceNote: 'Featured in academic synopsis (LSTM, CNN, Temporal Fusion Transformer evaluation)',
    center: [21.015, 86.155],
    zoom: 11,
    dangerLevel: 17.83, // meters
    warningLevel: 16.50,
    normalLevel: 13.20,
    currentLevel: 17.15,
    baselineDischarge: 2850, // m3/s
    catchmentArea: '14,218 sq.km',
    climateZone: 'Sub-tropical Monsoon',
    criticalInfrastructureCount: {
      bridges: 14,
      hospitals: 9,
      schools: 42,
      evacuationShelters: 18
    },
    stations: [
      {
        id: 'BTR-01',
        name: 'Akhuapada Hydrological Station',
        lat: 20.912,
        lng: 86.284,
        elevation: 14.5,
        waterLevel: 17.42,
        warningLevel: 16.50,
        dangerLevel: 17.83,
        flowVelocity: 2.8, // m/s
        flowDirection: 135, // SE
        discharge: 3120, // m3/s
        rainfallLast24h: 92.4, // mm
        status: 'warning',
        sensorKey: 'SEC-BTR-AKH-9217',
        lastUpdated: '10 mins ago'
      },
      {
        id: 'BTR-02',
        name: 'Anandapur Gauge & Discharge Post',
        lat: 21.217,
        lng: 85.923,
        elevation: 38.2,
        waterLevel: 36.85,
        warningLevel: 36.00,
        dangerLevel: 38.36,
        flowVelocity: 3.4,
        flowDirection: 140,
        discharge: 4250,
        rainfallLast24h: 118.0,
        status: 'danger',
        sensorKey: 'SEC-BTR-AND-4412',
        lastUpdated: '4 mins ago'
      },
      {
        id: 'BTR-03',
        name: 'Champua Upstream Telemetry',
        lat: 22.072,
        lng: 85.667,
        elevation: 365.0,
        waterLevel: 362.10,
        warningLevel: 361.50,
        dangerLevel: 364.50,
        flowVelocity: 1.9,
        flowDirection: 160,
        discharge: 1890,
        rainfallLast24h: 74.2,
        status: 'alert',
        sensorKey: 'SEC-BTR-CMP-1029',
        lastUpdated: '7 mins ago'
      },
      {
        id: 'BTR-04',
        name: 'Jajpur Deltaic Discharge Hub',
        lat: 20.849,
        lng: 86.331,
        elevation: 9.8,
        waterLevel: 10.45,
        warningLevel: 9.90,
        dangerLevel: 11.20,
        flowVelocity: 2.1,
        flowDirection: 125,
        discharge: 3410,
        rainfallLast24h: 104.5,
        status: 'danger',
        sensorKey: 'SEC-BTR-JJP-7831',
        lastUpdated: '2 mins ago'
      }
    ],
    shelters: [
      { id: 'S-01', name: 'Anandapur Cyclone & Flood Shelter', lat: 21.235, lng: 85.940, capacity: 1500, occupancy: 420, supplies: 'High', contact: '+91-6731-220199' },
      { id: 'S-02', name: 'Akhuapada High School Multi-Purpose Relief Center', lat: 20.925, lng: 86.295, capacity: 1200, occupancy: 850, supplies: 'Moderate', contact: '+91-6786-231011' },
      { id: 'S-03', name: 'Jajpur Zilla Parishad Disaster Camp', lat: 20.865, lng: 86.345, capacity: 2200, occupancy: 1300, supplies: 'High', contact: '+91-6728-222340' },
      { id: 'S-04', name: 'Bhadrak Boundary Evacuation Point', lat: 21.055, lng: 86.510, capacity: 3000, occupancy: 600, supplies: 'Optimal', contact: '+91-6784-251200' }
    ],
    inundationPolygons: [
      {
        id: 'poly-high-1',
        riskLevel: 'high',
        depth: 2.3, // meters
        label: 'Anandapur Low-Lying Inundation Zone',
        coordinates: [
          [21.21, 85.91],
          [21.24, 85.93],
          [21.23, 85.96],
          [21.19, 85.94]
        ]
      },
      {
        id: 'poly-med-1',
        riskLevel: 'medium',
        depth: 1.1,
        label: 'Akhuapada Agricultural Spillway',
        coordinates: [
          [20.90, 86.26],
          [20.94, 86.28],
          [20.93, 86.32],
          [20.89, 86.30]
        ]
      },
      {
        id: 'poly-high-2',
        riskLevel: 'high',
        depth: 1.8,
        label: 'Jajpur Riparian Floodplain',
        coordinates: [
          [20.83, 86.31],
          [20.87, 86.33],
          [20.86, 86.37],
          [20.82, 86.35]
        ]
      }
    ]
  },

  yamunaHindon: {
    id: 'yamunaHindon',
    name: 'Yamuna-Hindon Basin (Greater Noida / NCR)',
    state: 'Uttar Pradesh & Delhi-NCR, India',
    referenceNote: 'Host Institute Region (GNIOT Greater Noida / AKTU), frequent monsoon floodplain breaches',
    center: [28.48, 77.48],
    zoom: 11,
    dangerLevel: 205.33, // meters above MSL
    warningLevel: 204.50,
    normalLevel: 201.20,
    currentLevel: 204.85,
    baselineDischarge: 1950,
    catchmentArea: '7,058 sq.km',
    climateZone: 'Northern Gangetic Alluvial',
    criticalInfrastructureCount: {
      bridges: 18,
      hospitals: 24,
      schools: 68,
      evacuationShelters: 22
    },
    stations: [
      {
        id: 'YMN-01',
        name: 'Hindon Barrage Monitoring Node',
        lat: 28.641,
        lng: 77.382,
        elevation: 206.5,
        waterLevel: 205.10,
        warningLevel: 204.50,
        dangerLevel: 205.33,
        flowVelocity: 2.3,
        flowDirection: 155,
        discharge: 2450,
        rainfallLast24h: 88.6,
        status: 'danger',
        sensorKey: 'SEC-YMN-HND-9921',
        lastUpdated: '3 mins ago'
      },
      {
        id: 'YMN-02',
        name: 'Greater Noida Knowledge Park Eco-Station',
        lat: 28.467,
        lng: 77.498,
        elevation: 198.2,
        waterLevel: 199.40,
        warningLevel: 199.10,
        dangerLevel: 200.50,
        flowVelocity: 1.8,
        flowDirection: 145,
        discharge: 1220,
        rainfallLast24h: 76.4,
        status: 'alert',
        sensorKey: 'SEC-GNT-KP2-5501',
        lastUpdated: '1 min ago'
      },
      {
        id: 'YMN-03',
        name: 'Surajpur Wetland Hydrology Outpost',
        lat: 28.528,
        lng: 77.464,
        elevation: 201.0,
        waterLevel: 201.85,
        warningLevel: 201.50,
        dangerLevel: 202.80,
        flowVelocity: 1.2,
        flowDirection: 130,
        discharge: 980,
        rainfallLast24h: 65.0,
        status: 'alert',
        sensorKey: 'SEC-GNT-SRJ-3184',
        lastUpdated: '8 mins ago'
      },
      {
        id: 'YMN-04',
        name: 'Okhla Barrage Outflow Gate',
        lat: 28.544,
        lng: 77.311,
        elevation: 200.6,
        waterLevel: 202.20,
        warningLevel: 201.80,
        dangerLevel: 203.20,
        flowVelocity: 2.7,
        flowDirection: 150,
        discharge: 3100,
        rainfallLast24h: 82.1,
        status: 'danger',
        sensorKey: 'SEC-DLH-OKH-8820',
        lastUpdated: '5 mins ago'
      }
    ],
    shelters: [
      { id: 'YS-01', name: 'GNIOT Campus High-Ground Emergency Center', lat: 28.462, lng: 77.489, capacity: 2500, occupancy: 320, supplies: 'High', contact: '+91-120-2328214' },
      { id: 'YS-02', name: 'Pari Chowk Multipurpose Community Shelter', lat: 28.473, lng: 77.503, capacity: 1800, occupancy: 790, supplies: 'Optimal', contact: '+91-120-2569800' },
      { id: 'YS-03', name: 'Surajpur District Relief Camp', lat: 28.535, lng: 77.472, capacity: 1200, occupancy: 890, supplies: 'Moderate', contact: '+91-120-2441990' },
      { id: 'YS-04', name: 'Noida Stadium Emergency Relief Hub', lat: 28.591, lng: 77.352, capacity: 4000, occupancy: 1100, supplies: 'High', contact: '+91-120-2444444' }
    ],
    inundationPolygons: [
      {
        id: 'poly-ymn-1',
        riskLevel: 'high',
        depth: 1.7,
        label: 'Hindon Floodplain Cultivation Belt',
        coordinates: [
          [28.62, 77.37],
          [28.66, 77.39],
          [28.65, 77.42],
          [28.61, 77.40]
        ]
      },
      {
        id: 'poly-ymn-2',
        riskLevel: 'medium',
        depth: 0.9,
        label: 'Knowledge Park Low-Elevation Sector',
        coordinates: [
          [28.45, 77.48],
          [28.48, 77.51],
          [28.47, 77.53],
          [28.44, 77.50]
        ]
      }
    ]
  },

  customSimulator: {
    id: 'customSimulator',
    name: 'Custom Interactive Simulation Basin',
    state: 'Hydrological Sandbox Environment',
    referenceNote: 'Simulate arbitrary extreme weather events, dam breaches, and sensor cyber-attacks',
    center: [25.50, 85.10],
    zoom: 11,
    dangerLevel: 50.0,
    warningLevel: 47.0,
    normalLevel: 42.0,
    currentLevel: 45.8,
    baselineDischarge: 2100,
    catchmentArea: '10,000 sq.km',
    climateZone: 'Experimental Dynamic Grid',
    criticalInfrastructureCount: {
      bridges: 10,
      hospitals: 8,
      schools: 30,
      evacuationShelters: 12
    },
    stations: [
      {
        id: 'SIM-01',
        name: 'Headwater Test Node Alpha',
        lat: 25.56,
        lng: 85.05,
        elevation: 62.0,
        waterLevel: 48.2,
        warningLevel: 47.0,
        dangerLevel: 50.0,
        flowVelocity: 2.5,
        flowDirection: 120,
        discharge: 2600,
        rainfallLast24h: 110.0,
        status: 'danger',
        sensorKey: 'SEC-SIM-ALP-0001',
        lastUpdated: 'Just now'
      },
      {
        id: 'SIM-02',
        name: 'Confluence Test Node Beta',
        lat: 25.48,
        lng: 85.16,
        elevation: 45.0,
        waterLevel: 44.5,
        warningLevel: 43.0,
        dangerLevel: 46.5,
        flowVelocity: 1.9,
        flowDirection: 135,
        discharge: 1950,
        rainfallLast24h: 85.0,
        status: 'alert',
        sensorKey: 'SEC-SIM-BET-0002',
        lastUpdated: 'Just now'
      }
    ],
    shelters: [
      { id: 'SS-01', name: 'Simulated Central High Shelter', lat: 25.58, lng: 85.12, capacity: 2000, occupancy: 400, supplies: 'High', contact: '+91-1800-FLOOD-HELP' }
    ],
    inundationPolygons: [
      {
        id: 'poly-sim-1',
        riskLevel: 'high',
        depth: 2.1,
        label: 'Sandbox Inundation Zone',
        coordinates: [
          [25.52, 85.08],
          [25.55, 85.12],
          [25.50, 85.15],
          [25.47, 85.10]
        ]
      }
    ]
  }
};
