import { CheckCircle2, Clock3, Copy, RefreshCcw, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { registerDevice, regenerateDeviceCode, type ApiDevice } from '@/services/api/apiClient';
import { joinChildRoom, onDeviceStatus } from '@/services/socket/realtimeClient';
import { useAppStore } from '@/stores/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function PairPage() {
  useDocumentTitle('Ghép nối thiết bị');
  const navigate = useNavigate();
  const activeChildId = useAppStore((state) => state.activeChildId);
  const activeChild = useAppStore((state) => state.childProfiles.find((child) => child.id === state.activeChildId));

  const [device, setDevice] = useState<ApiDevice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const createCode = async () => {
    if (!activeChildId) {
      setError('Chưa chọn hồ sơ trẻ. Vui lòng tạo hồ sơ trước.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const created = await registerDevice(activeChildId, `Thiết bị của ${activeChild?.displayName ?? 'trẻ'}`);
      setDevice(created);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tạo mã ghép nối.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void createCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChildId]);

  useEffect(() => {
    if (!device) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((new Date(device.pairingCodeExpiresAt).getTime() - Date.now()) / 1000));
      setSeconds(remaining);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [device]);

  useEffect(() => {
    if (!activeChildId) return;
    joinChildRoom(activeChildId, 'CAREGIVER');
    const unsubscribe = onDeviceStatus((updated) => {
      const updatedDevice = updated as ApiDevice;
      setDevice((current) => (current && updatedDevice.id === current.id ? updatedDevice : current));
    });
    return () => unsubscribe();
  }, [activeChildId]);

  const regenerate = async () => {
    if (!device) return;
    setLoading(true);
    try {
      const refreshed = await regenerateDeviceCode(device.id);
      setDevice(refreshed);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tạo lại mã.');
    } finally {
      setLoading(false);
    }
  };

  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const paired = Boolean(device?.paired);
  const code = device?.pairingCode ?? '------';

  return (
    <AuthShell aside={<Card className="p-8"><span className="grid h-16 w-16 place-items-center rounded-[22px] bg-ocu-blue/20 text-ocu-indigo"><Smartphone size={32} /></span><h2 className="mt-5 font-display text-4xl text-ocu-indigo">Mở màn hình giao tiếp trên thiết bị của người dùng</h2><p className="mt-4 font-semibold leading-relaxed text-ocu-muted">Mở chức năng kết nối, nhập mã hoặc quét mã QR. Mã tự hết hạn để bảo vệ hồ sơ.</p></Card>}>
      <div className="mx-auto max-w-xl"><p className="eyebrow">Ghép nối thiết bị</p><h1 className="mt-3 font-display text-5xl text-ocu-indigo">Kết nối màn hình giao tiếp</h1><p className="mt-4 text-lg font-semibold leading-relaxed text-ocu-muted">Mã chỉ dùng một lần và tự hết hạn sau thời gian hiển thị.</p>
      <Card className="mt-7 p-6 text-center sm:p-8">
        {error && <p className="mb-4 rounded-2xl bg-[#fff0ee] p-3 text-sm font-bold text-[#b73b32]">{error}</p>}
        {paired ? <><span className="mx-auto grid h-20 w-20 place-items-center rounded-[24px] bg-ocu-green/24 text-[#3F7048]"><CheckCircle2 size={40} /></span><h2 className="mt-5 text-2xl font-black">Đã kết nối</h2><p className="mt-2 font-semibold text-ocu-muted">{device?.deviceName} đang trực tuyến.</p><Button className="mt-6" fullWidth size="lg" onClick={() => navigate('/care/dashboard')}>Vào trang tổng quan</Button></> : <><div className="mx-auto w-fit rounded-[28px] border-2 border-ocu-border bg-white p-5"><QRCodeSVG value={`ocuspeak://pair/${code}`} size={210} fgColor="#28305F" bgColor="#FFFFFF" /></div><p className="mt-6 text-xs font-black uppercase tracking-[.15em] text-ocu-muted">Mã kết nối</p><div className="mt-2 flex items-center justify-center gap-3"><span className="font-display text-5xl tracking-[.12em] text-ocu-indigo">{code}</span><button className="grid h-11 w-11 place-items-center rounded-xl border-2 border-ocu-border text-ocu-indigo" onClick={async () => { await navigator.clipboard?.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }} aria-label="Sao chép mã"><Copy size={19} /></button></div><div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ocu-orange/25 px-4 py-2 text-sm font-black"><Clock3 size={16} /> Hết hạn sau {time}</div>{copied && <p className="mt-3 text-sm font-black text-[#3F7048]">Đã sao chép mã</p>}<div className="mt-6 grid gap-3 sm:grid-cols-2"><Button variant="secondary" loading={loading} onClick={() => void regenerate()} leftIcon={<RefreshCcw size={18} />}>Tạo lại mã</Button><Button variant="secondary" onClick={() => void createCode()} disabled={loading}>Kiểm tra kết nối</Button></div></>}
      </Card></div>
    </AuthShell>
  );
}
