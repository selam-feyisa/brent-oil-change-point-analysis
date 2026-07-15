/**
 * Simple list of researched events. TODO: make rows clickable to highlight
 * the corresponding point on PriceChart (drill-down requirement).
 */
export default function EventList({ events }) {
  return (
    <div className="card">
      <h3>Key Events</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th>Date</th>
            <th>Event</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.Date + e.Event}>
              <td>{e.Date}</td>
              <td>{e.Event}</td>
              <td>{e.Category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
