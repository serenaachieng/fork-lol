import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import AppSidebar from './AppSidebar';
import MobileBottomNav from './MobileBottomNav';

export default function AppShell({ children }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="app-shell">
        {!isMobile && <AppSidebar />}
        <div className="app-shell__content">{children}</div>
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}