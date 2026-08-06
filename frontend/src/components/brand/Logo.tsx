import { Eye, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export function Logo({ compact = false, light = false, to = '/' }: { compact?: boolean; light?: boolean; to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-3 rounded-xl" aria-label="OcuSpeak trang chủ">
      <span className={cn('relative grid h-11 w-11 place-items-center rounded-2xl', light ? 'bg-white text-ocu-indigo' : 'bg-ocu-indigo text-white')}>
        <Eye size={24} aria-hidden="true" />
        <MessageCircle className={cn('absolute -bottom-1 -right-1 rounded-full p-1', light ? 'bg-ocu-yellow text-ocu-ink' : 'bg-ocu-yellow text-ocu-ink')} size={18} aria-hidden="true" />
      </span>
      {!compact && (
        <span>
          <span className={cn('display-rounded block text-[28px] font-extrabold leading-none', light ? 'text-white' : 'text-ocu-indigo')}>OcuSpeak</span>
          <span className={cn('mt-0.5 block text-[10px] font-black uppercase tracking-[0.18em]', light ? 'text-white/70' : 'text-ocu-muted')}>
            Giao tiếp bằng ánh mắt
          </span>
        </span>
      )}
    </Link>
  );
}
