import { ArrowRight, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AacItem } from '@/types';
import { IconSymbol } from '@/components/common/IconSymbol';
import { useChildPath } from '@/hooks/useChildPath';

export function ComposerTray({ items, onRemoveLast, onClear }: { items: AacItem[]; onRemoveLast: () => void; onClear: () => void }) {
  const childPath = useChildPath();
  if (!items.length) return null;
  return (
    <div className="rounded-[24px] border-2 border-ocu-border bg-white p-4 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto pb-1">
          {items.map((item, index) => (
            <span key={`${item.id}-${index}`} className="flex shrink-0 items-center gap-2 rounded-2xl bg-ocu-soft px-3 py-2 font-black text-ocu-ink">
              <IconSymbol name={item.icon} size={20} />
              {item.label}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-ocu-border px-4 font-black text-ocu-muted" onClick={onRemoveLast}><X size={18} /> Xóa cuối</button>
          <button className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-ocu-border px-4 font-black text-ocu-muted" onClick={onClear}><Trash2 size={18} /> Xóa hết</button>
          <Link to={childPath('compose')} className="inline-flex h-11 items-center gap-2 rounded-xl bg-ocu-indigo px-5 font-black text-white">Tạo câu <ArrowRight size={18} /></Link>
        </div>
      </div>
    </div>
  );
}
