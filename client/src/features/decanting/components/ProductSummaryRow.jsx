// components/decanting/ProductLineSummaryRow.jsx
export default function ProductLineSummaryRow({ name, target, packed, bags, bagSize, shortfall }) {
  return (
    <div className="line-summary-row">
      <div>
        <h4 className="line-summary-row__name">{name}</h4>
        {shortfall > 0 && (
          <span className="line-summary-row__shortfall">
            Shortfall: {shortfall.toLocaleString()} kg
          </span>
        )}
      </div>
      <div className="line-summary-row__stats">
        <div>
          <span className="line-summary-row__stat-label">Target</span>
          <span className="line-summary-row__stat-value">{target.toLocaleString()} kg</span>
        </div>
        <div>
          <span className="line-summary-row__stat-label">Packed</span>
          <span className={`line-summary-row__stat-value ${shortfall > 0 ? 'line-summary-row__stat-value--error' : ''}`}>
            {packed.toLocaleString()} kg
          </span>
        </div>
        <div>
          <span className="line-summary-row__stat-label">Bags ({bagSize}kg)</span>
          <span className="line-summary-row__stat-value">{bags}</span>
        </div>
      </div>
    </div>
  );
}