import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

/**
 * Snaps a target date to the closest date actually present in `data`
 * (needed because the chart's X axis is a category scale keyed on the
 * exact date strings in the price series - weekend/holiday event dates
 * won't exist in the series otherwise).
 */
function nearestDateInSeries(targetDate, data) {
  if (!data.length) return null;
  const target = new Date(targetDate).getTime();
  let best = data[0].Date;
  let bestDiff = Infinity;
  for (const row of data) {
    const diff = Math.abs(new Date(row.Date).getTime() - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = row.Date;
    }
  }
  return best;
}

export default function PriceChart({ data, events = [], changePoints = [], selectedEvent, onSelectPoint }) {
  const eventMarkers = events
    .map((e) => ({ ...e, snappedDate: nearestDateInSeries(e.Date, data) }))
    .filter((e) => e.snappedDate);

  return (
    <ResponsiveContainer width="100%" height={420}>
      <LineChart data={data} onClick={(e) => e && e.activeLabel && onSelectPoint && onSelectPoint(e.activeLabel)}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262a33" />
        <XAxis dataKey="Date" tick={{ fontSize: 11 }} minTickGap={40} />
        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line type="monotone" dataKey="Price" stroke="#4dabf7" dot={false} strokeWidth={1.5} />

        {/* Researched events - thin amber lines, brighter/labelled if selected */}
        {eventMarkers.map((e) => {
          const isSelected = selectedEvent && selectedEvent.Event === e.Event;
          return (
            <ReferenceLine
              key={e.Event + e.Date}
              x={e.snappedDate}
              stroke={isSelected ? "#ffd43b" : "#ffa94d"}
              strokeOpacity={isSelected ? 1 : 0.45}
              strokeWidth={isSelected ? 2 : 1}
              strokeDasharray={isSelected ? undefined : "2 3"}
              label={
                isSelected
                  ? { value: e.Event, position: "top", fill: "#ffd43b", fontSize: 11 }
                  : undefined
              }
            />
          );
        })}

        {/* Detected change points - solid red lines */}
        {changePoints.map((cp) => (
          <ReferenceLine
            key={cp.date}
            x={nearestDateInSeries(cp.date, data)}
            stroke="#ff6b6b"
            strokeWidth={2}
            label={{ value: `Change point: ${cp.date}`, position: "insideTopLeft", fill: "#ff6b6b", fontSize: 11 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
