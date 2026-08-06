import { Check, Clock3, HeartHandshake, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { alerts } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';

export function AlertDetailPage() {
  useDocumentTitle('Chi tiết cảnh báo');
  const { alertId } = useParams();
  const alert = alerts.find((item) => item.id === alertId) ?? alerts[0];
  const [status, setStatus] = useState(alert.status);
  const danger = alert.severity === 'RED_ALERT';
  const { notify } = useToast();
  return (
    <>
      <PageHeader eyebrow={`Cảnh báo ${alert.id}`} title={alert.title} description={alert.summary} action={<StatusChip label={danger ? 'Khẩn cấp' : 'Cần kiểm tra'} tone={danger ? 'danger' : 'warning'} />} />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="grid gap-6">
          <Card className={`overflow-hidden ${danger ? 'border-ocu-red' : 'border-ocu-orange'}`}><div className={`p-6 ${danger ? 'bg-ocu-red text-white' : 'bg-ocu-orange/25 text-ocu-ink'}`}><TriangleAlert size={34} /><h2 className="mt-4 text-2xl font-black">{danger ? 'Cần kiểm tra ngay' : 'Cần người chăm sóc kiểm tra'}</h2><p className={`mt-2 font-semibold leading-relaxed ${danger ? 'text-white/78' : 'text-ocu-text'}`}>{danger ? 'Phát hiện event khẩn cấp. Không suy diễn tình trạng y tế cụ thể.' : 'Chất lượng hệ thống giảm. Đây không phải kết luận y khoa.'}</p></div><div className="grid gap-4 p-6 sm:grid-cols-2">{[
            ['Nguồn', alert.source === 'MANUAL_SOS' ? 'Nút SOS' : 'Quy tắc tự động'], ['Chất lượng camera', alert.cameraQuality], ['Trạng thái khuôn mặt', alert.facialState], ['Phiên bản cấu hình', alert.configVersion], ['Độ tin cậy rPPG', `${Math.round(alert.rppgConfidence * 100)}%`], ['BPM', alert.bpm === null ? 'Không đủ dữ liệu' : `${alert.bpm} bpm`]
          ].map(([label, value]) => <div key={label} className="rounded-2xl bg-ocu-soft p-4"><p className="text-xs font-black uppercase tracking-[.1em] text-ocu-muted">{label}</p><p className="mt-2 font-black text-ocu-ink">{value}</p></div>)}</div></Card>
          <Card className="overflow-hidden"><CardHeader eyebrow="Lý do hệ thống" title="Lý do hệ thống" description="Các lý do giúp giải thích trạng thái hệ thống nhưng không phải chẩn đoán y khoa." /><div className="flex flex-wrap gap-3 p-6">{alert.reasonCodes.map((code) => <span key={code} className="rounded-full bg-ocu-orange/22 px-4 py-2 text-sm font-black text-ocu-ink">{code}</span>)}</div></Card>
        </div>
        <div className="grid content-start gap-6">
          <Card className="overflow-hidden"><CardHeader eyebrow="Trạng thái xử lý" title="Xử lý cảnh báo" /><div className="grid gap-4 p-6"><div className="flex items-center gap-4 rounded-2xl bg-ocu-soft p-4"><Clock3 className="text-ocu-indigo" /><div><p className="font-black">Tạo cảnh báo</p><p className="text-sm font-semibold text-ocu-muted">{alert.createdAt}</p></div></div><div className="flex items-center gap-4 rounded-2xl bg-ocu-soft p-4"><ShieldCheck className="text-[#3F7048]" /><div><p className="font-black">Trạng thái hiện tại</p><p className="text-sm font-semibold text-ocu-muted">{status}</p></div></div><Button variant="warning" disabled={status === 'ACKNOWLEDGED' || status === 'CHECKING' || status === 'RESOLVED'} onClick={() => setStatus('ACKNOWLEDGED')}>Đã nhận cảnh báo</Button><Button variant="secondary" disabled={status === 'CHECKING' || status === 'RESOLVED'} onClick={() => setStatus('CHECKING')}>Đang kiểm tra</Button><Button variant="success" disabled={status === 'RESOLVED'} onClick={() => setStatus('RESOLVED')} leftIcon={<Check size={18} />}>Đã xử lý</Button></div></Card>
          <Card className="p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-pink/24 text-ocu-ink"><HeartHandshake /></span><h2 className="mt-4 text-xl font-black">Gửi trấn an</h2><p className="mt-2 text-sm font-semibold leading-relaxed text-ocu-muted">Gửi văn bản hoặc giọng đọc tới màn hình giao tiếp mà không làm thay đổi trạng thái cảnh báo.</p><Button className="mt-5" fullWidth onClick={() => notify('Đã gửi lời trấn an', 'Màn hình giao tiếp sẽ hiển thị và phát giọng đọc khi nhận phản hồi.')}>Gửi “Mẹ đang đến”</Button></Card>
        </div>
      </section>
    </>
  );
}
