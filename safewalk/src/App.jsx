import { useState, useEffect } from "react";
import MapView from "./components/MapView.jsx";
import ReportForm from "./components/ReportForm.jsx";
import IncidentList from "./components/IncidentList.jsx";

function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("incidents");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("incidents", JSON.stringify(incidents));
  }, [incidents]);

  const handleAddIncident = (incident) => {
    setIncidents((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...incident,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SafeWalk</h1>
        <p>See and report unsafe areas.</p>
      </header>

      <main className="app-main">
        <section className="map-section">
          <MapView incidents={incidents} />
        </section>

        <section className="side-section">
          <ReportForm onAddIncident={handleAddIncident} />
          <IncidentList incidents={incidents} />
        </section>
      </main>

      <footer className="app-footer">
        <small>Prototype — stored only in your browser.</small>
      </footer>
    </div>
  );
}

export default App;
