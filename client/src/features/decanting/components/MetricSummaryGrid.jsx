// components/decanting/MetricsSummaryGrid.jsx
import MetricStat from './MetricStat';

export default function MetricsSummaryGrid({ metrics }) {
  return (
    <section className="metrics-grid">
      {metrics.map((m) => (
        <MetricStat key={m.label} {...m} />
      ))}
    </section>
  );
}