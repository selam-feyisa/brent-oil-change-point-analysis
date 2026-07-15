import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

/**
 * Renders the Brent price series with optional reference lines for
 * detected change points and/or highlighted events.
 *
 * TODO: wire up event highlight markers (e.g. <ReferenceDot> per event)
 * and a drill-down click handler once you decide on the interaction.
 */
export default function PriceChart({ data, changePoints = [] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262a33" />
        <XAxis dataKey="Date" tick={{ fontSize: 11 }} minTickGap={40} />
        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Line type="monotone" dataKey="Price" stroke="#4dabf7" dot={false} strokeWidth={1.5} />
        {changePoints.map((cp) => (
          <ReferenceLine key={cp.date} x={cp.date} stroke="#ff6b6b" strokeDasharray="4 4" />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
