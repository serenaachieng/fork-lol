// components/navigation/MobileBottomNav.jsx
import { useRef, useEffect, useState } from 'react';
import { NavLink, useLocation, useMatch } from 'react-router-dom';

const ACTIVITIES = [
  { label: 'Packing',    path: '/noc/packing',       icon: 'ti-package' },
  { label: 'Collection', path: '/noc/collection',    icon: 'ti-truck' },
  { label: 'Decanting',  path: '/noc/decanting', icon: 'ti-flask' },
  { label: 'Delivery',   path: '/noc/procurement',      icon: 'ti-truck-delivery' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // Find which tab is active by matching the current path against
  // each activity's path (startsWith, so nested routes like
  // /noc/decanting/xyz still count as the Decanting tab).
  const activeIndex = ACTIVITIES.findIndex((a) =>
    location.pathname.startsWith(a.path)
  );

  // Slide the indicator bar under whichever tab is active, measuring
  // real DOM positions rather than assuming equal-width columns —
  // keeps it correct even if label lengths vary the tab width slightly.
  useEffect(() => {
    if (!navRef.current || activeIndex === -1) return;
    const activeEl = navRef.current.children[activeIndex];
    if (!activeEl) return;

    setIndicatorStyle({
      width: `${activeEl.offsetWidth}px`,
      transform: `translateX(${activeEl.offsetLeft}px)`,
    });
  }, [activeIndex]);

  return (
    <nav className="mobile-bottom-nav" aria-label="Activities" ref={navRef}>
      {ACTIVITIES.map(({ label, path, icon }, index) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `mobile-bottom-nav__link ${isActive ? 'mobile-bottom-nav__link--active' : ''}`
          }
        >
          <i className={`ti ${icon}`} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}

      {/* Sliding indicator — a single element, repositioned via
          transform rather than re-rendered per tab */}
      <span className="mobile-bottom-nav__indicator" style={indicatorStyle} aria-hidden="true" />
    </nav>
  );
}