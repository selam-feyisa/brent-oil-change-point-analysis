import { useEffect, useState } from "react";
import PriceChart from "./components/PriceChart.jsx";
import Filters from "./components/Filters.jsx";
import EventList from "./components/EventList.jsx";
import { fetchPrices, fetchEvents, fetchChangePoints } from "./services/api.js";

export default function App() {
  const [prices, setPrices] = useState([]);
  const [events, setEvents] = useState([]);
  const [changePoints, setChangePoints] = useState([]);
  const [range, setRange] = useState({ start: "", end: "" });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrices(range.start, range.end).then(setPrices).catch((e) => setError(e.message));
  }, [range]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch((e) => setError(e.message));
    fetchChangePoints()
      .then((cps) => setChangePoints(Array.isArray(cps) ? cps : []))
      .catch(() => setChangePoints([])); // 404 until changepoints.json is exported - fine
  }, []);

  // Clicking an event jumps the date range to a window around it, so the
  // chart re-centers on that period (the "drill-down" requirement).
  function handleSelectEvent(event) {
    setSelectedEvent(event);
    if (event) {
      const d = new Date(event.Date);
      const start = new Date(d);
      start.setMonth(start.getMonth() - 6);
      const end = new Date(d);
      end.setMonth(end.getMonth() + 6);
      setRange({
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
      });
    }
  }

  function resetRange() {
    setRange({ start: "", end: "" });
    setSelectedEvent(null);
  }

  return (
    <div className="app">
      <h1>Brent Oil Price - Change Point Dashboard</h1>
      <p style={{ opacity: 0.7 }}>
        Explore how researched events line up with detected structural breaks in Brent crude
        prices.
      </p>

      {changePoints.length > 0 && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Detected Change Point</h3>
          {changePoints.map((cp) => (
            <div key={cp.date}>
              <p>
                <strong>{cp.date}</strong> — average price shifted from{" "}
                <strong>${cp.price_before}</strong> to <strong>${cp.price_after}</strong> (
                <strong>{cp.percent_change > 0 ? "+" : ""}{cp.percent_change}%</strong>)
              </p>
              {cp.nearest_event && (
                <p style={{ opacity: 0.8 }}>
                  Closest researched event: <em>{cp.nearest_event}</em> ({cp.nearest_event_date},{" "}
                  {cp.days_from_event} days away)
                </p>
              )}
              {cp.note && <p style={{ opacity: 0.6, fontSize: 13 }}>{cp.note}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="controls">
          <Filters start={range.start} end={range.end} onChange={setRange} />
          <button onClick={resetRange}>Reset view</button>
        </div>
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
        <PriceChart
          data={prices}
          events={events}
          changePoints={changePoints}
          selectedEvent={selectedEvent}
        />
      </div>

      <EventList events={events} selectedEvent={selectedEvent} onSelectEvent={handleSelectEvent} />
    </div>
  );
}
