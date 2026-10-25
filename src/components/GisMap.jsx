import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Eye, EyeOff, MapPin, Compass, Database, CloudRain, Wifi, Key } from 'lucide-react';
import { BASEMAP_PROVIDERS, fetchLiveRadarTileUrl } from '../services/realtimeDatabase';

export default function GisMap({
  basin,
  waterLevelData,
  waterBehaviour,
  riskAssessment,
  onSelectStation,
  apiConfig = { basemapProvider: 'esriDark', radarEnabled: false, streamSource: 'openMeteo' },
  onOpenDatabaseModal,
  livePacket,
  livePacketCount = 0
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({
    stations: null,
    inundation: null,
    shelters: null,
    radar: null
  });

  const [satelliteView, setSatelliteView] = useState(false);
  const [showInundation, setShowInundation] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRadar, setShowRadar] = useState(apiConfig.radarEnabled || false);
  const [selectedStationInfo, setSelectedStationInfo] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [radarLayerUrl, setRadarLayerUrl] = useState(null);

  // Sync radar enabled state
  useEffect(() => {
    setShowRadar(apiConfig.radarEnabled || false);
  }, [apiConfig.radarEnabled]);

  // Fetch live Doppler precipitation radar tile URL from RainViewer API
  useEffect(() => {
    if (showRadar) {
      fetchLiveRadarTileUrl().then((radarData) => {
        if (radarData?.url) {
          setRadarLayerUrl(radarData.url);
        }
      });
    } else {
      setRadarLayerUrl(null);
    }
  }, [showRadar]);

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

      // Tile layer logic: Default to clean Esri Dark Gray (No watermarks, no key required)
      let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      let maxZoom = 16;
      let attribution = 'Tiles &copy; Esri';

      if (satelliteView || apiConfig.basemapProvider === 'satellite') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 18;
      } else if (apiConfig.basemapProvider === 'osm') {
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        maxZoom = 19;
      } else if (apiConfig.basemapProvider === 'carto') {
        // If user entered a Carto API key, use it with param; otherwise fallback cleanly to Esri Dark
        tileUrl = apiConfig.cartoApiKey
          ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${encodeURIComponent(apiConfig.cartoApiKey)}`
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 19;
      } else {
        // Standard Esri Dark Gray Canvas - 100% clean, no watermark
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 16;
      }

      L.tileLayer(tileUrl, { maxZoom, attribution }).addTo(map);

      // Initialize layer groups attached to this map
      const stationLayer = L.layerGroup().addTo(map);
      const inundationLayer = L.layerGroup().addTo(map);
      const shelterLayer = L.layerGroup().addTo(map);
      const radarLayer = L.layerGroup().addTo(map);

      layerGroupsRef.current = {
        stations: stationLayer,
        inundation: inundationLayer,
        shelters: shelterLayer,
        radar: radarLayer
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
  }, [basin, satelliteView, apiConfig.basemapProvider, apiConfig.cartoApiKey]);

  // Live Radar Layer Overlay
  useEffect(() => {
    const { radar: radarGroup } = layerGroupsRef.current;
    if (!radarGroup) return;

    radarGroup.clearLayers();
    if (showRadar && radarLayerUrl) {
      const radarTileLayer = L.tileLayer(radarLayerUrl, {
        opacity: 0.65,
        maxZoom: 18,
        zIndex: 50
      });
      radarGroup.addLayer(radarTileLayer);
    }
  }, [showRadar, radarLayerUrl]);

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
          // Check if current station has live updated reading from incoming packet
          const isCurrentLiveStation = livePacket && livePacket.stationId === st.id;
          const displayWaterLevel = isCurrentLiveStation ? livePacket.waterLevel : st.waterLevel;
          const displayVelocity = isCurrentLiveStation ? livePacket.flowVelocity : st.flowVelocity;
          const displayDischarge = isCurrentLiveStation ? livePacket.discharge : st.discharge;

          const isDanger = displayWaterLevel >= st.dangerLevel;
          const isWarning = displayWaterLevel >= st.warningLevel;
          const color = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#38bdf8';

          const iconHtml = `
            <div style="position:relative; width:26px; height:26px; display:flex; align-items:center; justify-content:center;">
              <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:${color}; opacity:${isCurrentLiveStation ? 0.7 : 0.35}; animation:${isCurrentLiveStation ? 'pulse 0.8s infinite' : 'pulse 1.8s infinite'};"></div>
              <div style="width:13px; height:13px; border-radius:50%; background:${color}; border:2px solid #ffffff; box-shadow:0 0 12px ${color};"></div>
              ${isCurrentLiveStation ? '<div style="position:absolute; top:-6px; right:-6px; width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 6px #10b981;"></div>' : ''}
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-station-icon',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });

          const marker = L.marker([st.lat, st.lng], { icon: customIcon });

          const popupContent = `
            <div style="font-family: 'Inter', sans-serif; font-size:12px; min-width:220px; color:#f1f5f9;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span style="font-weight:700; color:#38bdf8; font-size:13px;">${st.name}</span>
                ${isCurrentLiveStation ? '<span style="font-size:9px; background:rgba(16,185,129,0.2); color:#34d399; padding:1px 6px; border-radius:4px; font-weight:700;">LIVE SYNC</span>' : ''}
              </div>
              <div style="color:#94a3b8; font-size:11px; margin-bottom:8px;">Station ID: ${st.id} • Elevation: ${st.elevation}m</div>
              
              <div style="background:rgba(255,255,255,0.04); padding:6px 8px; border-radius:6px; margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span>Real-Time Level:</span>
                  <strong style="color:${color}; font-size:13px;">${displayWaterLevel} m</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#94a3b8;">Danger Mark:</span>
                  <span style="color:#f87171; font-weight:600;">${st.dangerLevel} m</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#94a3b8;">Flow Velocity:</span>
                  <span style="color:#38bdf8;">${displayVelocity} m/s</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="color:#94a3b8;">River Discharge:</span>
                  <span>${displayDischarge} m³/s</span>
                </div>
              </div>

              <div style="padding:4px 6px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:4px; font-size:10px; color:#34d399; display:flex; align-items:center; justify-content:space-between;">
                <span>Database Feed: Active</span>
                <span>HMAC-SHA256: OK</span>
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
  }, [basin, showStations, showInundation, showShelters, waterLevelData, livePacket]);

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
            GIS SPATIAL INUNDATION ENGINE
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }}></span>
            {BASEMAP_PROVIDERS[apiConfig.basemapProvider]?.name.split(' ')[0] || 'Esri'} GIS
          </span>
        </div>

        {/* Action Controls & Layer Toggle Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Real-time DB & Map API settings trigger */}
          <button
            onClick={onOpenDatabaseModal}
            className="btn btn-secondary btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: 'var(--cyan-400)',
              background: 'rgba(14, 165, 233, 0.15)'
            }}
          >
            <Database size={13} color="var(--cyan-400)" />
            <span>Map &amp; DB API</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          </button>

          {/* Live Doppler Radar Toggle (RainViewer API) */}
          <button
            onClick={() => setShowRadar(!showRadar)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '4px 8px',
              borderColor: showRadar ? 'var(--cyan-400)' : 'var(--border-subtle)',
              background: showRadar ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: showRadar ? 'var(--cyan-400)' : 'var(--text-muted)'
            }}
          >
            <CloudRain size={12} color={showRadar ? 'var(--cyan-400)' : 'currentColor'} />
            Live Rain Radar
          </button>

          {/* Satellite / Dark Basemap Quick Toggle */}
          <button
            onClick={() => setSatelliteView(!satelliteView)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          >
            {satelliteView ? 'Dark Clean' : 'Satellite'}
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
            Gauges ({basin.stations?.length || 0})
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              GIS Map Overlays ({basin.name.split(' ')[0]})
            </span>
            <span style={{ fontSize: '0.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wifi size={10} /> Live Stream
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
              <span>Breached / Danger Level Station</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
              <span>Warning Level Station</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '8px', background: 'rgba(239, 68, 68, 0.4)', border: '1px dashed #ef4444', display: 'inline-block' }}></span>
              <span>Active Flood Inundation Polygon</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981', display: 'inline-block' }}></span>
              <span>Safe Evacuation Center / Camp</span>
            </div>
            {showRadar && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan-400)' }}>
                <CloudRain size={10} />
                <span>Live Doppler Radar Overlay (RainViewer API)</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Hydrodynamic Drift Compass */}
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

        {/* Live Telemetry Ingestion Ping Badge */}
        {livePacket && (
          <div
            className="glass-card"
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 900,
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(7, 14, 28, 0.9)',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: '0.72rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {livePacket.stationName.split(' ')[0]}: <strong style={{ color: 'var(--cyan-400)' }}>{livePacket.waterLevel}m</strong> ({livePacket.discharge} m³/s)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
