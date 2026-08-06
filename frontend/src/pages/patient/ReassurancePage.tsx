import { CheckCircle2, HeartHandshake, Volume2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function ReassurancePage() {
  useDocumentTitle('Lời trấn an');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const text = 'Mẹ đã nhận được rồi. Mẹ đang đến, con chờ một chút nhé.';
  const speak = () => { const u = new SpeechSynthesisUtterance(text); u.lang = 'vi-VN'; window.speechSynthesis?.speak(u); };
  return (
    <div className="grid min-h-[calc(100vh-66px)] place-items-center px-4 py-8">
      <Card className="w-full max-w-3xl overflow-hidden border-ocu-pink">
        <div className="bg-ocu-pink/28 p-8 text-center sm:p-12"><span className="mx-auto grid h-24 w-24 place-items-center rounded-[30px] bg-white text-ocu-indigo shadow-card"><HeartHandshake size={50} /></span><p className="eyebrow mt-6">Tin nhắn từ người chăm sóc</p><h1 className="mt-3 font-display text-4xl text-ocu-indigo sm:text-5xl">Mẹ đã nhận</h1><p className="mx-auto mt-5 max-w-xl text-2xl font-black leading-relaxed text-ocu-ink">{text}</p></div>
        <div className="grid gap-3 p-6 sm:grid-cols-2"><Button size="patient" onClick={speak} leftIcon={<Volume2 size={22} />}>Phát lại</Button><Button size="patient" variant="secondary" onClick={() => navigate(childPath('aac'))} leftIcon={<X size={22} />}>Đóng</Button></div>
        <div className="flex items-center justify-center gap-2 border-t-2 border-ocu-border p-4 text-sm font-bold text-[#3F7048]"><CheckCircle2 size={17} /> Đã nhận lời trấn an</div>
      </Card>
    </div>
  );
}
