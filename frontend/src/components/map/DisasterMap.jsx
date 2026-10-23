import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RiskBadge from '../ui/RiskBadge';

const iconCache = {};

function makeIcon(color, label) {
  const key = `${color}-${label}`;
  if (iconCache[key]) return iconCache[key];
  iconCache[key] = L.divIcon({
    className: '',
    html: `<div style="background:${color};width:26px;height:26px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,.4)">${label}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
  return iconCache[key];
}

const ICONS = {
  user: makeIcon('#14b8a6', '📍'),
  shelter: makeIcon('#2563eb', '🏠'),
  hospital: makeIcon('#dc2626', '🏥'),
  resource: makeIcon('#ca8a04', '🚑'),
  emergency: makeIcon('#b91c1c', '🆘'),
};

const RISK_COLORS = { LOW: '#0f766e', MEDIUM: '#b45309', HIGH: '#b91c1c' };

const DEFAULT_FILTERS = {
  user: true,
  shelters: true,
  hospitals: true,
  resources: true,
  emergencies: true,
  riskAreas: true,
};

export default function DisasterMap({
  center,
  userLocation,
  shelters = [],
  hospitals = [],
  resources = [],
  emergencies = [],
  riskAreas = [],
  height = '480px',
  showFilters = true,
}) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const mapCenter = useMemo(
    () => [center?.lat ?? userLocation?.lat ?? 14.6819, center?.lng ?? userLocation?.lng ?? 77.6006],
    [center, userLocation]
  );

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  return (
    <div className="space-y-3">
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {[
            ['user', 'My Location'],
            ['shelters', 'Shelters'],
            ['hospitals', 'Hospitals'],
            ['resources', 'Resources'],
            ['emergencies', 'Emergencies'],
            ['riskAreas', 'Risk Areas'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filters[key]
                  ? 'border-teal-500/50 bg-teal-500/15 text-teal-300'
                  : 'border-command-700 bg-command-900 text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-command-700" style={{ height }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filters.user && userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={ICONS.user}>
              <Popup>Your registered location</Popup>
            </Marker>
          )}

          {filters.shelters &&
            shelters.map((s) => (
              <Marker key={s._id} position={[s.latitude, s.longitude]} icon={ICONS.shelter}>
                <Popup>
                  <strong>{s.name}</strong>
                  <br />
                  {s.address}
                  <br />
                  Capacity: {s.currentOccupancy}/{s.capacity}
                </Popup>
              </Marker>
            ))}

          {filters.hospitals &&
            hospitals.map((h) => (
              <Marker key={h._id} position={[h.latitude, h.longitude]} icon={ICONS.hospital}>
                <Popup>
                  <strong>{h.name}</strong>
                  <br />
                  {h.address}
                  <br />
                  Status: {h.status}
                </Popup>
              </Marker>
            ))}

          {filters.resources &&
            resources.map((r) => (
              <Marker key={r._id} position={[r.latitude, r.longitude]} icon={ICONS.resource}>
                <Popup>
                  <strong>{r.name}</strong>
                  <br />
                  {r.type} — {r.status}
                </Popup>
              </Marker>
            ))}

          {filters.emergencies &&
            emergencies.map((e) => (
              <Marker key={e._id} position={[e.latitude, e.longitude]} icon={ICONS.emergency}>
                <Popup>
                  <strong>{e.disasterType}</strong>
                  <br />
                  {e.locationName}
                  <br />
                  Urgency: {e.urgency} | Status: {e.status}
                </Popup>
              </Marker>
            ))}

          {filters.riskAreas &&
            riskAreas.map((a) => (
              <Circle
                key={a._id}
                center={[a.latitude, a.longitude]}
                radius={(a.radiusKm || 5) * 1000}
                pathOptions={{
                  color: RISK_COLORS[a.riskLevel] || RISK_COLORS.MEDIUM,
                  fillColor: RISK_COLORS[a.riskLevel] || RISK_COLORS.MEDIUM,
                  fillOpacity: 0.15,
                  weight: 2,
                }}
              >
                <Popup>
                  <strong>{a.title}</strong>
                  <br />
                  <RiskBadge level={a.riskLevel} />
                  <br />
                  {a.affectedArea}
                </Popup>
              </Circle>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
