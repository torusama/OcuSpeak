import { Check, Clock3, Mic, Send, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Field, Textarea } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stepper } from '@/components/ui/Stepper';
import { communications, reassuranceMessages } from '@/data/mockData';
import type { CommunicationStatus } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';

const statuses: CommunicationStatus[] = ['SENT', 'RECEIVED', 'PROCESSING', 'COMPLETED'];
const labels = ['Đã gửi', 'Đã nhận', 'Đang xử lý', 'Đã hoàn thành'];

export function CommunicationDetailPage() {
  useDocumentTitle('Chi tiết giao tiếp');
  const { eventId } = useParams();
  const event = communications.find((item) => item.id === eventId) ?? communications[0];
  const [status, setStatus] = useState<CommunicationStatus>(event.status);
  const [custom, setCustom] = useState('Mẹ đã nhận được rồi. Mẹ đang đến nhé.');
  const index = Math.max(0, statuses.indexOf(status));
  const { notify } = useToast();
  const previewTts = () => {
    const utterance = new SpeechSynthesisUtterance(custom);
    utterance.lang = 'vi-VN';
    window.speechSynthesis?.speak(utterance);
    notify('Đang phát bản nghe thử', 'Trình đọc của trình duyệt đang được dùng làm phương án dự phòng.', 'info');
  };
  return (
    <>
      <PageHeader eyebrow={`Yêu cầu ${event.id}`} title="Chi tiết yêu cầu" description="Cập nhật trạng thái xử lý và gửi lời trấn an. Yêu cầu đã hoàn thành chỉ được mở lại theo luồng xác nhận riêng." />
      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="grid gap-6">
          <Card className="p-6 sm:p-8"><p className="eyebrow">Câu giao tiếp</p><blockquote className="mt-4 text-3xl font-black leading-relaxed text-ocu-ink">“{event.sentence}”</blockquote><div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-ocu-muted"><span className="inline-flex items-center gap-2 rounded-full bg-ocu-soft px-3 py-2"><Clock3 size={16} />{event.createdAt}</span><span className="rounded-full bg-ocu-blue/18 px-3 py-2">{event.category}</span></div></Card>
          <Card className="overflow-hidden"><CardHeader eyebrow="Trạng thái" title="Trạng thái xử lý" /><div className="p-6"><Stepper steps={labels} currentIndex={index} /><div className="mt-5 flex flex-wrap gap-3"><Button variant="secondary" disabled={index >= 1} onClick={() => setStatus('RECEIVED')}>Đã nhận</Button><Button variant="warning" disabled={index >= 2} onClick={() => setStatus('PROCESSING')}>Đang xử lý</Button><Button variant="success" disabled={index >= 3} onClick={() => setStatus('COMPLETED')} leftIcon={<Check size={18} />}>Đã hoàn thành</Button></div></div></Card>
        </div>
        <Card className="overflow-hidden"><CardHeader eyebrow="Lời trấn an" title="Phản hồi tới màn hình giao tiếp" description="Văn bản hoặc âm thanh đã được xác nhận." /><div className="grid gap-4 p-6">{reassuranceMessages.slice(0, 3).map((message) => <button key={message.id} onClick={() => setCustom(message.text)} className="rounded-2xl border-2 border-ocu-border p-4 text-left hover:border-ocu-pink"><strong className="block">{message.title}</strong><span className="mt-1 block text-sm font-semibold text-ocu-muted">{message.text}</span></button>)}<Field label="Tin nhắn tùy chỉnh"><Textarea value={custom} onChange={(event) => setCustom(event.target.value)} /></Field><div className="grid gap-3 sm:grid-cols-2"><Button variant="secondary" onClick={previewTts} leftIcon={<Volume2 size={18} />}>Nghe thử giọng đọc</Button><Button onClick={() => notify('Đã gửi lời trấn an', custom)} leftIcon={<Send size={18} />}>Gửi lời trấn an</Button></div><Button variant="ghost" onClick={() => notify('Đã sẵn sàng nhận âm thanh', 'Tệp hoặc bản ghi sẽ được lưu vào vùng lưu trữ có kiểm soát quyền truy cập.', 'info')} leftIcon={<Mic size={18} />}>Ghi hoặc tải âm thanh</Button></div></Card>
      </section>
    </>
  );
}
