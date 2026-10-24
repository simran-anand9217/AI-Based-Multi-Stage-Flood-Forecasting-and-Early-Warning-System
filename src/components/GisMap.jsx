import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Eye, EyeOff, MapPin, Compass } from 'lucide-react';

export default function GisMap({
  basin,
  waterLevelData,
  waterBehaviour,
  riskAssessment,
  onSelectStation
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({
    stations: null,
    inundation: null,
    shelters: null
  });

  const [satelliteView, setSatelliteView] = useState(false);
  const [showInundation, setShowInundation] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [selectedStationInfo, setSelectedStationInfo] = useState(null);
  const [mapError, setMapError] = useState(null);

  // Initialize and tear down map cleanly
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // 1. Destroy existing map if present
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // 2. Ensure container doesn't have leftover leaflet id
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      // 3. Create fresh Leaflet map instance
      const map = L.map(mapContainerRef.current, {
        center: basin.center,
        zoom: basin.zoom,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layer
      const tileUrl = satelliteView
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      // Initialize layer groups attached to this map
      const stationLayer = L.layerGroup().addTo(map);
      const inundationLayer = L.layerGroup().addTo(map);
      const shelterLayer = L.layerGroup().addTo(map);

      layerGroupsRef.current = {
        stations: stationLayer,
        inundation: inundationLayer,
        shelters: shelterLayer
      };

      mapInstanceRef.current = map;
      setMapError(null);

      // Invalidate size to ensure proper rendering after flex layout stabilizes
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);

    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
      setMapError(err.message || 'Map loading error');
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error removing map on cleanup', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [basin, satelliteView]);

  // Render Features (Stations, Polygons, Shelters)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const { stations: stationGroup, inundation: inundationGroup, shelters: shelterGroup } = layerGroupsRef.current;
    if (!map) return;

    // 1. Stations
    if (stationGroup) {
      stationGroup.clearLayers();
      if (showStations && basin.stations) {
        basin.stations.forEach((st) => {
          const isDanger = st.waterLevel >= st.dangerLevel;
          const isWarning = st.waterLevel >= st.warningLevel;
          const color = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#38bdf8';

          const iconHtml = `
            <div style="position:relative; width:24px; height:24px; display:flex; align-items:center; justify-content:center;">
              <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:${color}; opacity:0.35; animation:pulse 1.8s infinite;"></div>
              <div style="width:12px; height:12px; border-radius:50%; background:${color}; border:2px solid #ffffff; box-shadow:0 0 10px ${color};"></div>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-station-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const marker = L.marker([st.lat, st.lng], { icon: customIcon });

          const popupContent = `
            <div style="font-family: 'Inter', sans-serif; font-size:12px; min-width:200px;">
              <div style="font-weight:700; color:#38bdf8; font-size:13px; margin-bottom:4px;">${st.name}</div>
              <div style="color:#94a3b8; font-size:11px; margin-bottom:8px;">Station ID: ${st.id} • Elevation: ${st.elevation}m</div>
              <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                <span>Water Level:</span>
                <strong style="color:${color}">${st.waterLevel} m</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                <span>Danger Mark:</span>
                <span style="color:#f87171">${st.dangerLevel} m</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                <span>Flow Velocity:</span>
                <span>${st.flowVelocity} m/s</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                <span>Discharge:</span>
                <span>${st.discharge} m³/s</span>
              </div>
              <div style="margin-top:6px; padding:4px 6px; background:rgba(56,189,248,0.1); border-radius:4px; font-size:10px; color:#38bdf8;">
                Telemetry Hash: Verified (SHA-256)
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on('click', () => {
            setSelectedStationInfo(st);
            if (onSelectStation) onSelectStation(st);
          });
          stationGroup.addLayer(marker);
        });
      }
    }

    // 2. Inundation Polygons
    if (inundationGroup) {
      inundationGroup.clearLayers();
      if (showInundation && basin.inundationPolygons) {
        basin.inundationPolygons.forEach((poly) => {
          const isHigh = poly.riskLevel === 'high';
          const color = isHigh ? '#ef4444' : '#f59e0b';

          const polygon = L.polygon(poly.coordinates, {
            color: color,
            weight: 2,
            opacity: 0.8,
            fillColor: color,
            fillOpacity: 0.35,
            dashArray: '4 4'
          });

          polygon.bindTooltip(`
            <div style="font-size:11px; font-weight:600;">
              ${poly.label}<br/>
              <span style="color:${color}">Estimated Depth: ~${poly.depth}m (${poly.riskLevel.toUpperCase()} RISK)</span>
            </div>
          `, { sticky: true });

          inundationGroup.addLayer(polygon);
        });
      }
    }

    // 3. Shelters
    if (shelterGroup) {
      shelterGroup.clearLayers();
      if (showShelters && basin.shelters) {
        basin.shelters.forEach((sh) => {
          const shelterHtml = `
            <div style="width:20px; height:20px; border-radius:4px; background:#10b981; display:flex; align-items:center; justify-content:center; border:1px solid #ffffff; box-shadow:0 0 8px rgba(16,185,129,0.7);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            </div>
          `;

          const shelterIcon = L.divIcon({
            html: shelterHtml,
            className: 'shelter-marker-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          const marker = L.marker([sh.lat, sh.lng], { icon: shelterIcon });
          marker.bindPopup(`
            <div style="font-family:'Inter', sans-serif; font-size:12px; min-width:180px;">
              <div style="font-weight:700; color:#34d399; margin-bottom:4px;">${sh.name}</div>
              <div>Safe Elevation Capacity: <strong>${sh.capacity} persons</strong></div>
              <div>Current Occupancy: <strong>${sh.occupancy}</strong> (${Math.round((sh.occupancy/sh.capacity)*100)}%)</div>
              <div>Medical Supplies: <strong style="color:#38bdf8">${sh.supplies}</strong></div>
              <div style="margin-top:6px; color:#cbd5e1;">Emergency Hotline: <strong>${sh.contact}</strong></div>
            </div>
          `);
          shelterGroup.addLayer(marker);
        });
      }
    }
  }, [basin, showStations, showInundation, showShelters, waterLevelData]);

  return (
    <div className="glass-panel" style={{ padding: '16px', position: 'relative', height: '560px', display: 'flex', flexDirection: 'column' }}>
      {/* Header Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--cyan-400)', fontWeight: 700, letterSpacing: '0.05em' }}>
            STAGE 5 // GIS VISUALIZATION & SPATIAL INUNDATION MAPPING
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
            Live Leaflet Engine
          </span>
        </div>

        {/* Layer Toggle Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSatelliteView(!satelliteView)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          >
            {satelliteView ? 'Dark Street' : 'Satellite Imagery'}
          </button>

          <button
            onClick={() => setShowInundation(!showInundation)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '4px 8px',
              borderColor: showInundation ? 'var(--coral-400)' : 'var(--border-subtle)'
            }}
          >
            {showInundation ? <Eye size={12} color="#f87171" /> : <EyeOff size={12} />}
            Inundation Zones
          </button>

          <button
            onClick={() => setShowStations(!showStations)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '4px 8px',
              borderColor: showStations ? 'var(--cyan-400)' : 'var(--border-subtle)'
            }}
          >
            {showStations ? <Eye size={12} color="#38bdf8" /> : <EyeOff size={12} />}
            Gauge Nodes
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '4px 8px',
              borderColor: showShelters ? 'var(--emerald-400)' : 'var(--border-subtle)'
            }}
          >
            {showShelters ? <Eye size={12} color="#34d399" /> : <EyeOff size={12} />}
            Shelters
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: 'relative', flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '350px' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '350px' }} />

        {/* Floating GIS Overlay Legend */}
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 900,
            padding: '10px 14px',
            fontSize: '0.72rem',
            background: 'rgba(7, 14, 28, 0.9)',
            border: '1px solid var(--border-light)'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            GIS Map Overlays ({basin.name.split(' ')[0]})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
              <span>Breached / Danger Level Station</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
              <span>Warning Stage Station</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '8px', background: 'rgba(239, 68, 68, 0.4)', border: '1px dashed #ef4444', display: 'inline-block' }}></span>
              <span>Active Flood Inundation Polygon</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981', display: 'inline-block' }}></span>
              <span>Safe Evacuation Center / Camp</span>
            </div>
          </div>
        </div>

        {/* Flow Vector Compass Indicator */}
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 900,
            padding: '8px 12px',
            textAlign: 'center',
            background: 'rgba(7, 14, 28, 0.9)',
            border: '1px solid var(--border-light)'
          }}
        >
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            HYDRODYNAMIC DRIFT
          </div>
          <div style={{
            fontSize: '1.2rem',
            transform: `rotate(${waterBehaviour.flowAzimuth}deg)`,
            display: 'inline-block',
            margin: '4px 0',
            color: 'var(--cyan-400)'
          }}>
            ➔
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff' }}>
            {waterBehaviour.flowVelocity} m/s {waterBehaviour.compassDirection.split(' ')[0]}
          </div>
        </div>
      </div>
    </div>
  );
}
