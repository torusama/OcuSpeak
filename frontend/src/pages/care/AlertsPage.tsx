import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { AlertCard } from '@/components/care/AlertCard';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { alerts } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function AlertsPage() {
  useDocumentTitle('Cảnh báo và yêu cầu kiểm tra');
  const emergency = alerts.filter((alert) => alert.severity === 'RED_ALERT');
  const checks = alerts.filter((alert) => alert.severity === 'CHECK_REQUIRED');
  return (
    <>
      <PageHeader eyebrow="Theo dõi an toàn" title="Cảnh báo và yêu cầu kiểm tra" description="Cảnh báo khẩn cấp luôn được ưu tiên. Trạng thái cần kiểm tra chỉ phản ánh chất lượng hệ thống, không phải chẩn đoán y khoa." />
      <section className="grid gap-7">
        <div><div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-ocu-red text-white"><ShieldAlert size={20} /></span><div><h2 className="text-xl font-black">Khẩn cấp</h2><p className="text-sm font-semibold text-ocu-muted">Nút SOS hoặc quy tắc tự động đã vượt qua ngưỡng tin cậy.</p></div></div>{emergency.length ? <div className="grid gap-5 lg:grid-cols-2">{emergency.map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div> : <Card className="p-5 text-sm font-bold text-ocu-muted">Không có cảnh báo khẩn cấp đang hoạt động.</Card>}</div>
        <div><div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-ocu-orange/30 text-ocu-ink"><AlertTriangle size={20} /></span><div><h2 className="text-xl font-black">Cần kiểm tra</h2><p className="text-sm font-semibold text-ocu-muted">Chất lượng camera, khuôn mặt, ánh mắt hoặc tín hiệu theo dõi chưa đủ.</p></div></div><div className="grid gap-5 lg:grid-cols-2">{checks.map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div></div>
      </section>
    </>
  );
}
