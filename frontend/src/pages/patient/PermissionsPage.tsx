import { Camera, Check, Mic, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '@/app/providers/CameraProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function PermissionsPage() {
  useDocumentTitle('Quyền thiết bị');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const { status, requestCamera } = useCamera();
  const cameraReady = status === 'READY';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center"><p className="eyebrow">Bước 2</p><h1 className="mt-3 font-display text-5xl text-ocu-indigo">Cho phép thiết bị</h1><p className="mt-4 text-lg font-semibold leading-relaxed text-ocu-muted">Camera dùng để hiệu chỉnh và nhận diện ánh mắt. Hình xem trước chỉ hiển thị trên thiết bị. Âm thanh được dùng để phát câu và lời trấn an.</p></div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {[
          { icon: Camera, title: 'Camera', text: 'Cần cho điều khiển bằng ánh mắt. Có thể dùng chuột hoặc cảm ứng nếu từ chối.', required: true, ready: cameraReady },
          { icon: Volume2, title: 'Âm thanh', text: 'Phát câu, selection feedback và reassurance.', required: true, ready: true },
          { icon: Mic, title: 'Micro', text: 'Không bắt buộc cho giao tiếp bằng biểu tượng.', required: false, ready: false }
        ].map((permission) => (
          <Card key={permission.title} className={`p-5 ${permission.ready ? 'border-ocu-green' : ''}`}>
            <div className="flex items-start justify-between gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-blue/20 text-ocu-indigo"><permission.icon size={24} /></span>{permission.ready && <span className="grid h-8 w-8 place-items-center rounded-full bg-ocu-green/25 text-[#3F7048]"><Check size={17} /></span>}</div>
            <h2 className="mt-4 text-xl font-black text-ocu-ink">{permission.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-ocu-muted">{permission.text}</p>
            <p className="mt-4 text-xs font-black uppercase tracking-[.12em] text-ocu-muted">{permission.required ? 'Khuyến nghị' : 'Tùy chọn'}</p>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <Button fullWidth size="patient" loading={status === 'REQUESTING'} onClick={async () => { const stream = await requestCamera(); if (stream) navigate(childPath('device-setup')); }}>Cho phép camera</Button>
        <Button fullWidth size="patient" variant="secondary" onClick={() => navigate(`${childPath('device-setup')}?manual=1`)}>Tiếp tục bằng chuột hoặc cảm ứng</Button>
      </div>
      {(status === 'DENIED' || status === 'ERROR' || status === 'UNAVAILABLE') && <div className="mx-auto mt-5 max-w-2xl rounded-2xl border-2 border-ocu-orange bg-ocu-orange/18 p-4 text-center font-bold text-ocu-ink">Không mở được camera. Bảng giao tiếp bằng chuột/chạm và nút SOS vẫn hoạt động.</div>}
    </div>
  );
}
