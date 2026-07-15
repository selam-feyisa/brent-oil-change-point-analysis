/**
 * Date range selector. TODO: add event-category filter, and a "jump to
 * change point" shortcut once /api/changepoints returns real data.
 */
export default function Filters({ start, end, onChange }) {
  return (
    <div className="controls">
      <label>
        From:{" "}
        <input type="date" value={start} onChange={(e) => onChange({ start: e.target.value, end })} />
      </label>
      <label>
        To:{" "}
        <input type="date" value={end} onChange={(e) => onChange({ start, end: e.target.value })} />
      </label>
    </div>
  );
}
