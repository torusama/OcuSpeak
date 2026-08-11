import { MousePointer2, Pause, RotateCcw, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCamera } from '@/app/providers/CameraProvider';
import { Button } from '@/components/ui/Button';
import { EyeTrackingEngine, type CalibrationMethod } from '@/eye-engine';
import { createMonitoringRecord } from '@/services/api/apiClient';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/utils/cn';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

type CalibrationPoint = { id: string; position: string; x: number; y: number };

const points5: CalibrationPoint[] = [
  { id: 'left-top', position: 'left-[10%] top-[18%]', x: 0.1, y: 0.18 },
  { id: 'right-top', position: 'right-[10%] top-[18%]', x: 0.9, y: 0.18 },
  { id: 'center', position: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', x: 0.5, y: 0.5 },
  { id: 'left-bottom', position: 'bottom-[16%] left-[10%]', x: 0.1, y: 0.84 },
  { id: 'right-bottom', position: 'bottom-[16%] right-[10%]', x: 0.9, y: 0.84 }
];

const points9: CalibrationPoint[] = [
  { id: 'left-top', position: 'left-[9%] top-[18%]', x: 0.09, y: 0.18 },
  { id: 'center-top', position: 'left-1/2 top-[18%] -translate-x-1/2', x: 0.5, y: 0.18 },
  { id: 'right-top', position: 'right-[9%] top-[18%]', x: 0.91, y: 0.18 },
  { id: 'left-center', position: 'left-[9%] top-1/2 -translate-y-1/2', x: 0.09, y: 0.5 },
  { id: 'center', position: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', x: 0.5, y: 0.5 },
  { id: 'right-center', position: 'right-[9%] top-1/2 -translate-y-1/2', x: 0.91, y: 0.5 },
  { id: 'left-bottom', position: 'bottom-[16%] left-[9%]', x: 0.09, y: 0.84 },
  { id: 'center-bottom', position: 'bottom-[16%] left-1/2 -translate-x-1/2', x: 0.5, y: 0.84 },
  { id: 'right-bottom', position: 'bottom-[16%] right-[9%]', x: 0.91, y: 0.84 }
];

const SAMPLES_PER_POINT = 20; // ~0.6s ở 30fps — đủ để lấy trung bình ổn định cho một điểm
const SETTLE_MS = 600; // thời gian chờ mắt "nhảy" sang điểm mới và định vị ổn định trước khi bắt đầu tính mẫu

export function CalibrationPage() {
  useDocumentTitle('Hiệu chỉnh ánh mắt');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const [params] = useSearchParams();
  const mode: CalibrationMethod = params.get('mode') === '9' ? '9-point' : '5-point';
  const points = useMemo(() => (mode === '9-point' ? points9 : points5), [mode]);

  const { stream } = useCamera();
  const patientChildId = useAppStore((state) => state.patientChildId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const engineRef = useRef<EyeTrackingEngine | null>(null);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [samples, setSamples] = useState(0);
  const [engineReady, setEngineReady] = useState(false);
  const [error, setError] = useState('');
  // true = mắt vừa mới chuyển sang điểm hiện tại, chưa kịp định vị ổn định —
  // trong lúc này KHÔNG được tính mẫu, tránh lẫn ánh mắt còn hướng về điểm cũ.
  const [settling, setSettling] = useState(true);

  // Khởi tạo Eye Tracking Engine một lần khi có camera stream.
  useEffect(() => {
    if (!stream || !videoRef.current) return;
    const engine = new EyeTrackingEngine(videoRef.current);
    engineRef.current = engine;

    engine
      .init(stream)
      .then(() => {
        engine.beginCalibration(
          mode,
          points.map((p) => ({ x: p.x, y: p.y }))
        );
        engine.start();
        setEngineReady(true);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Không thể khởi động camera AI.'));

    return () => engine.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  // Mỗi khi chuyển sang điểm hiệu chỉnh mới (hoặc vừa sẵn sàng), bật lại thời
  // gian "chờ ổn định" — chặn không cho tính mẫu trong lúc mắt còn đang di
  // chuyển từ điểm cũ sang điểm mới.
  useEffect(() => {
    if (!engineReady) return;
    setSettling(true);
    const timer = window.setTimeout(() => setSettling(false), SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [engineReady, index]);

  // Lắng nghe tiến độ mẫu THẬT từ engine — chỉ engine mới biết khi nào một mẫu
  // hợp lệ (có mặt, camera sống) thực sự được thêm vào.
  useEffect(() => {
    if (!engineReady) return;
    return engineRef.current?.on('calibrationProgress', ({ sampleCount }) => {
      setSamples(sampleCount);
    });
  }, [engineReady]);

  // Yêu cầu engine thử lấy mẫu liên tục trong lúc trẻ đang nhìn vào điểm hiện tại
  // (mỗi ~100ms). Engine sẽ tự bỏ qua nếu không có mặt / camera đã tắt, và ở đây
  // ta cũng tự chặn trong lúc "settling" (mắt vừa mới chuyển điểm, chưa ổn định) —
  // bộ đếm hiển thị chỉ tăng khi có mẫu thật (xem effect lắng nghe 'calibrationProgress' ở trên).
  useEffect(() => {
    if (!engineReady || paused || settling) return;
    const timer = window.setInterval(() => {
      engineRef.current?.captureCalibrationSample();
    }, 100);
    return () => window.clearInterval(timer);
  }, [engineReady, paused, settling, index]);

  // Đủ mẫu -> tự chuyển sang điểm kế, hoặc hoàn tất nếu là điểm cuối.
  useEffect(() => {
    if (samples < SAMPLES_PER_POINT) return;
    setSamples(0);

    if (index >= points.length - 1) {
      finishCalibration();
    } else {
      engineRef.current?.advanceCalibrationPoint();
      setIndex((value) => value + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samples]);

  const finishCalibration = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const profile = engine.finishCalibration();

    // Lưu hồ sơ hiệu chỉnh riêng cho trẻ này lên backend (bảng monitoring_records, type=CALIBRATION).
    if (patientChildId) {
      void createMonitoringRecord(patientChildId, 'CALIBRATION', {
        method: profile.method,
        confidence: profile.confidence,
        transformCoefficients: profile.transformCoefficients,
        createdAt: profile.createdAt
      });
      // Ghi thêm vào localStorage để dùng ngay lần sau không cần hiệu chỉnh lại.
      localStorage.setItem(`ocuspeak_calibration_${patientChildId}`, JSON.stringify(profile));
    }

    navigate(`${childPath('calibration/result')}?status=ready&mode=${mode === '9-point' ? 9 : 5}&confidence=${profile.confidence.toFixed(2)}`);
  };

  const reset = () => {
    engineRef.current?.beginCalibration(
      mode,
      points.map((p) => ({ x: p.x, y: p.y }))
    );
    setIndex(0);
    setSamples(0);
    setPaused(false);
    setSettling(true);
    window.setTimeout(() => setSettling(false), SETTLE_MS);
  };

  return (
    <div className="relative min-h-[calc(100vh-122px)] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(102,152,204,.16),transparent_38%),#f7faff]">
      {/* Video ẩn — chỉ dùng làm nguồn khung hình cho AI Engine, không hiển thị cho người dùng. */}
      <video ref={videoRef} className="sr-only" aria-hidden="true" />

      <div className="relative z-20 flex flex-col gap-4 border-b border-[#e0e7f2] bg-white/86 px-5 py-4 backdrop-blur sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#eef3ff] px-4 py-2 font-black text-[#28305f]">Điểm {index + 1}/{points.length}</span>
            <span className="rounded-full bg-[#eaf0ff] px-4 py-2 text-sm font-black text-[#4c57a9]">Chế độ {mode === '9-point' ? 9 : 5} điểm</span>
            {!engineReady && <span className="rounded-full bg-ocu-orange/25 px-4 py-2 text-sm font-black text-ocu-ink">Đang khởi động camera AI…</span>}
          </div>
          <h1 className="mt-3 text-xl font-black text-[#28305f]">Nhìn vào vòng tròn và giữ đầu ổn định</h1>
          <p className="mt-1 text-sm font-semibold text-[#7581a4]">Hệ thống tự nhận diện ánh mắt qua camera — không cần bấm.</p>
          {error && <p className="mt-2 rounded-xl bg-[#fff0ee] p-3 text-sm font-bold text-[#b73b32]">{error}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPaused((value) => !value)} leftIcon={<Pause size={17} />}>{paused ? 'Tiếp tục' : 'Tạm dừng'}</Button>
          <Button size="sm" variant="secondary" onClick={reset} leftIcon={<RotateCcw size={17} />}>Làm lại</Button>
          <Button size="sm" variant="secondary" onClick={() => navigate(childPath('aac'))} leftIcon={<MousePointer2 size={17} />}>Dùng chuột</Button>
          <Button size="sm" variant="ghost" onClick={() => navigate('/care/children')} leftIcon={<X size={17} />}>Thoát</Button>
        </div>
      </div>

      <div
        className={cn(
          'absolute grid h-28 w-28 place-items-center rounded-full border-[10px] border-white bg-[#4c57a9] shadow-[0_18px_50px_rgba(76,87,169,.28)] transition-transform sm:h-36 sm:w-36',
          points[index].position,
          paused && 'opacity-40'
        )}
        aria-label={`Điểm hiệu chỉnh ${index + 1}`}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e7efff] text-sm font-black text-[#28305f] sm:h-12 sm:w-12">
          {settling ? '···' : `${Math.min(samples, SAMPLES_PER_POINT)}/${SAMPLES_PER_POINT}`}
        </span>
      </div>

      {paused && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#28305f]/18 backdrop-blur-sm">
          <div className="rounded-[24px] bg-white p-7 text-center shadow-2xl"><Pause className="mx-auto text-[#4c57a9]" size={36} /><h2 className="mt-3 text-xl font-black">Hiệu chỉnh đang tạm dừng</h2></div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-6 mx-auto w-[min(560px,calc(100%-40px))] overflow-hidden rounded-full bg-white p-1 shadow-sm">
        <div className="h-3 rounded-full bg-[#4c57a9] transition-[width] duration-300" style={{ width: `${((index * SAMPLES_PER_POINT + Math.min(samples, SAMPLES_PER_POINT)) / (points.length * SAMPLES_PER_POINT)) * 100}%` }} />
      </div>
    </div>
  );
}
