import type { AacCategory, AacItem, ColorToken } from '@/types';
import { IconSymbol } from '@/components/common/IconSymbol';
import { GazeTarget } from '@/components/patient/GazeTarget';
import { cn } from '@/utils/cn';

const backgrounds: Record<ColorToken, string> = {
  red: 'bg-ocu-red/12 text-ocu-red',
  orange: 'bg-ocu-orange/28 text-ocu-ink',
  yellow: 'bg-ocu-yellow/70 text-ocu-ink',
  green: 'bg-ocu-green/25 text-[#3F7048]',
  pink: 'bg-ocu-pink/25 text-ocu-ink',
  purple: 'bg-ocu-purple/22 text-[#654D99]',
  indigo: 'bg-ocu-indigo/15 text-ocu-indigo',
  blue: 'bg-ocu-blue/24 text-ocu-ink'
};

export function AacCategoryCard({ category, onSelect }: { category: AacCategory; onSelect: () => void }) {
  return (
    <GazeTarget
      label={`Mở danh mục ${category.label}`}
      onSelect={onSelect}
      className="min-h-[210px] rounded-[28px] p-5 shadow-card sm:min-h-[260px] sm:p-7"
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <span className={cn('grid h-24 w-24 place-items-center rounded-[26px] sm:h-28 sm:w-28', backgrounds[category.color])}>
          <IconSymbol name={category.icon} size={56} strokeWidth={2.2} />
        </span>
        <div>
          <h2 className="text-2xl font-black text-ocu-ink sm:text-3xl">{category.label}</h2>
          <p className="mt-2 hidden max-w-sm text-sm font-semibold leading-relaxed text-ocu-muted sm:block">{category.description}</p>
        </div>
      </div>
    </GazeTarget>
  );
}

export function AacItemCard({ item, onSelect }: { item: AacItem; onSelect: () => void }) {
  return (
    <GazeTarget
      label={`Chọn ${item.label}`}
      onSelect={onSelect}
      className="aspect-[1.1/1] min-h-[150px] rounded-[28px] p-4 shadow-card sm:min-h-[220px] sm:p-6"
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <span className={cn('grid h-20 w-20 place-items-center rounded-[24px] sm:h-28 sm:w-28', backgrounds[item.color])}>
          <IconSymbol name={item.icon} size={58} strokeWidth={2.15} />
        </span>
        <span className="text-xl font-black leading-tight text-ocu-ink sm:text-2xl">{item.label}</span>
      </div>
    </GazeTarget>
  );
}
