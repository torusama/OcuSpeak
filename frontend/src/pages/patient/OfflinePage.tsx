import { CloudOff, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AacItemCard } from '@/components/patient/AacCard';
import { aacItems } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/stores/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

const essentialIds = ['water', 'hungry', 'uncomfortable', 'mother'];

export function OfflinePage() {
  useDocumentTitle('Offline fallback');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const addItem = useAppStore((state) => state.addSelectedItem);
  const items = essentialIds.map((id) => aacItems.find((item) => item.id === id)!).filter(Boolean);
  return (
    <div className="mx-auto flex min-h-[calc(100vh-66px)] max-w-[1400px] flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full bg-ocu-orange/30 px-4 py-2 text-sm font-black"><CloudOff size={17} /> Chưa có kết nối mạng</div><h1 className="mt-3 font-display text-4xl text-ocu-indigo sm:text-5xl">Bảng thiết yếu khi mất mạng</h1><p className="mt-2 font-semibold text-ocu-muted">Lựa chọn được lưu trên thiết bị với cùng một mã yêu cầu và gửi lại khi có mạng.</p></div><Button variant="secondary" onClick={() => navigate(childPath('aac'))} leftIcon={<RotateCcw size={18} />}>Thử kết nối lại</Button></div>
      <div className="grid flex-1 grid-cols-2 gap-4 sm:gap-6">{items.map((item) => <AacItemCard key={item.id} item={item} onSelect={() => addItem(item)} />)}</div>
      <div className="mt-5 rounded-2xl bg-ocu-yellow/55 p-4 text-center font-black text-ocu-ink">SOS vẫn được gửi với cùng một mã yêu cầu khi mạng trở lại.</div>
    </div>
  );
}
