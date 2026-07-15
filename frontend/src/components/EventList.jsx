import { useMemo, useState } from "react";

export default function EventList({ events, selectedEvent, onSelectEvent }) {
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(events.map((e) => e.Category))],
    [events]
  );

  const filtered = categoryFilter === "All" ? events : events.filter((e) => e.Category === categoryFilter);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Key Events</h3>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <p style={{ opacity: 0.6, fontSize: 13, marginTop: 6 }}>
        Click a row to highlight it on the chart above.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th style={{ padding: "6px 4px" }}>Date</th>
            <th style={{ padding: "6px 4px" }}>Event</th>
            <th style={{ padding: "6px 4px" }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => {
            const isSelected = selectedEvent && selectedEvent.Event === e.Event;
            return (
              <tr
                key={e.Date + e.Event}
                onClick={() => onSelectEvent(isSelected ? null : e)}
                style={{
                  cursor: "pointer",
                  background: isSelected ? "#2b2410" : "transparent",
                  borderTop: "1px solid #262a33",
                }}
              >
                <td style={{ padding: "6px 4px", whiteSpace: "nowrap" }}>{e.Date}</td>
                <td style={{ padding: "6px 4px" }}>{e.Event}</td>
                <td style={{ padding: "6px 4px", opacity: 0.8 }}>{e.Category}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
