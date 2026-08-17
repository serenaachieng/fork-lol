// components/common/SelectableOptionCard.jsx
export default function SelectableOptionCard({ name, value, title, subtitle, checked, onChange }) {
  return (
    <label className={`option-card ${checked ? 'option-card--selected' : ''}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="option-card__input"
      />
      <span className="option-card__title">{title}</span>
      <span className="option-card__subtitle">{subtitle}</span>
    </label>
  );
}