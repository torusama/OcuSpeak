import { Camera, CameraOff } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useCamera } from '@/app/providers/CameraProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export function CameraPreview({ className, showControls = true }: { className?: string; showControls?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, status, error, requestCamera, stopCamera } = useCamera();

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={cn('overflow-hidden rounded-[26px] border-2 border-ocu-border bg-ocu-ink', className)}>
      <div className="relative aspect-video">
        {stream ? (
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full scale-x-[-1] object-cover" aria-label="Hình xem trước từ camera trên thiết bị" />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(102,152,204,.35),transparent_45%),#28305F] text-white">
            <div className="text-center">
              <CameraOff className="mx-auto text-white/60" size={48} />
              <p className="mt-3 font-black">Camera chưa được mở</p>
              <p className="mt-1 text-sm font-semibold text-white/60">Hình xem trước chỉ hiển thị trên thiết bị này.</p>
            </div>
          </div>
        )}
        {stream && <div className="pointer-events-none absolute inset-[12%] rounded-[50%] border-4 border-dashed border-white/75" />}
      </div>
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4">
          <div>
            <p className="text-sm font-black text-ocu-ink">{status === 'READY' ? 'Camera đang hoạt động' : status === 'REQUESTING' ? 'Đang xin quyền camera' : 'Camera chưa sẵn sàng'}</p>
            {error && <p className="mt-1 text-xs font-bold text-ocu-red">{error}</p>}
          </div>
          {stream ? (
            <Button variant="secondary" size="sm" onClick={stopCamera} leftIcon={<CameraOff size={17} />}>Tắt camera</Button>
          ) : (
            <Button size="sm" loading={status === 'REQUESTING'} onClick={() => void requestCamera()} leftIcon={<Camera size={17} />}>Mở camera</Button>
          )}
        </div>
      )}
    </div>
  );
}
