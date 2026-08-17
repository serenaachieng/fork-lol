// components/common/SectionDivider.jsx
export default function SectionDivider({ title, subtitle }) {
  return (
    <div className="section-divider">
      <div className="section-divider__heading">
        <h3 className="section-divider__title">{title}</h3>
        {subtitle && <p className="section-divider__subtitle">{subtitle}</p>}
      </div>
      <div className="section-divider__rule" />
    </div>
  );
}