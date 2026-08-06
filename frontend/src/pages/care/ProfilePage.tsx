import { Bell, LogOut, Mail, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrbisGuideCard } from '@/components/brand/OrbisGuideCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAppStore } from '@/stores/useAppStore';

export function CaregiverProfilePage() {
  useDocumentTitle('Hồ sơ người chăm sóc');
  const navigate = useNavigate();
  const caregiverName = useAppStore((state) => state.caregiverName);
  const childProfiles = useAppStore((state) => state.childProfiles);
  const activeChildId = useAppStore((state) => state.activeChildId);
  const activeChild = childProfiles.find((child) => child.id === activeChildId) ?? childProfiles[0];
  const setCaregiverLoggedIn = useAppStore((state) => state.setCaregiverLoggedIn);

  const signOut = () => {
    setCaregiverLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="grid gap-7 xl:grid-cols-[.82fr_1.18fr]">
      <Card className="border-[#dbe5f3] p-6 shadow-[0_14px_32px_rgba(87,110,170,.08)] sm:p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-20 w-20 place-items-center rounded-[26px] bg-[#eaf0ff] text-[#4c57a9]"><UserRound size={38} /></span>
          <div>
            <p className="eyebrow">Hồ sơ người chăm sóc</p>
            <h1 className="display-rounded mt-1 text-4xl font-extrabold text-[#28305f]">{caregiverName}</h1>
            <p className="mt-1 font-semibold text-[#7581a4]">Tài khoản gia đình</p>
          </div>
        </div>

        <div className="mt-7 grid gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f6f8ff] p-4">
            <Mail className="text-[#4c57a9]" size={20} />
            <div><p className="font-black text-[#28305f]">Email</p><p className="text-sm font-semibold text-[#7581a4]">caregiver@ocuspeak.demo</p></div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#f6f8ff] p-4">
            <div className="flex items-center gap-3"><UsersRound className="text-[#4c57a9]" size={20} /><span className="font-black text-[#28305f]">Hồ sơ trẻ đang quản lý</span></div>
            <StatusChip label={`${childProfiles.length} hồ sơ`} tone={childProfiles.length ? 'success' : 'warning'} />
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#f6f8ff] p-4">
            <ShieldCheck className="text-[#4c57a9]" size={20} />
            <div><p className="font-black text-[#28305f]">Vai trò</p><p className="text-sm font-semibold text-[#7581a4]">Người chăm sóc chính</p></div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <Button variant="secondary" onClick={() => navigate('/care/children')}>Quản lý hồ sơ trẻ</Button>
          <Button variant="danger" onClick={signOut} leftIcon={<LogOut size={18} />}>Đăng xuất</Button>
        </div>
      </Card>

      <div className="grid gap-6">
        <OrbisGuideCard
          mood="calm"
          title="Một tài khoản quản lý toàn bộ gia đình"
          message="Bạn tạo hồ sơ cho trẻ, chỉnh bảng AAC, mở giao diện giao tiếp và nhận yêu cầu ngay trong cùng website. Không cần kết nối một ứng dụng riêng."
        />

        <Card className="border-[#dbe5f3] p-6 shadow-[0_14px_32px_rgba(87,110,170,.08)] sm:p-8">
          {activeChild ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Hồ sơ đang được chọn</p>
                  <h2 className="mt-1 text-2xl font-black text-[#28305f]">{activeChild.displayName}</h2>
                  <p className="mt-2 font-semibold text-[#7581a4]">{activeChild.age} tuổi · Bảng {activeChild.gridSize} ô · Thời gian nhìn giữ {activeChild.dwellTime} giây</p>
                </div>
                <StatusChip label="Sẵn sàng" tone="success" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Button onClick={() => navigate(`/child/${activeChild.id}/aac`)}>Mở giao diện cho trẻ</Button>
                <Button variant="secondary" onClick={() => navigate(`/care/children/${activeChild.id}`)}>Chỉnh hồ sơ trẻ</Button>
                <Button variant="secondary" onClick={() => navigate('/care/aac')}>Chỉnh bảng AAC</Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#28305f]">Chưa có hồ sơ trẻ</h2>
              <p className="mt-3 font-semibold text-[#7581a4]">Tạo hồ sơ đầu tiên để mở giao diện giao tiếp.</p>
              <Button className="mt-6" onClick={() => navigate('/care/children/new')}>Tạo hồ sơ trẻ</Button>
            </div>
          )}
        </Card>

        <Card className="border-[#dbe5f3] p-6 shadow-[0_14px_32px_rgba(87,110,170,.08)] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef3ff] text-[#4c57a9]"><Bell size={24} /></span>
            <div><p className="eyebrow">Thông báo</p><h2 className="mt-1 text-xl font-black text-[#28305f]">Quyền nhận cảnh báo</h2></div>
          </div>
          <p className="mt-4 font-semibold leading-relaxed text-[#7581a4]">Cho phép thông báo trên điện thoại và thêm web vào màn hình chính để nhận yêu cầu, trạng thái cần kiểm tra và SOS thuận tiện hơn.</p>
        </Card>
      </div>
    </div>
  );
}
