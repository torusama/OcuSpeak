import { Check, Clock3, Home, Volume2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Stepper } from '@/components/ui/Stepper';
import { useAppStore } from '@/stores/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

const statuses = ['SENT', 'RECEIVED', 'PROCESSING', 'COMPLETED'] as const;
const labels = ['Đã gửi', 'Đã nhận', 'Đang xử lý', 'Đã hoàn thành'];

export function RequestStatusPage() {
  useDocumentTitle('Trạng thái yêu cầu');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const { eventId } = useParams();
  const status = useAppStore((state) => state.requestStatus);
  const setStatus = useAppStore((state) => state.setRequestStatus);
  const index = Math.max(0, statuses.indexOf(status as (typeof statuses)[number]));

  useEffect(() => {
    if (index >= statuses.length - 1) return;
    const timer = window.setTimeout(() => setStatus(statuses[index + 1]), 2800);
    return () => window.clearTimeout(timer);
  }, [index, setStatus]);

  const sentence = useMemo(() => 'Mẹ ơi, con muốn uống nước.', []);
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'vi-VN';
    window.speechSynthesis?.speak(utterance);
  };

  return (
    <div className="grid min-h-[calc(100vh-66px)] place-items-center px-4 py-8">
      <Card className="w-full max-w-5xl p-6 sm:p-8">
        <div className="text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-ocu-green/22 text-[#3F7048]"><Check size={32} /></span><p className="eyebrow mt-5">Yêu cầu {eventId?.slice(0, 16)}</p><h1 className="mt-2 font-display text-4xl text-ocu-indigo sm:text-5xl">{labels[index]}</h1><p className="mx-auto mt-4 max-w-2xl text-2xl font-black leading-relaxed text-ocu-ink">“{sentence}”</p></div>
        <div className="mt-8"><Stepper steps={labels} currentIndex={index} /></div>
        <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-[22px] bg-ocu-soft p-5 sm:flex-row"><div className="flex items-center gap-3"><Clock3 className="text-ocu-indigo" /><div><p className="font-black">Cập nhật gần nhất</p><p className="text-sm font-semibold text-ocu-muted">Vừa xong, đồng bộ theo thời gian thực</p></div></div><div className="flex flex-wrap gap-3"><Button variant="secondary" onClick={speak} leftIcon={<Volume2 size={18} />}>Phát lại</Button><Button onClick={() => navigate(childPath('aac'))} leftIcon={<Home size={18} />}>Về bảng AAC</Button></div></div>
      </Card>
    </div>
  );
}
