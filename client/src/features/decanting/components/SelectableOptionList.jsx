// components/common/SelectableOptionList.jsx
import SelectableOptionCard from './SelectableOptionCard';

export default function SelectableOptionList({ name, options, value, onChange }) {
  return (
    <div className="option-list">
      {options.map((opt) => (
        <SelectableOptionCard
          key={opt.value}
          name={name}
          value={opt.value}
          title={opt.title}
          subtitle={opt.subtitle}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
        />
      ))}
    </div>
  );
}