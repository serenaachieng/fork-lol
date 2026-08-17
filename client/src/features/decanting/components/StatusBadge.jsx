// components/common/StatusBadge.jsx
export default function StatusBadge({ status = 'success', children }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {children}
    </span>
  );
}