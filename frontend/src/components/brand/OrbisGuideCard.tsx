import { OrbisMascot } from '@/components/brand/OrbisMascot';
import { cn } from '@/utils/cn';

type OrbisGuideCardProps = {
  mood?: 'happy' | 'guide' | 'calm' | 'cheer' | 'alert';
  title: string;
  message: string;
  className?: string;
};

export function OrbisGuideCard({ mood = 'guide', title, message, className }: OrbisGuideCardProps) {
  return (
    <div className={cn('grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[112px_minmax(0,1fr)]', className)}>
      <OrbisMascot mood={mood} size="sm" className="justify-self-center" />
      <div className="relative rounded-[24px] border border-[#dbe5f3] bg-white px-5 py-4 shadow-[0_12px_28px_rgba(75,91,145,.08)]">
        <span
          className="absolute -left-[9px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l border-[#dbe5f3] bg-white"
          aria-hidden="true"
        />
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">Orbis đồng hành</p>
        <h3 className="mt-1 text-lg font-black text-[#28305f]">{title}</h3>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[#6f7b9d]">{message}</p>
      </div>
    </div>
  );
}
