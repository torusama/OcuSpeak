import type { ReactNode } from 'react';
import { OrbisMascot } from '@/components/brand/OrbisMascot';
import { cn } from '@/utils/cn';

import type { OrbisMood } from '@/components/brand/OrbisMascot';

type Mood = 'welcome' | 'guide' | 'celebrate' | 'calm' | 'thinking' | 'alert';
type Tone = 'indigo' | 'blue' | 'green' | 'yellow' | 'pink' | 'neutral' | 'danger';

const moodToMascotMood: Record<Mood, OrbisMood> = {
  welcome: 'happy',
  guide: 'guide',
  celebrate: 'cheer',
  calm: 'calm',
  thinking: 'guide',
  alert: 'alert'
};

const toneStyles: Record<Tone, string> = {
  indigo: 'border-[#D9DDF5] bg-[#F5F6FF]',
  blue: 'border-[#D7E6F3] bg-[#F3F8FC]',
  green: 'border-[#D9E9DC] bg-[#F4F9F5]',
  yellow: 'border-[#F2E4A6] bg-[#FFFBEB]',
  pink: 'border-[#EADBE5] bg-[#FBF5F9]',
  neutral: 'border-ocu-border bg-white',
  danger: 'border-[#F0C9C4] bg-[#FFF5F3]'
};

export function MascotNote({
  mood = 'guide',
  tone = 'indigo',
  eyebrow,
  title,
  children,
  action,
  className,
  compact = false
}: {
  mood?: Mood;
  tone?: Tone;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <aside className={cn('relative overflow-hidden rounded-[28px] border-2 p-5 sm:p-6', toneStyles[tone], className)}>
      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/60 blur-2xl" />
      <div className={cn('relative flex items-center gap-4', !compact && 'sm:items-end')}>
        <OrbisMascot mood={moodToMascotMood[mood]} size={compact ? 'sm' : 'md'} />
        <div className="min-w-0 flex-1">
          {eyebrow && <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-ocu-indigo">{eyebrow}</p>}
          <h3 className="mt-1 text-lg font-extrabold leading-tight text-ocu-ink sm:text-xl">{title}</h3>
          <div className="mt-2 text-sm font-medium leading-relaxed text-ocu-text sm:text-[15px]">{children}</div>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </aside>
  );
}
