import { Check, Glasses, Lightbulb, Move, ScanFace } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CameraPreview } from '@/components/patient/CameraPreview';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function DeviceSetupPage() {
  useDocumentTitle('Đặt thiết bị');
  const [searchParams] = useSearchParams();
  const manual = searchParams.get('manual') === '1';
  const navigate = useNavigate();
  const childPath = useChildPath();
  const [mode, setMode] = useState<5 | 9>(5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr]">
        <section>
          <p className="eyebrow">Bước 3</p><h1 className="mt-2 font-display text-5xl text-ocu-indigo">Đặt máy ngang tầm mắt</h1><p className="mt-4 max-w-2xl text-lg font-semibold leading-relaxed text-ocu-muted">Giữ thiết bị cố định. Mặt nằm trong oval và ánh sáng không chiếu thẳng vào kính.</p>
          <CameraPreview className="mt-7" />
        </section>
        <section className="grid content-start gap-4">
          {[
            { icon: ScanFace, title: 'Mặt ở giữa', text: 'Giữ toàn bộ khuôn mặt trong khung hướng dẫn.', good: true },
            { icon: Lightbulb, title: 'Ánh sáng đủ', text: 'Không ngồi ngược sáng hoặc dưới đèn quá mạnh.', good: true },
            { icon: Move, title: 'Khoảng cách ổn định', text: 'Giữ đầu tương đối ổn định trong lúc hiệu chỉnh ánh mắt.', good: true },
            { icon: Glasses, title: 'Phản chiếu kính', text: 'Nếu xuất hiện glare, đổi góc đèn hoặc màn hình.', good: false }
          ].map((item) => (
            <Card key={item.title} className="flex items-start gap-4 p-5"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${item.good ? 'bg-ocu-green/20 text-[#3F7048]' : 'bg-ocu-orange/25 text-ocu-ink'}`}><item.icon size={22} /></span><div className="flex-1"><div className="flex items-center gap-2"><h2 className="font-black text-ocu-ink">{item.title}</h2>{item.good && <Check size={16} className="text-[#3F7048]" />}</div><p className="mt-1 text-sm font-semibold leading-relaxed text-ocu-muted">{item.text}</p></div></Card>
          ))}
          {!manual && <Card className="p-5"><p className="text-sm font-black uppercase tracking-[.1em] text-ocu-muted">Chế độ hiệu chỉnh</p><div className="mt-3 grid grid-cols-2 gap-3"><button type="button" onClick={() => setMode(5)} className={`min-h-14 rounded-2xl border-2 px-4 font-black ${mode === 5 ? 'border-ocu-indigo bg-ocu-indigo text-white' : 'border-ocu-border bg-white text-ocu-indigo'}`}>5 điểm</button><button type="button" onClick={() => setMode(9)} className={`min-h-14 rounded-2xl border-2 px-4 font-black ${mode === 9 ? 'border-ocu-indigo bg-ocu-indigo text-white' : 'border-ocu-border bg-white text-ocu-indigo'}`}>9 điểm</button></div><p className="mt-3 text-sm font-semibold leading-relaxed text-ocu-muted">5 điểm nhanh cho grid bốn ô; 9 điểm dùng khi cần độ phủ màn hình chi tiết hơn.</p></Card>}
          <Button size="patient" fullWidth onClick={() => navigate(manual ? childPath('aac') : `${childPath('calibration')}?mode=${mode}`)}>{manual ? 'Vào bảng giao tiếp bằng chuột/chạm' : `Bắt đầu hiệu chỉnh ${mode} điểm`}</Button>
          {!manual && <Button size="patient" fullWidth variant="secondary" onClick={() => navigate(childPath('aac'))}>Tiếp tục bằng chuột hoặc cảm ứng</Button>}
        </section>
      </div>
    </div>
  );
}
