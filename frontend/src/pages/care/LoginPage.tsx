import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { OrbisGuideCard } from '@/components/brand/OrbisGuideCard';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Form';
import { fakeLogin } from '@/services/api/mockApi';
import { useAppStore } from '@/stores/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const schema = z.object({
  email: z.string().email('Email chưa đúng định dạng.'),
  password: z.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự.')
});

type LoginForm = z.infer<typeof schema>;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.6 14.7 1.8 12 1.8 6.5 1.8 2 6.4 2 12s4.5 10.2 10 10.2c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.8H12Z" />
      <path fill="#4285F4" d="M2 12c0 1.8.5 3.5 1.5 5l3.2-2.5c-.4-.8-.7-1.6-.7-2.5s.2-1.7.7-2.5L3.5 7C2.5 8.5 2 10.2 2 12Z" />
      <path fill="#FBBC05" d="M12 22.2c2.7 0 4.9-.9 6.6-2.4l-3.1-2.4c-.9.6-2.1 1-3.5 1-2.6 0-4.8-1.8-5.6-4.2l-3.3 2.5C4.8 20 8.1 22.2 12 22.2Z" />
      <path fill="#34A853" d="M6.4 14.2C7.2 16.6 9.4 18.4 12 18.4c1.4 0 2.6-.4 3.5-1l3.1 2.4c-1.8 1.6-4 2.4-6.6 2.4-3.9 0-7.2-2.2-8.9-5.5l3.3-2.5Z" />
    </svg>
  );
}

export function CaregiverLoginPage() {
  useDocumentTitle('Đăng nhập người chăm sóc');
  const navigate = useNavigate();
  const location = useLocation();
  const setCaregiverLoggedIn = useAppStore((state) => state.setCaregiverLoggedIn);
  const setCaregiverName = useAppStore((state) => state.setCaregiverName);
  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'caregiver@ocuspeak.demo', password: 'demo2026' }
  });

  const finishLogin = () => {
    setCaregiverName('Võ Tấn An');
    setCaregiverLoggedIn(true);
    const target = (location.state as { from?: string } | null)?.from ?? '/care/children';
    navigate(target);
  };

  const submit = form.handleSubmit(async (values) => {
    try {
      await fakeLogin(values.email, values.password);
      finishLogin();
    } catch {
      form.setError('root', { message: 'Không thể đăng nhập. Hãy kiểm tra tài khoản hoặc kết nối mạng.' });
    }
  });

  const loginWithGoogle = async () => {
    await fakeLogin('caregiver.google@ocuspeak.demo', 'google-demo');
    finishLogin();
  };

  return (
    <AuthShell
      aside={
        <div className="grid gap-6">
          <OrbisGuideCard
            mood="happy"
            title="Chào người chăm sóc"
            message="Sau khi đăng nhập, bạn tạo hồ sơ cho trẻ rồi mở trực tiếp giao diện giao tiếp trong cùng website. Không cần cài hoặc kết nối một ứng dụng riêng."
          />
          <div className="rounded-[30px] border border-[#dbe5f3] bg-white p-6 shadow-[0_16px_38px_rgba(87,110,170,.08)]">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">Không gian người chăm sóc</p>
            <div className="mt-4 grid gap-3">
              {[
                'Tạo và quản lý hồ sơ của từng trẻ',
                'Mở giao diện giao tiếp dành cho trẻ',
                'Nhận yêu cầu, SOS và gửi lời trấn an'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#f5f8ff] p-4 text-sm font-bold text-[#596584]">
                  <ShieldCheck className="mt-0.5 shrink-0 text-[#5f8d79]" size={18} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-lg">
        <p className="eyebrow">OcuSpeak Care</p>
        <h1 className="display-rounded mt-3 text-5xl font-extrabold text-[#4c57a9]">Đăng nhập người chăm sóc</h1>
        <p className="mt-4 text-lg font-semibold leading-relaxed text-[#7581a4]">
          Người chăm sóc đăng nhập tại đây để tạo hồ sơ cho trẻ, tùy chỉnh bảng AAC và mở giao diện giao tiếp dành cho trẻ ngay trong cùng website.
        </p>

        <Card className="mt-7 border-[#dbe5f3] p-6 shadow-[0_14px_32px_rgba(87,110,170,.08)] sm:p-8">
          <div className="grid gap-4">
            <Button type="button" variant="secondary" size="lg" fullWidth leftIcon={<GoogleIcon />} onClick={() => void loginWithGoogle()}>
              Tiếp tục với Google
            </Button>
            <div className="relative py-1 text-center text-sm font-black text-[#7581a4]">
              <span className="relative z-10 bg-white px-3">hoặc đăng nhập bằng email</span>
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#dbe5f3]" aria-hidden="true" />
            </div>
            <form onSubmit={submit} className="grid gap-5">
              <Field label="Email" error={form.formState.errors.email?.message} required>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b86a5]" size={19} />
                  <Input className="pl-12" type="email" autoComplete="email" {...form.register('email')} error={Boolean(form.formState.errors.email)} />
                </div>
              </Field>
              <Field label="Mật khẩu" error={form.formState.errors.password?.message} required>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b86a5]" size={19} />
                  <Input className="pl-12" type="password" autoComplete="current-password" {...form.register('password')} error={Boolean(form.formState.errors.password)} />
                </div>
              </Field>
              {form.formState.errors.root?.message && <p className="rounded-2xl bg-[#fff0ee] p-3 text-sm font-bold text-[#b73b32]">{form.formState.errors.root.message}</p>}
              <Button type="submit" fullWidth size="lg" loading={form.formState.isSubmitting}>Đăng nhập</Button>
            </form>
          </div>
        </Card>
        <p className="mt-5 text-center text-sm font-semibold text-[#7581a4]">Tài khoản mẫu: caregiver@ocuspeak.demo / demo2026</p>
      </div>
    </AuthShell>
  );
}
