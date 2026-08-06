import { CalendarDays, CheckCircle2, Filter, HeartHandshake, MessageSquareText, Search, TriangleAlert } from 'lucide-react';
import { Input, Select } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { alerts, communications } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const timeline = [
  ...communications.map((event) => ({ id: event.id, type: 'communication', title: event.sentence, detail: `Giao tiếp · ${event.status === 'COMPLETED' ? 'Đã hoàn thành' : event.status === 'PROCESSING' ? 'Đang xử lý' : event.status === 'RECEIVED' ? 'Đã nhận' : 'Đã gửi'}`, time: event.createdAt })),
  ...alerts.map((alert) => ({ id: alert.id, type: 'alert', title: alert.title, detail: `${alert.severity === 'RED_ALERT' ? 'Khẩn cấp' : 'Cần kiểm tra'} · ${alert.status === 'RESOLVED' ? 'Đã xử lý' : alert.status === 'ACKNOWLEDGED' ? 'Đã nhận' : 'Đang hoạt động'}`, time: alert.createdAt })),
  { id: 'rea-log-1', type: 'reassurance', title: 'Mẹ đang đến, con chờ một chút nhé.', detail: 'Giọng đọc đã phát', time: '20:36 hôm nay' }
];

export function HistoryPage() {
  useDocumentTitle('Nhật ký chăm sóc');
  return (
    <>
      <PageHeader eyebrow="Nhật ký chăm sóc" title="Nhật ký giao tiếp và hỗ trợ" description="Xem theo thời gian các yêu cầu giao tiếp, lời trấn an và cảnh báo an toàn." />
      <div className="mb-7 grid gap-3 lg:grid-cols-[1fr_210px_210px]"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ocu-muted" size={18} /><Input className="pl-11" placeholder="Tìm nội dung không nhạy cảm" /></div><div className="relative"><Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-ocu-muted" size={17} /><Select className="pl-10"><option>Tất cả hoạt động</option><option>Giao tiếp</option><option>Cảnh báo</option><option>Trấn an</option></Select></div><div className="relative"><CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-ocu-muted" size={17} /><Select className="pl-10"><option>Hôm nay</option><option>7 ngày</option><option>30 ngày</option></Select></div></div>
      <section className="relative ml-4 border-l-2 border-ocu-border pl-7 sm:ml-6 sm:pl-10">
        {timeline.map((item) => {
          const isAlert = item.type === 'alert'; const isReassurance = item.type === 'reassurance';
          const Icon = isAlert ? TriangleAlert : isReassurance ? HeartHandshake : MessageSquareText;
          const tone = isAlert ? 'bg-ocu-orange/28 text-ocu-ink' : isReassurance ? 'bg-ocu-pink/24 text-ocu-ink' : 'bg-ocu-blue/22 text-ocu-indigo';
          return <article key={item.id} className="relative mb-5 rounded-[22px] border-2 border-ocu-border bg-white p-5 shadow-card"><span className={`absolute -left-[49px] top-5 grid h-10 w-10 place-items-center rounded-2xl border-4 border-ocu-canvas ${tone} sm:-left-[61px]`}><Icon size={18} /></span><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.12em] text-ocu-muted">{item.type === 'communication' ? 'Giao tiếp' : item.type === 'alert' ? 'Cảnh báo' : 'Lời trấn an'}</p><h2 className="mt-2 text-lg font-black leading-relaxed text-ocu-ink">{item.title}</h2><p className="mt-2 text-sm font-semibold text-ocu-muted">{item.detail}</p></div><span className="shrink-0 text-sm font-bold text-ocu-muted">{item.time}</span></div></article>;
        })}
      </section>
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-ocu-green/15 p-4 text-sm font-bold text-[#3F7048]"><CheckCircle2 size={18} /> Nhật ký không chứa video, ảnh khuôn mặt, điểm nhận diện đầy đủ hoặc tín hiệu rPPG thô.</div>
    </>
  );
}
