import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export function AuthShell({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f4f8ff_100%)]">
      <UnifiedHeader />
      <main key={location.pathname} className="route-enter mx-auto grid min-h-[calc(100vh-82px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section>{children}</section>
        <aside className="hidden lg:block">{aside}</aside>
      </main>
    </div>
  );
}
