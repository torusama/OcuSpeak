import { Bell, BellRing, CheckCircle2, Send, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Toggle } from '@/components/ui/Toggle';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';

export function NotificationsPage() {
  useDocumentTitle('Cài đặt thông báo');
  const [permission, setPermission] = useState<NotificationPermission>(() => ('Notification' in window ? Notification.permission : 'denied'));
  const [communication, setCommunication] = useState(true);
  const [sound, setSound] = useState(true);
  const { notify } = useToast();

  const request = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const test = () => {
    if (permission === 'granted') new Notification('OcuSpeak kiểm tra thông báo', { body: 'Thông báo cho người chăm sóc đang hoạt động.', icon: '/icons/ocuspeak-192.png' });
  };

  return (
    <>
      <PageHeader eyebrow="Quyền thông báo" title="Thông báo cho người chăm sóc" description="Thông báo giao tiếp có thể tùy chỉnh. Cảnh báo SOS luôn được giữ trên thiết bị chính của người chăm sóc." />
      <section className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Card className="p-6 text-center sm:p-8"><span className={`mx-auto grid h-20 w-20 place-items-center rounded-[24px] ${permission === 'granted' ? 'bg-ocu-green/22 text-[#3F7048]' : 'bg-ocu-orange/25 text-ocu-ink'}`}>{permission === 'granted' ? <CheckCircle2 size={40} /> : <Bell size={40} />}</span><h2 className="mt-5 text-2xl font-black">{permission === 'granted' ? 'Thông báo đã được cho phép' : 'Cần cấp quyền thông báo'}</h2><p className="mt-3 font-semibold leading-relaxed text-ocu-muted">Quyền hiện tại của trình duyệt: <strong>{permission}</strong>. Mã nhận thông báo sẽ được đăng ký sau khi nối Firebase Messaging.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Button onClick={() => void request()} leftIcon={<BellRing size={18} />}>Xin quyền</Button><Button variant="secondary" onClick={test} disabled={permission !== 'granted'} leftIcon={<Send size={18} />}>Gửi thử</Button></div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="Tùy chọn" title="Loại thông báo" /><div className="grid gap-4 p-6"><Toggle checked={communication} onChange={setCommunication} label="Yêu cầu giao tiếp" description="Nhận thông báo khi có yêu cầu giao tiếp mới." /><Toggle checked={true} onChange={() => undefined} disabled label="SOS thủ công" description="Bắt buộc trên thiết bị chính của người chăm sóc. Không thể tắt hoàn toàn." /><Toggle checked={true} onChange={() => undefined} label="Cần kiểm tra" description="Thông báo ưu tiên thấp hơn SOS." /><Toggle checked={sound} onChange={setSound} label="Âm thanh cảnh báo" description="Tôn trọng cài đặt hệ thống và chế độ không làm phiền." /><Button variant="secondary" onClick={() => { const utterance = new SpeechSynthesisUtterance('OcuSpeak có thông báo mới'); utterance.lang = 'vi-VN'; window.speechSynthesis?.speak(utterance); notify('Đã phát âm báo thử', undefined, 'info'); }} leftIcon={<Volume2 size={18} />}>Nghe thử âm báo</Button></div></Card>
      </section>
      {permission === 'denied' && <div className="mt-7 rounded-[24px] border-2 border-ocu-orange bg-ocu-orange/15 p-5 font-bold leading-relaxed text-ocu-ink">Quyền thông báo đang bị chặn. Mở cài đặt site của trình duyệt, cho phép Notifications rồi tải lại trang. Màn hình giao tiếp vẫn hoạt động bình thường.</div>}
    </>
  );
}
