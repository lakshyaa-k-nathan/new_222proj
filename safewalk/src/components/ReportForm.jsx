import { useState } from "react";

function shortenAddress(address) {
  if (!address) return "";
  const parts = address.split(",");
  // street, city, state (first 3 meaningful parts)
  const main = parts.slice(0, 3).map((p) => p.trim()).join(", ");
  return main;
}

function ReportForm({ onAddIncident, onSetUserLocation, selectedLocation }) {
  const [type, setType] = useState("Harassment");
  const [description, setDescription] = useState("");
  const [locStatus, setLocStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert("Please select a location on the map or use your location.");
      return;
    }

    if (!type || !description.trim()) {
      alert("Please add an incident type and description.");
      return;
    }

    onAddIncident({
      type,
      description: description.trim(),
    });

    setDescription("");
    setLocStatus("");
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus("Your browser does not support location.");
      return;
    }

    setLocStatus("Getting your location…");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (onSetUserLocation) {
          onSetUserLocation({ lat: latitude, lng: longitude });
        }

        setLocStatus("Location set from your device.");
      },
      () => {
        setLocStatus("Could not get your location. Please check permissions.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  let helperTitle = "No location selected";
  let helperText =
    "Tap on the map or use your location to choose where this happened.";

  if (selectedLocation) {
    if (selectedLocation.address === "Looking up address…") {
      helperTitle = "Location selected";
      helperText = "Looking up address…";
    } else if (selectedLocation.address) {
      helperTitle = "Location selected";
      helperText = shortenAddress(selectedLocation.address);
    }
  }

  return (
    <div className="card">
      <h2>Report an Incident</h2>
      <p className="card-subtitle">
        Help others stay safe by describing what you experienced.
      </p>

      <form onSubmit={handleSubmit} className="report-form">
        <label>
          Incident type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Harassment</option>
            <option>Theft</option>
            <option>Stalking</option>
            <option>Assault</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? Time of day? Any details that would help others be prepared."
          />
        </label>

        <div className="location-row">
          <div className="location-helper">
            <strong>{helperTitle}</strong>
            <span className="location-helper-text">{helperText}</span>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={handleUseMyLocation}
          >
            Use My Location
          </button>
        </div>

        {locStatus && (
          <p className="location-status">
            {locStatus}
          </p>
        )}

        <button type="submit" className="primary-btn">
          Submit report
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
