import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export function MetricCard({ icon: Icon, label, value, helper, tone = 'indigo' }: { icon: LucideIcon; label: string; value: string; helper: string; tone?: 'indigo' | 'green' | 'blue' | 'orange' | 'red' | 'purple' }) {
  const tones = {
    indigo: 'bg-ocu-indigo/12 text-ocu-indigo',
    green: 'bg-ocu-green/22 text-[#3F7048]',
    blue: 'bg-ocu-blue/22 text-ocu-ink',
    orange: 'bg-ocu-orange/25 text-ocu-ink',
    red: 'bg-ocu-red/12 text-ocu-red',
    purple: 'bg-ocu-purple/20 text-[#654D99]'
  };
  return (
    <article className="ui-reveal-card rounded-[22px] border-2 border-ocu-border bg-white p-5 shadow-card">
      <span className={cn('grid h-11 w-11 place-items-center rounded-2xl', tones[tone])}><Icon size={22} /></span>
      <p className="mt-4 text-sm font-black text-ocu-muted">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-ocu-ink">{value}</p>
      <p className="mt-2 text-sm font-semibold text-ocu-muted">{helper}</p>
    </article>
  );
}
