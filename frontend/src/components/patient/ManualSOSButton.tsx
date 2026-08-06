import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChildPath } from '@/hooks/useChildPath';

export function ManualSOSButton() {
  const childPath = useChildPath();
  return (
    <Link
      to={childPath('sos')}
      className="fixed bottom-5 right-5 z-[70] flex min-h-[82px] min-w-[132px] items-center justify-center gap-3 rounded-[24px] bg-ocu-red px-6 text-lg font-black text-white shadow-tactile-danger focus-visible:shadow-focus sm:bottom-7 sm:right-7"
      aria-label="Kích hoạt SOS thủ công"
    >
      <TriangleAlert size={28} aria-hidden="true" />
      SOS
    </Link>
  );
}
