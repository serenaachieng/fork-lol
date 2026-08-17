// components/ActivitiesNavDrawer.jsx
import { NavLink } from 'react-router-dom';

const ACTIVITIES = [
  { label: 'Packing',    path: '/packing',    icon: 'ti-package' },
  { label: 'Collection', path: '/collection', icon: 'ti-truck' },
  { label: 'Decanting',  path: '/decanting',  icon: 'ti-flask' },
  { label: 'Delivery',   path: '/delivery',   icon: 'ti-truck-delivery' },
];

const ActivitiesNavDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="nav-dropdown">
      <div className="nav-dropdown-header">
        <span className="nav-dropdown-title">Activities</span>
        <button
          className="nav-dropdown-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <i className="ti ti-x" aria-hidden="true" />
        </button>
      </div>

      <ul className="nav-dropdown-links">
        {ACTIVITIES.map(({ label, path, icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-dropdown-link ${isActive ? 'nav-dropdown-link--active' : ''}`
              }
            >
              <i className={`ti ${icon}`} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivitiesNavDrawer;