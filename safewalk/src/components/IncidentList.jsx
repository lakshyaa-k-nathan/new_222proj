function shortenAddress(address) {
  if (!address) return "";
  const parts = address.split(",");
  return parts.slice(0, 3).map((p) => p.trim()).join(", ");
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "";
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;

  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hr${diffH === 1 ? "" : "s"} ago`;

  const diffD = Math.floor(diffH / 24);
  return `${diffD} day${diffD === 1 ? "" : "s"} ago`;
}

function distanceInMeters(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371000; // Earth radius in meters
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.asin(Math.sqrt(h));
  return R * c;
}

function IncidentList({ incidents, userLocation, onDeleteIncident }) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="card reports-card">
        <div className="reports-header">
          <h2>Recent Reports</h2>
          <span className="reports-subtitle">No reports yet</span>
        </div>
        <p className="reports-empty">
          As people share incidents, they will appear here so others can stay
          aware of what is happening nearby.
        </p>
      </div>
    );
  }

  const sorted = incidents
    .slice()
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return (
    <div className="card reports-card">
      <div className="reports-header">
        <h2>Recent Reports</h2>
        <span className="reports-subtitle">
          Showing the latest {Math.min(sorted.length, 5)} reports
        </span>
      </div>

      <ul className="incident-list">
        {sorted.slice(0, 5).map((incident) => {
          const timeAgo = formatTimeAgo(incident.timestamp);
          const address = shortenAddress(incident.address);
          const isNear =
            userLocation &&
            distanceInMeters(userLocation, incident) < 250; // within 250m

          return (
            <li key={incident.id} className="incident-item">
              <div className="incident-top-row">
                <span className="incident-tag">{incident.type}</span>
                {isNear && <span className="near-badge">Near you</span>}
              </div>

              {address && (
                <div className="incident-address">{address}</div>
              )}

              {incident.description && (
                <p className="incident-description">
                  {incident.description}
                </p>
              )}

              <div className="incident-bottom-row">
                <div className="incident-meta">
                  <span className="time-ago">{timeAgo}</span>
                  {userLocation && (
                    <span className="distance-text">
                      {Math.round(
                        distanceInMeters(userLocation, incident)
                      )}{" "}
                      m away
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    onDeleteIncident && onDeleteIncident(incident.id)
                  }
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default IncidentList;
