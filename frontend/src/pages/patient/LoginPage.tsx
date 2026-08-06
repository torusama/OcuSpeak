import { KeyRound, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { OrbisMascot } from '@/components/brand/OrbisMascot';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Form';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAppStore } from '@/stores/useAppStore';

export function LoginPage() {
  useDocumentTitle('Đăng nhập hồ sơ giao tiếp');
  const navigate = useNavigate();
  const location = useLocation();
  const setPatientLoggedIn = useAppStore((state) => state.setPatientLoggedIn);
  const setPatientName = useAppStore((state) => state.setPatientName);
  const [profileCode, setProfileCode] = useState('AN2026');
  const [pin, setPin] = useState('2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    if (profileCode.trim().length < 4 || pin.trim().length < 4) {
      setError('Mã hồ sơ hoặc mã PIN chưa đúng.');
      setLoading(false);
      return;
    }
    setPatientName('Bé An');
    setPatientLoggedIn(true);
    setLoading(false);
    const target = (location.state as { from?: string } | null)?.from ?? '/patient/connect';
    navigate(target);
  };

  return (
    <AuthShell
      aside={
        <div className="rounded-[34px] border border-[#dbe5f3] bg-white p-8 shadow-[0_22px_55px_rgba(87,110,170,.12)]">
          <div className="flex items-center gap-5">
            <OrbisMascot mood="happy" size="md" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">Orbis hướng dẫn</p>
              <h2 className="display-rounded mt-2 text-3xl font-extrabold text-[#28305f]">Đăng nhập trước, sau đó kết nối ứng dụng người chăm sóc.</h2>
            </div>
          </div>
          <div className="mt-7 grid gap-3">
            {[
              'Người chăm sóc có thể hỗ trợ nhập mã lần đầu.',
              'Sau khi đăng nhập, web yêu cầu mã kết nối từ ứng dụng người chăm sóc.',
              'Hồ sơ lưu cấu hình ánh mắt, thời gian nhìn giữ và giọng đọc.'
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#f5f8ff] p-4 text-sm font-bold text-[#596584]">
                <ShieldCheck className="mt-0.5 shrink-0 text-[#5f8d79]" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-lg">
        <p className="eyebrow">Hồ sơ người giao tiếp</p>
        <h1 className="display-rounded mt-3 text-5xl font-extrabold text-[#4c57a9]">Đăng nhập để bắt đầu</h1>
        <p className="mt-4 text-lg font-semibold leading-relaxed text-[#7581a4]">
          Đây là tài khoản của người sử dụng bảng giao tiếp. Sau khi đăng nhập, thiết bị sẽ được liên kết với ứng dụng của người chăm sóc bằng mã 6 ký tự.
        </p>

        <Card className="mt-7 border-[#dbe5f3] p-6 shadow-[0_14px_32px_rgba(87,110,170,.08)] sm:p-8">
          <div className="grid gap-5">
            <Field label="Mã hồ sơ" required>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b86a5]" size={19} />
                <Input value={profileCode} onChange={(event) => setProfileCode(event.target.value.toUpperCase())} className="pl-12" />
              </div>
            </Field>
            <Field label="Mã PIN" required>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b86a5]" size={19} />
                <Input value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))} className="pl-12" type="password" inputMode="numeric" />
              </div>
            </Field>
            {error && <p className="rounded-2xl bg-[#fff0ee] p-3 text-sm font-bold text-[#b73b32]">{error}</p>}
            <Button fullWidth size="lg" loading={loading} onClick={() => void submit()}>Đăng nhập</Button>
          </div>
        </Card>
        <p className="mt-5 text-center text-sm font-semibold text-[#7581a4]">Tài khoản mẫu: AN2026 / 2026</p>
      </div>
    </AuthShell>
  );
}
