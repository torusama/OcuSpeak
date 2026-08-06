import { AlertTriangle, Check, CircleDot, Wifi, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function StatusChip({
  label,
  tone = 'neutral',
  icon
}: {
  label: string;
  tone?: 'neutral' | 'success' | 'info' | 'warning' | 'danger';
  icon?: ReactNode;
}) {
  const tones = {
    neutral: 'bg-ocu-soft text-ocu-text',
    success: 'bg-ocu-green/18 text-[#3F7048]',
    info: 'bg-ocu-blue/18 text-ocu-ink',
    warning: 'bg-ocu-orange/24 text-ocu-ink',
    danger: 'bg-ocu-red text-white'
  };
  const fallbackIcon =
    tone === 'success' ? <Check size={15} /> : tone === 'warning' || tone === 'danger' ? <AlertTriangle size={15} /> : <CircleDot size={15} />;

  return (
    <span className={cn('inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-xs font-black', tones[tone])}>
      {icon ?? fallbackIcon}
      {label}
    </span>
  );
}

export function OnlineChip({ online }: { online: boolean }) {
  return (
    <StatusChip
      label={online ? 'Đang trực tuyến' : 'Đang ngoại tuyến'}
      tone={online ? 'success' : 'warning'}
      icon={online ? <Wifi size={15} /> : <WifiOff size={15} />}
    />
  );
}
