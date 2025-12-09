import { useState } from "react";

function ReportForm({ onAddIncident }) {
  const [type, setType] = useState("Harassment");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (!type || !description || Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      alert("Enter all values");
      return;
    }

    onAddIncident({
      type,
      description,
      lat: latNum,
      lng: lngNum,
    });

    setDescription("");
    setLat("");
    setLng("");
  };

  return (
    <div className="card">
      <h2>Report Incident</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
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
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Latitude
          <input value={lat} onChange={(e) => setLat(e.target.value)} />
        </label>

        <label>
          Longitude
          <input value={lng} onChange={(e) => setLng(e.target.value)} />
        </label>

        <button className="primary-btn">Submit</button>
      </form>
    </div>
  );
}

export default ReportForm;
