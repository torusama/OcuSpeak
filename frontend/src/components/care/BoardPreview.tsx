import type { AacItem } from '@/types';
import { IconSymbol } from '@/components/common/IconSymbol';
import { cn } from '@/utils/cn';

const colors: Record<string, string> = {
  red: 'bg-ocu-red/12 text-ocu-red',
  orange: 'bg-ocu-orange/28 text-ocu-ink',
  yellow: 'bg-ocu-yellow/70 text-ocu-ink',
  green: 'bg-ocu-green/22 text-[#3F7048]',
  pink: 'bg-ocu-pink/25 text-ocu-ink',
  purple: 'bg-ocu-purple/20 text-[#654D99]',
  indigo: 'bg-ocu-indigo/14 text-ocu-indigo',
  blue: 'bg-ocu-blue/22 text-ocu-ink'
};

export function BoardPreview({ items, compact = false }: { items: AacItem[]; compact?: boolean }) {
  return (
    <div className="rounded-[24px] border-2 border-ocu-border bg-ocu-canvas p-3">
      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className={cn('flex aspect-[1.12/1] flex-col items-center justify-center gap-2 rounded-[18px] border-2 border-white bg-white p-3 text-center shadow-sm', compact && 'aspect-auto min-h-24')}>
            <span className={cn('grid h-11 w-11 place-items-center rounded-xl', colors[item.color])}><IconSymbol name={item.icon} size={24} /></span>
            <span className="text-xs font-black leading-tight text-ocu-ink sm:text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
