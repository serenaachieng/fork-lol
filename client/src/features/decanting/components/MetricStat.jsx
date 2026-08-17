// components/decanting/MetricStat.jsx
export default function MetricStat({ label, value, unit, variant = 'default', icon }) {
  return (
    <div className="metric-stat">
      <span className={`metric-stat__label ${variant === 'error' ? 'metric-stat__label--error' : ''}`}>
        {icon && <i className={`ti ${icon}`} aria-hidden="true" />}
        {label}
      </span>
      <div className={`metric-stat__value ${variant === 'error' ? 'metric-stat__value--error' : ''}`}>
        {value} {unit && <span className="metric-stat__unit">{unit}</span>}
      </div>
    </div>
  );
}