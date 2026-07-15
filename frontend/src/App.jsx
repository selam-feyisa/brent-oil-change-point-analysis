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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrices(range.start, range.end).then(setPrices).catch((e) => setError(e.message));
    fetchEvents().then(setEvents).catch((e) => setError(e.message));
    // changepoints.json won't exist until you export it from the notebook -
    // that's expected until you do Step 3 below.
    fetchChangePoints().then(setChangePoints).catch(() => {});
  }, [range]);

  return (
    <div className="app">
      <h1>Brent Oil Price - Change Point Dashboard</h1>
      <p style={{ opacity: 0.7 }}>Starter scaffold. Wire up the TODOs to finish it.</p>

      <div className="card">
        <Filters start={range.start} end={range.end} onChange={setRange} />
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
        <PriceChart data={prices} changePoints={changePoints} />
      </div>

      <EventList events={events} />
    </div>
  );
}
