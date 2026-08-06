import { FileAudio, HeartHandshake, Mic, Play, Plus, Send, Star, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Field, Textarea } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { reassuranceMessages } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';

export function ReassuranceLibraryPage() {
  useDocumentTitle('Thư viện trấn an');
  const [text, setText] = useState('Mẹ đã nhận được rồi. Mẹ đang đến, con chờ một chút nhé.');
  const { notify } = useToast();
  const speak = () => { const u = new SpeechSynthesisUtterance(text); u.lang = 'vi-VN'; window.speechSynthesis?.speak(u); notify('Đang phát bản nghe thử', undefined, 'info'); };
  return (
    <>
      <PageHeader eyebrow="Phản hồi của người chăm sóc" title="Thư viện lời trấn an" description="Câu mẫu, giọng đọc và âm thanh đã ghi sẵn. Gửi lời trấn an không làm thay đổi trạng thái cảnh báo hoặc yêu cầu giao tiếp." action={<Button onClick={() => { setText(''); notify('Đã mở bản nháp mới', 'Nhập nội dung rồi gửi hoặc lưu qua backend adapter.', 'info'); }} leftIcon={<Plus size={18} />}>Tạo câu mới</Button>} />
      <section className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Card className="overflow-hidden"><CardHeader eyebrow="Câu đã lưu" title="Câu đã lưu" /><div className="grid gap-4 p-5 sm:p-6">{reassuranceMessages.map((message) => <button key={message.id} onClick={() => setText(message.text)} className="flex items-start gap-4 rounded-[20px] border-2 border-ocu-border p-4 text-left hover:border-ocu-pink"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ocu-pink/22 text-ocu-ink">{message.type === 'AUDIO' ? <FileAudio size={21} /> : <Volume2 size={21} />}</span><span className="min-w-0 flex-1"><span className="flex items-center gap-2 font-black text-ocu-ink">{message.title}{message.favorite && <Star size={15} className="fill-ocu-yellow text-[#B8920F]" />}</span><span className="mt-1 block text-sm font-semibold leading-relaxed text-ocu-muted">{message.text}</span></span><Play className="shrink-0 text-ocu-indigo" size={19} /></button>)}</div></Card>
        <div className="grid content-start gap-6"><Card className="overflow-hidden"><CardHeader eyebrow="Gửi ngay" title="Gửi tới màn hình giao tiếp" description="Nội dung được kiểm tra trước khi gửi." /><div className="grid gap-5 p-6"><Field label="Nội dung"><Textarea value={text} onChange={(event) => setText(event.target.value)} /></Field><div className="grid gap-3 sm:grid-cols-2"><Button variant="secondary" onClick={speak} leftIcon={<Play size={18} />}>Nghe thử</Button><Button onClick={() => notify('Đã gửi tới màn hình giao tiếp', text)} leftIcon={<Send size={18} />}>Gửi ngay</Button></div></div></Card><Card className="p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-purple/18 text-[#654D99]"><Mic size={24} /></span><h2 className="mt-4 text-xl font-black">Âm thanh quen thuộc</h2><p className="mt-2 text-sm font-semibold leading-relaxed text-ocu-muted">Giao diện hỗ trợ ghi âm, tải tệp và theo dõi trạng thái gửi. Tệp thật sẽ được lưu vào vùng lưu trữ có kiểm soát quyền truy cập.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><Button variant="secondary" onClick={() => notify('Chuẩn bị ghi âm', 'Quyền micro chỉ được xin khi người chăm sóc chủ động ghi âm.', 'info')} leftIcon={<Mic size={18} />}>Ghi âm</Button><Button variant="secondary" onClick={() => notify('Chọn tệp âm thanh', 'Hệ thống sẽ kiểm tra định dạng, dung lượng và quyền lưu trữ.', 'info')} leftIcon={<FileAudio size={18} />}>Tải tệp âm thanh</Button></div></Card></div>
      </section>
    </>
  );
}
