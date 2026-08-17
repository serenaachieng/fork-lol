// components/common/TextareaField.jsx
export default function TextareaField({ id, label, value, onChange, placeholder, rows = 4, optional }) {
  return (
    <div className="text-field">
      <label htmlFor={id} className="text-field__label">
        {label} {optional && <span className="text-field__optional">(optional)</span>}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="text-field__input textarea-field__input"
      />
    </div>
  );
}