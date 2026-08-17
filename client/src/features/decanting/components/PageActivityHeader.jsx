import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LogoutConfirmDialog from '../../EmployeeLogIn/Logout_Confirm_Dialog';

const getInitials = (firstName, lastName) => {
  const first = firstName?.[0] ?? '';
  const last = lastName?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
};

const PageHeader = ({ status = '', onLogout, showBack = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await onLogout();
  };

  return (
    <>
      <header className="page-header">
        <div className="page-header-left">
          {showBack && (
            <button
              className="page-header-icon-btn page-header-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              data-tooltip="Back"
            >
              <i className="ti ti-arrow-left" aria-hidden="true" />
            </button>
          )}

          <div className="page-header-status">
            <span className="page-header-status-dot" aria-hidden="true" />
            <span>{status}</span>
          </div>
        </div>

        <div className="page-header-right">
          {/* Identity block — now always visible, right-aligned.
              Previously hidden on desktop when the sidebar owned this. */}
          <div className="page-header-identity">
            <span className="page-header-avatar" aria-hidden="true">
              {getInitials(user?.firstName, user?.lastName)}
            </span>
            <div className="page-header-identity__text">
              <span className="page-header-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="page-header-email">
                {user?.email ?? user?.role}
              </span>
            </div>
          </div>

          <button
            className="page-header-icon-btn page-header-logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
            aria-label="Log out"
            data-tooltip="Log out"
          >
            <i className="ti ti-logout" aria-hidden="true" />
          </button>
        </div>
      </header>

      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default PageHeader;