import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapView({ incidents }) {
  const defaultCenter = [40.1106, -88.2073];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {incidents.map((i) => (
        <Marker key={i.id} position={[i.lat, i.lng]} icon={markerIcon}>
          <Popup>
            <strong>{i.type}</strong>
            <br />
            {i.description}
            <br />
            <small>{new Date(i.timestamp).toLocaleString()}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
