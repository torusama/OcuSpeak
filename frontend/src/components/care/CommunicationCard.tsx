import { ArrowRight, Clock3, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CommunicationEvent } from '@/types';
import { Badge } from '@/components/ui/Badge';

const statusMap = {
  QUEUED_LOCAL: { label: 'Chưa gửi', variant: 'warning' as const },
  SENT: { label: 'Đã gửi', variant: 'info' as const },
  RECEIVED: { label: 'Đã nhận', variant: 'purple' as const },
  PROCESSING: { label: 'Đang xử lý', variant: 'warning' as const },
  COMPLETED: { label: 'Hoàn thành', variant: 'success' as const },
  FAILED: { label: 'Gửi lỗi', variant: 'danger' as const }
};

export function CommunicationCard({ event }: { event: CommunicationEvent }) {
  const status = statusMap[event.status];
  return (
    <Link to={`/care/communications/${event.id}`} className="group block rounded-[22px] border-2 border-ocu-border bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ocu-blue/20 text-ocu-indigo"><MessageSquareText size={22} /></span>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
      <p className="mt-4 text-lg font-black leading-snug text-ocu-ink">{event.sentence}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm font-bold text-ocu-muted">
        <span className="inline-flex items-center gap-2"><Clock3 size={15} />{event.createdAt}</span>
        <span className="inline-flex items-center gap-2 text-ocu-indigo">Xem chi tiết <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></span>
      </div>
    </Link>
  );
}
