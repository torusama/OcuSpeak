import { Camera, KeyRound, Link2, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrbisGuideCard } from '@/components/brand/OrbisGuideCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Form';
import { verifyPairCode } from '@/services/api/mockApi';
import { useAppStore } from '@/stores/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function ConnectPage() {
  useDocumentTitle('Kết nối thiết bị giao tiếp');
  const navigate = useNavigate();
  const setPatientPaired = useAppStore((state) => state.setPatientPaired);
  const [code, setCode] = useState('AN2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connect = async () => {
    setLoading(true);
    setError('');
    try {
      await verifyPairCode(code);
      setPatientPaired(true);
      navigate('/patient/permissions');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '';
      setError(message === 'PAIR_CODE_EXPIRED' ? 'Mã đã hết hạn. Người chăm sóc cần tạo mã mới trong trang Quản lý thiết bị.' : 'Mã gồm 6 ký tự và chưa đúng hoặc chưa sẵn sàng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-122px)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
      <section>
        <p className="eyebrow">Bước 1</p>
        <h1 className="display-rounded mt-3 text-5xl font-extrabold leading-[.98] text-[#4c57a9] sm:text-6xl">Kết nối thiết bị giao tiếp</h1>
        <p className="mt-5 max-w-xl text-lg font-semibold leading-relaxed text-[#7581a4]">
          Thiết bị của trẻ không cần đăng nhập bằng email hoặc mật khẩu. Chỉ cần nhập mã 6 ký tự do người chăm sóc tạo trên OcuSpeak Care để tải đúng hồ sơ và bảng biểu tượng.
        </p>
        <div className="mt-7 grid gap-3">
          {[
            [Smartphone, 'Người chăm sóc đăng nhập OcuSpeak Care trên điện thoại hoặc máy tính.'],
            [ShieldCheck, 'Mã có thời hạn và chỉ dùng cho một lần kết nối thiết bị.'],
            [Camera, 'Camera chưa được mở ở bước này.']
          ].map(([Icon, text]) => {
            const IconComponent = Icon as typeof ShieldCheck;
            return <div key={String(text)} className="flex items-center gap-3 font-bold text-[#596584]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#4c57a9] shadow-sm"><IconComponent size={20} /></span>{String(text)}</div>;
          })}
        </div>
        <OrbisGuideCard
          mood="guide"
          title="Mở trang quản lý thiết bị của người chăm sóc"
          message="Chọn hồ sơ của bé, tạo mã kết nối rồi nhập mã vừa hiển thị vào ô bên cạnh."
          className="mt-7"
        />
      </section>

      <Card className="border-[#dbe5f3] p-6 shadow-[0_18px_40px_rgba(87,110,170,.09)] sm:p-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eef3ff] text-[#4c57a9]"><Link2 size={28} /></span>
        <h2 className="mt-5 text-2xl font-black text-[#28305f]">Nhập mã kết nối</h2>
        <p className="mt-2 font-semibold text-[#7581a4]">Mã mẫu hiện tại: AN2026</p>
        <div className="mt-6">
          <Field label="Mã 6 ký tự" error={error} required>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b86a5]" size={20} />
              <Input value={code} maxLength={6} onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} className="h-16 pl-12 text-center text-2xl tracking-[.3em]" error={Boolean(error)} aria-label="Mã kết nối 6 ký tự" />
            </div>
          </Field>
        </div>
        <Button className="mt-6" fullWidth size="patient" loading={loading} onClick={() => void connect()}>Kết nối thiết bị</Button>
      </Card>
    </div>
  );
}
