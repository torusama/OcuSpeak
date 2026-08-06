import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple' | 'pink';

const styles: Record<BadgeVariant, string> = {
  neutral: 'bg-ocu-soft text-ocu-text',
  info: 'bg-ocu-blue/20 text-ocu-ink',
  success: 'bg-ocu-green/20 text-[#3F7048]',
  warning: 'bg-ocu-orange/25 text-ocu-ink',
  danger: 'bg-ocu-red text-white',
  purple: 'bg-ocu-purple/20 text-[#654D99]',
  pink: 'bg-ocu-pink/24 text-ocu-ink'
};

export function Badge({ className, variant = 'neutral', ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center rounded-full px-3 text-xs font-black uppercase tracking-[0.08em]',
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
