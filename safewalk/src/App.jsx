import { useState, useEffect } from "react";
import MapView from "./components/MapView.jsx";
import ReportForm from "./components/ReportForm.jsx";
import IncidentList from "./components/IncidentList.jsx";
import Login from "./components/Login.jsx";


function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("incidents");
    return saved ? JSON.parse(saved) : [];
  });

  // User's current location for the blue dot
  const [userLocation, setUserLocation] = useState(null);

  // Where the next report is attached (lat, lng, address)
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("incidents", JSON.stringify(incidents));
  }, [incidents]);

  // Reverse geocode helper: lat,lng -> address string
  const fetchAddress = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`;
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "en",
        },
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      return data.display_name || null;
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      return null;
    }
  };

  // Set selectedLocation and look up a readable address
  const updateSelectedLocation = async (lat, lng) => {
    const base = { lat, lng };

    // Immediate feedback
    setSelectedLocation({
      ...base,
      address: "Looking up address…",
    });

    const address = await fetchAddress(lat, lng);

    setSelectedLocation({
      ...base,
      address: address || "Address not found (near these coordinates)",
    });
  };

  const handleAddIncident = (incident) => {
    if (!selectedLocation) {
      alert("Please select a location on the map or use your location first.");
      return;
    }

    setIncidents((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...incident,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: selectedLocation.address || null,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // NEW: delete incident by id
  const handleDeleteIncident = (id) => {
    setIncidents((prev) => prev.filter((incident) => incident.id !== id));
  };

  // Called when "Use My Location" succeeds
  const handleSetUserLocation = (loc) => {
    setUserLocation(loc);
    updateSelectedLocation(loc.lat, loc.lng);
  };

  // Called when user clicks on the map
  const handleMapClick = (loc) => {
    updateSelectedLocation(loc.lat, loc.lng);
  };

  if (!user) {
  return <Login onLogin={setUser} />;
  }


  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>SafeWalk</h1>
          <p>
            A collaborative safety map built to keep our community informed,
            aware, and looking out for one another.
          </p>
        </div>
      </header>

      <main className="app-main">
        <section className="map-section">
          <MapView
            incidents={incidents}
            userLocation={userLocation}
            selectedLocation={selectedLocation}
            onMapClick={handleMapClick}
          />
        </section>

        <section className="side-section">
          <ReportForm
            onAddIncident={handleAddIncident}
            onSetUserLocation={handleSetUserLocation}
            selectedLocation={selectedLocation}
          />
          <IncidentList
            incidents={incidents}
            userLocation={userLocation}
            onDeleteIncident={handleDeleteIncident}
          />
        </section>
      </main>

      <footer className="app-footer">
        <small>
          This is a demo project. Reports are stored only in your browser
          (localStorage).
        </small>
      </footer>
    </div>
  );
}

export default App;
