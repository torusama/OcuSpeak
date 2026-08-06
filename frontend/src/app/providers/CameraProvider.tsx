import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type CameraStatus = 'IDLE' | 'REQUESTING' | 'READY' | 'DENIED' | 'UNAVAILABLE' | 'ERROR';

type CameraContextValue = {
  stream: MediaStream | null;
  status: CameraStatus;
  error: string | null;
  requestCamera: () => Promise<MediaStream | null>;
  stopCamera: () => void;
};

const CameraContext = createContext<CameraContextValue | null>(null);

export function CameraProvider({ children }: { children: ReactNode }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('IDLE');
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    setStream((current) => {
      current?.getTracks().forEach((track) => track.stop());
      return null;
    });
    setStatus('IDLE');
  }, []);

  const requestCamera = useCallback(async () => {
    if (stream?.active) return stream;
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('UNAVAILABLE');
      setError('Trình duyệt không hỗ trợ camera.');
      return null;
    }

    setStatus('REQUESTING');
    setError(null);

    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(nextStream);
      setStatus('READY');
      return nextStream;
    } catch (cause) {
      const name = cause instanceof DOMException ? cause.name : 'UnknownError';
      const denied = name === 'NotAllowedError' || name === 'PermissionDeniedError';
      setStatus(denied ? 'DENIED' : 'ERROR');
      setError(denied ? 'Quyền camera đã bị từ chối.' : 'Không thể mở camera trên thiết bị này.');
      return null;
    }
  }, [stream]);

  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);

  const value = useMemo(
    () => ({ stream, status, error, requestCamera, stopCamera }),
    [stream, status, error, requestCamera, stopCamera]
  );

  return <CameraContext.Provider value={value}>{children}</CameraContext.Provider>;
}

export function useCamera() {
  const value = useContext(CameraContext);
  if (!value) throw new Error('useCamera must be used within CameraProvider');
  return value;
}
