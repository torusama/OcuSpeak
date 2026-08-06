import { Camera, CircleOff, Copy, KeyRound, Monitor, MoreVertical, RefreshCcw, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { devices } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';

export function DevicesPage() {
  useDocumentTitle('Thiết bị');
  const { notify } = useToast();
  const [pairCode, setPairCode] = useState('AN2026');
  const [showCode, setShowCode] = useState(true);

  const createCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const next = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setPairCode(next);
    setShowCode(true);
    notify('Đã tạo mã kết nối mới', `Mã ${next} có hiệu lực trong 10 phút.`, 'info');
  };

  const copyCode = async () => {
    await navigator.clipboard?.writeText(pairCode);
    notify('Đã sao chép mã kết nối', pairCode, 'success');
  };

  return (
    <>
      <PageHeader
        eyebrow="Quản lý thiết bị"
        title="Thiết bị giao tiếp đã liên kết"
        description="Tạo mã để kết nối thiết bị của trẻ, theo dõi trạng thái trực tuyến và kiểm tra quyền camera tổng quát. OcuSpeak không hiển thị hình ảnh camera từ xa."
        action={<Button onClick={createCode} leftIcon={<RefreshCcw size={18} />}>Tạo mã kết nối</Button>}
      />

      {showCode && (
        <Card className="mb-6 border-[#cdd9ef] bg-[linear-gradient(135deg,#eef4ff,#f8fbff)] p-6 shadow-[0_14px_34px_rgba(87,110,170,.08)] sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#4c57a9] shadow-sm"><KeyRound size={24} /></span>
                <div>
                  <p className="eyebrow">Mã kết nối thiết bị</p>
                  <h2 className="mt-1 text-xl font-black text-[#28305f]">Nhập mã này trên thiết bị của trẻ</h2>
                </div>
              </div>
              <p className="mt-4 max-w-2xl font-semibold leading-relaxed text-[#7581a4]">Mã chỉ dùng một lần và tự hết hạn sau 10 phút. Thiết bị của trẻ không cần tài khoản hoặc mật khẩu riêng.</p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="rounded-[22px] border border-[#cdd9ef] bg-white px-7 py-4 text-center font-mono text-3xl font-black tracking-[.22em] text-[#4c57a9] shadow-sm">{pairCode}</div>
              <Button variant="secondary" onClick={() => void copyCode()} leftIcon={<Copy size={18} />}>Sao chép</Button>
              <Button variant="ghost" onClick={() => setShowCode(false)}>Ẩn mã</Button>
            </div>
          </div>
        </Card>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        {devices.map((device) => (
          <Card key={device.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-[20px] bg-ocu-indigo/12 text-ocu-indigo">
                {device.platform.includes('Android') ? <Smartphone size={28} /> : <Monitor size={28} />}
              </span>
              <button
                type="button"
                onClick={() => notify(device.name, `${device.browser} trên ${device.platform}`, 'info')}
                className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ocu-border"
                aria-label="Tùy chọn thiết bị"
              >
                <MoreVertical size={19} />
              </button>
            </div>
            <h2 className="mt-5 text-xl font-black">{device.name}</h2>
            <div className="mt-3">
              <StatusChip label={device.online ? 'Đang trực tuyến' : 'Ngoại tuyến'} tone={device.online ? 'success' : 'warning'} icon={device.online ? <Wifi size={15} /> : <WifiOff size={15} />} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-ocu-soft p-4"><p className="text-xs font-black uppercase tracking-[.1em] text-ocu-muted">Trình duyệt</p><p className="mt-1 font-black">{device.browser}</p><p className="mt-1 text-sm font-semibold text-ocu-muted">{device.platform}</p></div>
              <div className="rounded-2xl bg-ocu-soft p-4"><p className="text-xs font-black uppercase tracking-[.1em] text-ocu-muted">Hoạt động gần nhất</p><p className="mt-1 font-black">{device.lastSeen}</p></div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-ocu-border p-4"><Camera className="text-ocu-indigo" size={20} /><div><p className="font-black">Quyền sử dụng camera</p><p className="text-sm font-semibold text-ocu-muted">{device.cameraPermission}</p></div></div>
            <Button className="mt-5" variant="danger" size="sm" onClick={() => notify('Đã yêu cầu hủy liên kết', device.name, 'warning')} leftIcon={<CircleOff size={17} />}>Hủy liên kết</Button>
          </Card>
        ))}
      </section>
    </>
  );
}
