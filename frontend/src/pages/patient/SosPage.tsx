import { Check, Clock3, Home, Send, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function SosPage() {
  useDocumentTitle('SOS');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const [active, setActive] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const activate = () => {
    setActive(true);
    window.setTimeout(() => setAcknowledged(true), 3200);
  };

  if (!active) {
    return (
      <div className="grid min-h-[calc(100vh-66px)] place-items-center bg-ocu-red/6 px-4 py-8">
        <div className="w-full max-w-3xl rounded-[32px] border-4 border-ocu-red bg-white p-7 text-center shadow-2xl sm:p-10">
          <span className="mx-auto grid h-24 w-24 place-items-center rounded-[30px] bg-ocu-red text-white"><TriangleAlert size={52} /></span>
          <h1 className="mt-6 font-display text-5xl text-ocu-red">Gửi cảnh báo SOS?</h1>
          <p className="mx-auto mt-4 max-w-xl text-xl font-bold leading-relaxed text-ocu-text">Cảnh báo sẽ được gửi ngay cho người chăm sóc, không phụ thuộc camera hoặc kết nối AI.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2"><Button size="patient" variant="danger" onClick={activate} leftIcon={<Send size={24} />}>Gửi SOS ngay</Button><Button size="patient" variant="secondary" onClick={() => navigate(-1)}>Quay lại</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-66px)] place-items-center bg-ocu-red px-4 py-8 text-white">
      <div className="w-full max-w-4xl text-center">
        <span className="mx-auto grid h-28 w-28 place-items-center rounded-[34px] bg-white text-ocu-red shadow-2xl">{acknowledged ? <Check size={58} /> : <TriangleAlert size={58} />}</span>
        <h1 className="mt-7 font-display text-5xl sm:text-6xl">{acknowledged ? 'Người chăm sóc đã nhận' : 'Đã gửi cảnh báo'}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl font-bold leading-relaxed text-white/82">{acknowledged ? 'Người chăm sóc đang kiểm tra. Hãy giữ bình tĩnh.' : 'Đang chờ người chăm sóc xác nhận. Sự kiện không bị gửi trùng.'}</p>
        <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2"><div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"><ShieldCheck className="shrink-0" /><span className="font-black">SOS đã được ghi nhận</span></div><div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"><Clock3 className="shrink-0" /><span className="font-black">Cập nhật theo thời gian thực</span></div></div>
        {acknowledged && <Button className="mt-8 bg-white text-ocu-red shadow-none hover:bg-white/90" size="patient" onClick={() => navigate(childPath('aac'))} leftIcon={<Home size={22} />}>Về bảng giao tiếp</Button>}
      </div>
    </div>
  );
}
