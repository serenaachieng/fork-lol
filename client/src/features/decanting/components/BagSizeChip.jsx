// components/decanting/BagSizeChip.jsx
export default function BagSizeChip({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      className={`bag-size-chip ${selected ? 'bag-size-chip--selected' : ''}`}
      onClick={onToggle}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}