import { Bell, CheckCircle2, Clock3, Link2, LogOut, Settings2, UserRound, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrbisGuideCard } from '@/components/brand/OrbisGuideCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Toggle } from '@/components/ui/Toggle';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAppStore } from '@/stores/useAppStore';

export function ProfilePage() {
  useDocumentTitle('Hồ sơ giao tiếp');
  const navigate = useNavigate();
  const patientLoggedIn = useAppStore((state) => state.patientLoggedIn);
  const patientName = useAppStore((state) => state.patientName);
  const patientPaired = useAppStore((state) => state.patientPaired);
  const setPatientLoggedIn = useAppStore((state) => state.setPatientLoggedIn);
  const setPatientPaired = useAppStore((state) => state.setPatientPaired);


  if (!patientLoggedIn) {
    return (
      <div className="mx-auto grid min-h-[calc(100vh-160px)] max-w-3xl place-items-center px-4 py-10 text-center sm:px-6">
        <Card className="w-full border-[#dbe5f3] p-8 shadow-[0_14px_32px_rgba(87,110,170,.08)]">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-[#eaf0ff] text-[#4c57a9]"><UserRound size={30} /></span>
          <h1 className="display-rounded mt-5 text-4xl font-extrabold text-[#28305f]">Bạn chưa đăng nhập hồ sơ</h1>
          <p className="mx-auto mt-3 max-w-xl font-semibold leading-relaxed text-[#7581a4]">Đăng nhập để xem trạng thái kết nối, cấu hình ánh mắt và các tùy chọn hỗ trợ giao tiếp.</p>
          <Button className="mt-6" onClick={() => navigate('/login')}>Đăng nhập</Button>
        </Card>
      </div>
    );
  }

  const signOut = () => {
    setPatientLoggedIn(false);
    setPatientPaired(false);
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
        <Card className="border-[#dbe5f3] p-6 shadow-[0_14px_32px_rgba(87,110,170,.08)] sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid h-20 w-20 place-items-center rounded-[26px] bg-[#eaf0ff] text-[#4c57a9]"><UserRound size={38} /></span>
            <div>
              <p className="eyebrow">Hồ sơ người giao tiếp</p>
              <h1 className="display-rounded mt-1 text-4xl font-extrabold text-[#28305f]">{patientName}</h1>
              <p className="mt-1 font-semibold text-[#7581a4]">11 tuổi · Hồ sơ gia đình</p>
            </div>
          </div>

          <div className="mt-7 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#f6f8ff] p-4">
              <div className="flex items-center gap-3"><Link2 className="text-[#4c57a9]" size={20} /><span className="font-black text-[#28305f]">Ứng dụng người chăm sóc</span></div>
              <StatusChip label={patientPaired ? 'Đã kết nối' : 'Chưa kết nối'} tone={patientPaired ? 'success' : 'warning'} />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#f6f8ff] p-4">
              <div className="flex items-center gap-3"><CheckCircle2 className="text-[#4c57a9]" size={20} /><span className="font-black text-[#28305f]">Hiệu chỉnh ánh mắt</span></div>
              <span className="text-sm font-black text-[#5f8d79]">Sẵn sàng</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#f6f8ff] p-4">
              <div className="flex items-center gap-3"><Clock3 className="text-[#4c57a9]" size={20} /><span className="font-black text-[#28305f]">Thời gian nhìn giữ</span></div>
              <span className="text-sm font-black text-[#596584]">1,5 giây</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Button variant="secondary" onClick={() => navigate('/patient/connect')}>Kết nối lại</Button>
            <Button variant="danger" onClick={signOut} leftIcon={<LogOut size={18} />}>Đăng xuất</Button>
          </div>
        </Card>

        <div className="grid gap-6">
          <OrbisGuideCard mood="calm" title="Cấu hình được lưu theo hồ sơ" message="Khi đổi thiết bị, người chăm sóc chỉ cần đăng nhập hồ sơ và kết nối lại ứng dụng để khôi phục bảng giao tiếp." />
          <Card className="border-[#dbe5f3] p-6 shadow-[0_14px_32px_rgba(87,110,170,.08)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef3ff] text-[#4c57a9]"><Settings2 size={24} /></span>
              <div>
                <p className="eyebrow">Cài đặt hỗ trợ</p>
                <h2 className="mt-1 text-2xl font-black text-[#28305f]">Giao diện và phản hồi</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <Toggle checked onChange={() => undefined} label="Phát giọng nói sau khi xác nhận câu" description="Câu vẫn hiển thị bằng văn bản nếu âm thanh không hoạt động." />
              <Toggle checked onChange={() => undefined} label="Âm báo khi chọn biểu tượng" description="Phản hồi ngắn giúp người dùng biết lựa chọn đã được ghi nhận." />
              <Toggle checked onChange={() => undefined} label="Nhận lời trấn an từ người chăm sóc" description="Hiển thị nội dung và phát giọng nói khi ứng dụng người chăm sóc gửi phản hồi." />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f6f8ff] p-4"><Volume2 className="text-[#4c57a9]" /><p className="mt-3 font-black text-[#28305f]">Giọng đọc</p><p className="mt-1 text-sm font-semibold text-[#7581a4]">Tiếng Việt · tốc độ chậm</p></div>
              <div className="rounded-2xl bg-[#f6f8ff] p-4"><Bell className="text-[#4c57a9]" /><p className="mt-3 font-black text-[#28305f]">Thông báo</p><p className="mt-1 text-sm font-semibold text-[#7581a4]">Lời trấn an và xác nhận yêu cầu</p></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
