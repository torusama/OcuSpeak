import { Camera, CameraOff, Eye, Settings2, Wifi, WifiOff } from 'lucide-react';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useCamera } from '@/app/providers/CameraProvider';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ManualSOSButton } from '@/components/patient/ManualSOSButton';
import { StatusChip } from '@/components/ui/StatusChip';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppStore } from '@/stores/useAppStore';

export function PatientLayout() {
  const online = useOnlineStatus();
  const location = useLocation();
  const { childId } = useParams();
  const caregiverLoggedIn = useAppStore((state) => state.caregiverLoggedIn);
  const childProfiles = useAppStore((state) => state.childProfiles);
  const setActiveChildId = useAppStore((state) => state.setActiveChildId);
  const activeChild = childProfiles.find((child) => child.id === childId);
  const { status: cameraStatus } = useCamera();
  const sosPage = location.pathname.endsWith('/sos');
  const gazeReady = ['/aac', '/compose', '/request', '/reassurance', '/sos'].some((path) => location.pathname.includes(path));
  const cameraReady = cameraStatus === 'READY';
  const cameraUnavailable = ['DENIED', 'UNAVAILABLE', 'ERROR'].includes(cameraStatus);

  useEffect(() => {
    if (childId && activeChild) setActiveChildId(childId);
  }, [activeChild, childId, setActiveChildId]);

  if (!caregiverLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!activeChild) return <Navigate to="/care/children" replace />;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f4f8ff_100%)] text-ocu-ink">
      <UnifiedHeader mode="child" />
      <div className="border-b border-[#e1e8f3] bg-white/72 px-4 py-2 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-end gap-2">
          <StatusChip
            label={cameraReady ? 'Camera đang ổn' : cameraUnavailable ? 'Dùng chuột hoặc cảm ứng' : 'Camera chưa mở'}
            tone={cameraReady ? 'success' : cameraUnavailable ? 'warning' : 'neutral'}
            icon={cameraReady ? <Camera size={15} /> : <CameraOff size={15} />}
          />
          <StatusChip
            label={gazeReady && cameraReady ? 'Ánh mắt sẵn sàng' : gazeReady ? 'Chế độ hỗ trợ' : 'Đang thiết lập'}
            tone={gazeReady && cameraReady ? 'info' : 'neutral'}
            icon={gazeReady ? <Eye size={15} /> : <Settings2 size={15} />}
          />
          <StatusChip label={online ? 'Đã kết nối' : 'Chưa có mạng'} tone={online ? 'success' : 'warning'} icon={online ? <Wifi size={15} /> : <WifiOff size={15} />} />
        </div>
      </div>
      <main className="min-h-[calc(100vh-122px)]">
        <div key={location.pathname} className="route-enter">
          <Outlet />
        </div>
      </main>
      {!sosPage && <ManualSOSButton />}
    </div>
  );
}
