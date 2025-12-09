function IncidentList({ incidents }) {
  return (
    <div className="card">
      <h2>Recent Reports</h2>
      {incidents.length === 0 && <p>No reports yet.</p>}

      <ul className="incident-list">
        {incidents
          .slice()
          .reverse()
          .map((i) => (
            <li key={i.id}>
              <strong>{i.type}</strong>
              <p>{i.description}</p>
              <small>
                {i.lat}, {i.lng}
              </small>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default IncidentList;
