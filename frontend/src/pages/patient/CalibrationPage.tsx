import { MousePointer2, Pause, RotateCcw, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

type CalibrationPoint = { id: string; position: string };

const points5: CalibrationPoint[] = [
  { id: 'left-top', position: 'left-[10%] top-[18%]' },
  { id: 'right-top', position: 'right-[10%] top-[18%]' },
  { id: 'center', position: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' },
  { id: 'left-bottom', position: 'bottom-[16%] left-[10%]' },
  { id: 'right-bottom', position: 'bottom-[16%] right-[10%]' }
];

const points9: CalibrationPoint[] = [
  { id: 'left-top', position: 'left-[9%] top-[18%]' },
  { id: 'center-top', position: 'left-1/2 top-[18%] -translate-x-1/2' },
  { id: 'right-top', position: 'right-[9%] top-[18%]' },
  { id: 'left-center', position: 'left-[9%] top-1/2 -translate-y-1/2' },
  { id: 'center', position: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' },
  { id: 'right-center', position: 'right-[9%] top-1/2 -translate-y-1/2' },
  { id: 'left-bottom', position: 'bottom-[16%] left-[9%]' },
  { id: 'center-bottom', position: 'bottom-[16%] left-1/2 -translate-x-1/2' },
  { id: 'right-bottom', position: 'bottom-[16%] right-[9%]' }
];

export function CalibrationPage() {
  useDocumentTitle('Hiệu chỉnh ánh mắt');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const [params] = useSearchParams();
  const mode = params.get('mode') === '9' ? 9 : 5;
  const points = useMemo(() => (mode === 9 ? points9 : points5), [mode]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [samples, setSamples] = useState(0);

  const collect = () => {
    if (paused) return;
    const nextSamples = samples + 1;
    setSamples(nextSamples);
    if (nextSamples < 2) return;
    setSamples(0);
    if (index >= points.length - 1) navigate(`${childPath('calibration/result')}?status=ready&mode=${mode}`);
    else setIndex((value) => value + 1);
  };

  const reset = () => {
    setIndex(0);
    setSamples(0);
    setPaused(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-122px)] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(102,152,204,.16),transparent_38%),#f7faff]">
      <div className="relative z-20 flex flex-col gap-4 border-b border-[#e0e7f2] bg-white/86 px-5 py-4 backdrop-blur sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#eef3ff] px-4 py-2 font-black text-[#28305f]">Điểm {index + 1}/{points.length}</span>
            <span className="rounded-full bg-[#eaf0ff] px-4 py-2 text-sm font-black text-[#4c57a9]">Chế độ {mode} điểm</span>
          </div>
          <h1 className="mt-3 text-xl font-black text-[#28305f]">Nhìn vào vòng tròn và giữ đầu ổn định</h1>
          <p className="mt-1 text-sm font-semibold text-[#7581a4]">Bản giao diện hiện dùng nhấp chuột để mô phỏng hai lần ghi nhận hợp lệ cho mỗi điểm.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPaused((value) => !value)} leftIcon={<Pause size={17} />}>{paused ? 'Tiếp tục' : 'Tạm dừng'}</Button>
          <Button size="sm" variant="secondary" onClick={reset} leftIcon={<RotateCcw size={17} />}>Làm lại</Button>
          <Button size="sm" variant="secondary" onClick={() => navigate(childPath('aac'))} leftIcon={<MousePointer2 size={17} />}>Dùng chuột</Button>
          <Button size="sm" variant="ghost" onClick={() => navigate('/care/children')} leftIcon={<X size={17} />}>Thoát</Button>
        </div>
      </div>

      <button
        type="button"
        disabled={paused}
        onClick={collect}
        className={cn(
          'absolute grid h-28 w-28 place-items-center rounded-full border-[10px] border-white bg-[#4c57a9] shadow-[0_18px_50px_rgba(76,87,169,.28)] outline-none transition-transform hover:scale-[1.03] sm:h-36 sm:w-36',
          points[index].position,
          paused && 'opacity-40'
        )}
        aria-label={`Điểm hiệu chỉnh ${index + 1}, lần ghi ${samples + 1} trên 2`}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e7efff] text-sm font-black text-[#28305f] sm:h-12 sm:w-12">{samples + 1}/2</span>
      </button>

      {paused && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#28305f]/18 backdrop-blur-sm">
          <div className="rounded-[24px] bg-white p-7 text-center shadow-2xl"><Pause className="mx-auto text-[#4c57a9]" size={36} /><h2 className="mt-3 text-xl font-black">Hiệu chỉnh đang tạm dừng</h2></div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-6 mx-auto w-[min(560px,calc(100%-40px))] overflow-hidden rounded-full bg-white p-1 shadow-sm">
        <div className="h-3 rounded-full bg-[#4c57a9] transition-[width] duration-300" style={{ width: `${((index * 2 + samples + 1) / (points.length * 2)) * 100}%` }} />
      </div>
    </div>
  );
}
