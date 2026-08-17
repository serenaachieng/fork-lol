// components/common/PrimaryButton.jsx
export default function PrimaryButton({ children, type = "button", disabled, onClick }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="btn-primary"
    >
      {children}
    </button>
  );
}