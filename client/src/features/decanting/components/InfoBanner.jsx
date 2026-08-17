// components/common/InfoBanner.jsx
const ICONS = {
  info: 'ti-info-circle',
  warning: 'ti-alert-triangle',
  error: 'ti-alert-circle',
};

export default function InfoBanner({ variant = 'info', children }) {
  return (
    <div className={`info-banner info-banner--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <i className={`ti ${ICONS[variant]}`} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}