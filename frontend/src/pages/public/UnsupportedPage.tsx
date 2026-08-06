import { ArrowLeft, Chrome, CircleX, Laptop } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function UnsupportedPage() {
  useDocumentTitle('Trình duyệt không hỗ trợ');
  return (
    <main className="grid min-h-[calc(100vh-130px)] place-items-center px-4 py-12">
      <Card className="w-full max-w-2xl p-7 text-center sm:p-10">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-[24px] bg-ocu-red/12 text-ocu-red"><CircleX size={40} /></span>
        <h1 className="mt-6 font-display text-4xl text-ocu-indigo">Thiết bị chưa sẵn sàng</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-relaxed text-ocu-muted">Trình duyệt hiện tại thiếu quyền camera, WebAssembly hoặc kết nối HTTPS cần cho màn hình giao tiếp.</p>
        <div className="mx-auto mt-7 grid max-w-lg gap-3 text-left">
          <div className="flex gap-3 rounded-2xl bg-ocu-soft p-4"><Chrome className="shrink-0 text-ocu-indigo" /><p className="font-bold text-ocu-text">Dùng phiên bản Chrome hoặc Edge hiện đại trên laptop/tablet.</p></div>
          <div className="flex gap-3 rounded-2xl bg-ocu-soft p-4"><Laptop className="shrink-0 text-ocu-indigo" /><p className="font-bold text-ocu-text">Mở trang bằng HTTPS và cho phép camera trong cài đặt trình duyệt.</p></div>
        </div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink to="/" variant="secondary" leftIcon={<ArrowLeft size={18} />}>Về trang chủ</ButtonLink><ButtonLink to="/requirements">Kiểm tra yêu cầu</ButtonLink></div>
      </Card>
    </main>
  );
}
