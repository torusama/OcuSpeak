import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { GazeTarget } from '@/components/patient/GazeTarget';

export function AacPageNavigator({ page, totalPages, onPrevious, onNext, onBack }: { page: number; totalPages: number; onPrevious: () => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <GazeTarget label="Quay lại danh mục" onSelect={onBack} className="min-h-[72px] rounded-[22px] px-5 py-4 shadow-card">
        <span className="flex items-center gap-3 text-lg font-black text-ocu-indigo"><ArrowLeft /> Danh mục</span>
      </GazeTarget>
      <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-ocu-muted shadow-sm">{page + 1}/{totalPages}</span>
      {page < totalPages - 1 ? (
        <GazeTarget label="Xem bốn lựa chọn tiếp theo" onSelect={onNext} className="min-h-[72px] rounded-[22px] px-5 py-4 shadow-card">
          <span className="flex items-center justify-end gap-3 text-lg font-black text-ocu-indigo">Xem tiếp <ChevronDown /></span>
        </GazeTarget>
      ) : (
        <GazeTarget label="Quay lại bốn lựa chọn trước" onSelect={onPrevious} className="min-h-[72px] rounded-[22px] px-5 py-4 shadow-card">
          <span className="flex items-center justify-end gap-3 text-lg font-black text-ocu-indigo">Trang trước <ChevronUp /></span>
        </GazeTarget>
      )}
    </div>
  );
}
