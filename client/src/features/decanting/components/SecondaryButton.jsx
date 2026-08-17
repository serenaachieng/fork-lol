// components/common/SecondaryButton.jsx
export default function SecondaryButton({ children, type = 'button', disabled, onClick, className = '' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-secondary-outline ${className}`.trim()}
    >
      {children}
    </button>
  );
}