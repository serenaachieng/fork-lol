// components/common/DatePickerField.jsx
export default function DatePickerField({ id, label, value, onChange, required = true }) {
  return (
    <div className="text-field">
      <label htmlFor={id} className="text-field__label">
        {label} {required && <span className="text-field__required">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        onChange={onChange}
        required={required}
        className="text-field__input"
      />
    </div>
  );
}