import { ChevronRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function SectionListItem({ to, icon: Icon, title, description, end }: { to: string; icon: LucideIcon; title: string; description: string; end?: ReactNode }) {
  return (
    <Link to={to} className="flex items-center gap-4 rounded-2xl border-2 border-ocu-border bg-white p-4 hover:border-ocu-blue">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ocu-indigo/12 text-ocu-indigo"><Icon size={21} /></span>
      <span className="min-w-0 flex-1">
        <span className="block font-black text-ocu-ink">{title}</span>
        <span className="mt-1 block text-sm font-semibold leading-relaxed text-ocu-muted">{description}</span>
      </span>
      {end ?? <ChevronRight className="shrink-0 text-ocu-muted" size={20} />}
    </Link>
  );
}
