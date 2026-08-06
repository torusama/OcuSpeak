import { ArrowLeft, ArrowRight, Check, Grid2X2, HeartHandshake, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { OrbisMascot } from '@/components/brand/OrbisMascot';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input, Select } from '@/components/ui/Form';
import { Stepper } from '@/components/ui/Stepper';
import { Toggle } from '@/components/ui/Toggle';
import { fakeLogin } from '@/services/api/mockApi';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const steps = ['Tài khoản', 'Hồ sơ trẻ', 'Giao diện', 'Phản hồi', 'Ghép nối'];

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

export function OnboardingPage() {
  useDocumentTitle('Thiết lập người chăm sóc');
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [tts, setTts] = useState(true);
  const [realImages, setRealImages] = useState(false);

  const signUpWithGoogle = async () => {
    await fakeLogin('google.user@ocuspeak.vn', 'google-login');
    setStep(1);
  };

  return (
    <AuthShell aside={<div className="rounded-[34px] bg-ocu-indigo p-10 text-white fade-up-2"><div className="flex items-center gap-4"><Grid2X2 size={38} /><OrbisMascot mood="guide" size="sm" /></div><h2 className="display-rounded mt-6 text-5xl font-extrabold">Thiết lập một lần, thay đổi bất cứ lúc nào.</h2><p className="mt-5 text-lg font-semibold leading-relaxed text-white/72">MVP chỉ thu thập thông tin cần thiết cho hồ sơ hiển thị và cấu hình giao tiếp. Không yêu cầu bệnh án chi tiết.</p></div>}>
      <div className="mx-auto max-w-xl fade-up">
        <p className="eyebrow">Thiết lập</p><h1 className="display-rounded mt-3 text-5xl font-extrabold text-ocu-indigo">Tạo không gian chăm sóc</h1>
        <div className="mt-7 overflow-x-auto pb-2"><Stepper steps={steps} currentIndex={step} /></div>
        <Card className="mt-6 p-6 sm:p-8 fade-up-1">
          {step === 0 && <div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-indigo/12 text-ocu-indigo"><UserRound /></span><h2 className="mt-4 text-2xl font-black">Tạo tài khoản người chăm sóc</h2><p className="mt-2 font-semibold text-ocu-muted">Có thể đăng ký nhanh bằng Google hoặc điền thông tin cơ bản để tạo không gian chăm sóc.</p><div className="mt-5 grid gap-4"><Button type="button" variant="secondary" size="lg" fullWidth leftIcon={<GoogleIcon />} onClick={signUpWithGoogle}>Đăng ký nhanh với Google</Button><div className="relative py-1 text-center text-sm font-black text-ocu-muted"><span className="relative z-10 bg-white px-3">hoặc nhập tay</span><span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ocu-border" aria-hidden="true" /></div><div className="grid gap-5"><Field label="Tên hiển thị"><Input defaultValue="Võ Tấn An" /></Field><Field label="Email"><Input placeholder="tenban@example.com" /></Field></div></div></div>}
          {step === 1 && <div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-pink/24 text-ocu-ink"><HeartHandshake /></span><h2 className="mt-4 text-2xl font-black">Hồ sơ trẻ</h2><div className="mt-5 grid gap-5"><Field label="Tên hiển thị"><Input defaultValue="Bé An" /></Field><Field label="Tuổi"><Input type="number" defaultValue="11" min={6} max={16} /></Field></div></div>}
          {step === 2 && <div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-orange/28 text-ocu-ink"><Grid2X2 /></span><h2 className="mt-4 text-2xl font-black">Cấu hình giao diện</h2><div className="mt-5 grid gap-5"><Field label="Số ô mặc định"><Select defaultValue="4"><option value="4">4 ô — khuyến nghị</option><option value="6">6 ô</option><option value="9">9 ô — nâng cao</option></Select></Field><Field label="Thời gian nhìn giữ"><Select defaultValue="1.5"><option value="1">1 giây</option><option value="1.5">1.5 giây</option><option value="2">2 giây</option><option value="3">3 giây</option></Select></Field></div></div>}
          {step === 3 && <div><h2 className="text-2xl font-black">Phản hồi và hình ảnh</h2><div className="mt-5 grid gap-4"><Toggle checked={tts} onChange={setTts} label="Phát câu bằng giọng nói" description="Luôn có văn bản dự phòng khi giọng đọc bị gián đoạn." /><Toggle checked={realImages} onChange={setRealImages} label="Ưu tiên ảnh thật" description="Có thể thêm ảnh vật dụng quen thuộc sau." /></div></div>}
          {step === 4 && <div className="text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-ocu-green/25 text-[#3F7048]"><Check size={32} /></span><h2 className="mt-5 text-2xl font-black">Hồ sơ đã sẵn sàng</h2><p className="mt-3 font-semibold leading-relaxed text-ocu-muted">Tạo mã ghép nối để liên kết màn hình giao tiếp với hồ sơ Bé An.</p></div>}
          <div className="mt-7 flex justify-between gap-3"><Button variant="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} leftIcon={<ArrowLeft size={18} />}>Quay lại</Button>{step < steps.length - 1 ? <Button onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} rightIcon={<ArrowRight size={18} />}>Tiếp tục</Button> : <Button onClick={() => navigate('/care/pair')} rightIcon={<ArrowRight size={18} />}>Tạo mã ghép nối</Button>}</div>
        </Card>
      </div>
    </AuthShell>
  );
}
