// components/decanting/ProductLinesSummaryList.jsx
import ProductLineSummaryRow from './ProductLineSummaryRow';

export default function ProductLinesSummaryList({ lines, onEdit }) {
  return (
    <section className="line-summary-list">
      <div className="line-summary-list__header">
        <h3>Product Lines Summary</h3>
        <button type="button" className="line-summary-list__edit" onClick={onEdit}>
          <i className="ti ti-edit" aria-hidden="true" /> Edit
        </button>
      </div>
      <div className="line-summary-list__rows">
        {lines.map((line) => (
          <ProductLineSummaryRow key={line.name} {...line} />
        ))}
      </div>
    </section>
  );
}