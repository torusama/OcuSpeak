import { ArrowRight, Clock3, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AlertEvent } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export function AlertCard({ alert }: { alert: AlertEvent }) {
  const danger = alert.severity === 'RED_ALERT';
  return (
    <Link to={`/care/alerts/${alert.id}`} className={cn('group block rounded-[22px] border-2 bg-white p-5 shadow-card', danger ? 'border-ocu-red' : 'border-ocu-orange')}>
      <div className="flex items-start justify-between gap-4">
        <span className={cn('grid h-12 w-12 place-items-center rounded-2xl', danger ? 'bg-ocu-red text-white' : 'bg-ocu-orange/30 text-ocu-ink')}><TriangleAlert size={24} /></span>
        <Badge variant={danger ? 'danger' : 'warning'}>{danger ? 'Khẩn cấp' : 'Cần kiểm tra'}</Badge>
      </div>
      <h3 className="mt-4 text-lg font-black text-ocu-ink">{alert.title}</h3>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-ocu-muted">{alert.summary}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm font-bold text-ocu-muted">
        <span className="inline-flex items-center gap-2"><Clock3 size={15} />{alert.createdAt}</span>
        <span className="inline-flex items-center gap-2 text-ocu-indigo">Xử lý <ArrowRight size={16} /></span>
      </div>
    </Link>
  );
}
