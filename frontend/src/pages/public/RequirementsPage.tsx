import { CheckCircle2, CircleX, Laptop, Lightbulb, MoveHorizontal, RefreshCw, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { checkCapabilities } from '@/services/camera/capabilities';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function RequirementsPage() {
  useDocumentTitle('Yêu cầu thiết bị');
  const [runId, setRunId] = useState(0);
  const capabilities = useMemo(() => checkCapabilities(), [runId]);
  const passed = capabilities.filter((item) => item.supported).length;

  return (
    <main className="page-shell py-12 lg:py-16">
      <PageHeader eyebrow="Device readiness" title="Kiểm tra thiết bị và trình duyệt" description="Patient Web ưu tiên laptop hoặc tablet đặt cố định ngang tầm mắt. Mobile chỉ nên dùng manual mode trong MVP." action={<Button onClick={() => setRunId((value) => value + 1)} variant="secondary" leftIcon={<RefreshCw size={18} />}>Kiểm tra lại</Button>} />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="eyebrow">Capability check</p><h2 className="mt-2 text-2xl font-black text-ocu-ink">{passed}/{capabilities.length} khả năng sẵn sàng</h2></div>
            <span className={`rounded-full px-4 py-2 text-sm font-black ${passed === capabilities.length ? 'bg-ocu-green/22 text-[#3F7048]' : 'bg-ocu-orange/30 text-ocu-ink'}`}>{passed === capabilities.length ? 'Thiết bị phù hợp' : 'Cần kiểm tra thêm'}</span>
          </div>
          <div className="mt-6 grid gap-3">
            {capabilities.map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border-2 border-ocu-border p-4">
                <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.supported ? 'bg-ocu-green/20 text-[#3F7048]' : 'bg-ocu-red/12 text-ocu-red'}`}>{item.supported ? <CheckCircle2 size={20} /> : <CircleX size={20} />}</span>
                <div><h3 className="font-black text-ocu-ink">{item.label}</h3><p className="mt-1 text-sm font-semibold leading-relaxed text-ocu-muted">{item.detail}</p></div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          {[
            { icon: Laptop, title: 'Thiết bị cố định', text: 'Dùng laptop hoặc tablet landscape trên giá đỡ. Không cầm thiết bị khi calibration.' },
            { icon: MoveHorizontal, title: 'Ngang tầm mắt', text: 'Camera nên ở gần tâm màn hình và mặt nằm trong vùng hướng dẫn.' },
            { icon: Lightbulb, title: 'Ánh sáng ổn định', text: 'Tránh cửa sổ hoặc đèn chiếu thẳng gây phản xạ trên kính.' },
            { icon: ShieldCheck, title: 'HTTPS', text: 'Production phải chạy HTTPS. Local development có thể dùng localhost.' }
          ].map((item) => (
            <Card key={item.title} className="flex items-start gap-4 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ocu-blue/20 text-ocu-indigo"><item.icon size={22} /></span><div><h3 className="font-black text-ocu-ink">{item.title}</h3><p className="mt-1 text-sm font-semibold leading-relaxed text-ocu-muted">{item.text}</p></div></Card>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[26px] border-2 border-ocu-orange bg-ocu-orange/15 p-6">
        <h2 className="text-xl font-black text-ocu-ink">Khi người dùng đeo kính</h2>
        <p className="mt-3 max-w-4xl font-semibold leading-relaxed text-ocu-text">Thực hiện calibration trong điều kiện sử dụng thật. Nếu confidence thấp, đổi góc đèn hoặc màn hình, lau kính, giảm số ô từ 9 xuống 6 hoặc 4 và tăng kích thước ảnh. OcuSpeak không mặc định loại trừ người dùng chỉ vì đeo kính.</p>
      </section>
    </main>
  );
}
