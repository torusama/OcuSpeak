import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-[24px] border-2 border-dashed border-ocu-border bg-ocu-soft/60 p-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-ocu-indigo shadow-sm">
        <Icon size={28} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-black text-ocu-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-relaxed text-ocu-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
