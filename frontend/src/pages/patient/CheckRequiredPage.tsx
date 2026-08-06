import { Camera, Eye, Lightbulb, RefreshCcw, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function CheckRequiredPage() {
  useDocumentTitle('Cần kiểm tra');
  const navigate = useNavigate();
  const childPath = useChildPath();
  return (
    <div className="grid min-h-[calc(100vh-66px)] place-items-center px-4 py-8">
      <Card className="w-full max-w-4xl overflow-hidden border-ocu-orange">
        <div className="bg-ocu-orange/22 p-7 text-center sm:p-10"><span className="mx-auto grid h-20 w-20 place-items-center rounded-[24px] bg-ocu-orange text-ocu-ink"><TriangleAlert size={40} /></span><h1 className="mt-5 font-display text-4xl text-ocu-indigo sm:text-5xl">Cần người chăm sóc kiểm tra camera</h1><p className="mx-auto mt-4 max-w-2xl text-lg font-bold leading-relaxed text-ocu-text">Đây là thông báo chất lượng hệ thống, không phải chẩn đoán y khoa. Nút SOS vẫn hoạt động.</p></div>
        <div className="grid gap-4 p-6 md:grid-cols-3 sm:p-8">{[
          { icon: Camera, title: 'Mặt chưa ở giữa', text: 'Đặt lại camera ngang tầm mắt.' },
          { icon: Lightbulb, title: 'Ánh sáng chưa ổn', text: 'Tránh ngược sáng hoặc phản xạ trên kính.' },
          { icon: Eye, title: 'Độ tin cậy ánh mắt thấp', text: 'Hiệu chỉnh lại hoặc dùng chuột/cảm ứng để tiếp tục.' }
        ].map((item) => <div key={item.title} className="rounded-2xl border-2 border-ocu-border p-4"><item.icon className="text-ocu-indigo" /><h2 className="mt-3 font-black">{item.title}</h2><p className="mt-1 text-sm font-semibold text-ocu-muted">{item.text}</p></div>)}</div>
        <div className="grid gap-3 border-t-2 border-ocu-border p-6 sm:grid-cols-2"><Button size="patient" onClick={() => navigate(childPath('device-setup'))} leftIcon={<RefreshCcw size={22} />}>Kiểm tra lại</Button><Button size="patient" variant="secondary" onClick={() => navigate(childPath('aac'))}>Dùng chuột hoặc cảm ứng</Button></div>
      </Card>
    </div>
  );
}
