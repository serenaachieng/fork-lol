import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { PACKING } from '../../../routes/paths';
import logo from '../../../assets/LOL_Logo.jpg';
import LogoutConfirmDialog from '../../EmployeeLogIn/Logout_Confirm_Dialog';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const WORKER_ACTIVITIES = [
  { label: 'Packing',    path: PACKING.board,       icon: 'ti-package' },
  { label: 'Collection', path: '/noc/procurement',  icon: 'ti-truck' },
  { label: 'Decanting',  path: '/noc/decanting',    icon: 'ti-flask' },
  { label: 'Delivery',   path: null,                icon: 'ti-truck-delivery' },
];

const MANAGER_ACTIVITIES = [
  { label: 'Onboard ECD',           path: null,               icon: 'ti-heart-handshake' },
  { label: 'Manage Inventory',      path: '/noc/inventory',   icon: 'ti-clipboard-list' },
  { label: 'Manage Picking Slips',  path: null,               icon: 'ti-file-text' },
  { label: 'Assign Picking Slips',  path: null,               icon: 'ti-clipboard-check' },
];

const getInitials = (firstName, lastName) => {
  const first = firstName?.[0] ?? '';
  const last = lastName?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
};

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const activities = isManager ? MANAGER_ACTIVITIES : WORKER_ACTIVITIES;
  const sectionLabel = isManager ? 'Manager Activities' : 'Staff Activities';

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate('/');
  };

  return (
    
<Sidebar
  collapsible="none"
  className="app-sidebar m-3 h-[calc(100%-1.5rem)] rounded-xl shadow-sm ring-1 ring-border bg-[#E3D5BE]"
>
      <SidebarHeader>
        <div className="app-sidebar__brand">
          <span className="app-sidebar__brand-mark" aria-hidden="true">
            <img src={logo} alt="" className="app-sidebar__brand-logo" />
          </span>
          <span className="app-sidebar__brand-name">Batches</span>
        </div>

        
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{sectionLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activities.map(({ label, path, icon }) => {
                const isActive = path ? location.pathname === path : false;
                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      isActive={isActive}
                      disabled={!path}
                      render={path ? <NavLink to={path} /> : undefined}
                    >
                      <i className={`ti ${icon}`} aria-hidden="true" />
                      <span>{label}</span>
                      {!path && <span className="app-sidebar__link-badge" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setShowLogoutConfirm(true)}>
              <i className="ti ti-logout" aria-hidden="true" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleConfirmLogout}
      />
    </Sidebar>
  );
}