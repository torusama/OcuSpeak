import { WifiOff } from 'lucide-react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { careMobileNavigation } from '@/app/config/navigation';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/utils/cn';

export function CareLayout() {
  const online = useOnlineStatus();
  const location = useLocation();
  const caregiverLoggedIn = useAppStore((state) => state.caregiverLoggedIn);

  if (!caregiverLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f4f8ff_100%)] text-ocu-ink">
      <UnifiedHeader mode="caregiver" />

      {!online && (
        <div className="flex items-center justify-center gap-2 bg-[#fff2d8] px-4 py-2 text-sm font-black text-[#6e5a2c]">
          <WifiOff size={17} />
          Mất kết nối. Thay đổi sẽ được gửi lại khi có mạng.
        </div>
      )}

      <main className="page-shell pb-28 lg:pb-10">
        <div key={location.pathname} className="route-enter">
          <Outlet />
        </div>
      </main>

      <nav className="safe-area-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-ocu-border bg-white px-1 pt-2 lg:hidden" aria-label="Điều hướng nhanh">
        {careMobileNavigation.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => cn('flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black text-ocu-muted', isActive && 'bg-ocu-indigo/10 text-ocu-indigo')}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
