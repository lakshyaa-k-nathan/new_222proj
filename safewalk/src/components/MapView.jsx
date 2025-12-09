import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

const baseMarker =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/";
const iconSize = [25, 41];
const iconAnchor = [12, 41];

const redIcon = new L.Icon({
  iconUrl: baseMarker + "marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize,
  iconAnchor,
});

const orangeIcon = new L.Icon({
  iconUrl: baseMarker + "marker-icon-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize,
  iconAnchor,
});

const yellowIcon = new L.Icon({
  iconUrl: baseMarker + "marker-icon-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize,
  iconAnchor,
});

const violetIcon = new L.Icon({
  iconUrl: baseMarker + "marker-icon-violet.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize,
  iconAnchor,
});

const blueIcon = new L.Icon({
  iconUrl: baseMarker + "marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize,
  iconAnchor,
});

const greenIcon = new L.Icon({
  iconUrl: baseMarker + "marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize,
  iconAnchor,
});

// pick icon based on incident type
function getIconForType(type) {
  if (!type) return blueIcon;
  const t = type.toLowerCase();

  if (t.includes("assault")) return redIcon;
  if (t.includes("harassment")) return orangeIcon;
  if (t.includes("theft")) return yellowIcon;
  if (t.includes("stalking")) return violetIcon;
  return blueIcon; // "Other" or anything else
}

// listens for map clicks and notifies parent
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });
  return null;
}

function MapView({ incidents, userLocation, selectedLocation, onMapClick }) {
  const defaultCenter = [40.1106, -88.2073]; // example: UIUC

  return (
    <MapContainer
      center={defaultCenter}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Handle map clicks */}
      <MapClickHandler onMapClick={onMapClick} />

      {/* Heat map circles – soft red glow around each incident */}
      {incidents.map((incident) => (
        <Circle
          key={`heat-${incident.id}`}
          center={[incident.lat, incident.lng]}
          radius={80}
          pathOptions={{
            color: "rgba(220,38,38,0.4)",
            fillColor: "rgba(248,113,113,0.6)",
            fillOpacity: 0.25,
            weight: 1,
          }}
        />
      ))}

      {/* Incident markers – color coded by type */}
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={getIconForType(incident.type)}
        >
          <Popup>
            <strong>{incident.type}</strong>
            <br />
            {incident.description}
            <br />
            <small>
              {incident.address && (
                <>
                  {incident.address.split(",").slice(0, 3).join(", ")}
                  <br />
                </>
              )}
              {incident.lat.toFixed(5)}, {incident.lng.toFixed(5)}
              <br />
              {incident.timestamp &&
                new Date(incident.timestamp).toLocaleString()}
            </small>
          </Popup>
        </Marker>
      ))}

      {/* User current location – blue dot */}
      {userLocation && (
        <>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={20}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#2563eb",
              fillOpacity: 0.4,
              weight: 2,
            }}
          />
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={blueIcon}
          >
            <Popup>You are here</Popup>
          </Marker>
        </>
      )}

      {/* Selected location for next report – green marker */}
      {selectedLocation && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={greenIcon}
        >
          <Popup>Selected report location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapView;
