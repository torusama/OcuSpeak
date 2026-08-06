import { ArrowLeft, SearchX } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Không tìm thấy trang');
  return (
    <main className="grid min-h-screen place-items-center bg-ocu-canvas px-4 py-10">
      <Card className="max-w-xl p-8 text-center sm:p-10">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-[24px] bg-ocu-indigo/12 text-ocu-indigo"><SearchX size={40} /></span>
        <p className="eyebrow mt-6">404</p><h1 className="mt-2 font-display text-4xl text-ocu-indigo">Không tìm thấy trang</h1><p className="mt-4 font-semibold leading-relaxed text-ocu-muted">Đường dẫn không nằm trong route map OcuSpeak hoặc đã được thay đổi.</p><ButtonLink to="/" className="mt-6" leftIcon={<ArrowLeft size={18} />}>Về trang chủ</ButtonLink>
      </Card>
    </main>
  );
}
