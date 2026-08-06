import { Eye, Grid2X2, Plus, Settings2, UserRound, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrbisGuideCard } from '@/components/brand/OrbisGuideCard';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAppStore } from '@/stores/useAppStore';

export function ChildrenPage() {
  useDocumentTitle('Hồ sơ trẻ');
  const navigate = useNavigate();
  const childProfiles = useAppStore((state) => state.childProfiles);
  const activeChildId = useAppStore((state) => state.activeChildId);
  const setActiveChildId = useAppStore((state) => state.setActiveChildId);

  return (
    <>
      <PageHeader
        eyebrow="Hồ sơ trẻ"
        title="Quản lý người sử dụng bảng giao tiếp"
        description="Tạo một hồ sơ riêng cho mỗi trẻ. Từ hồ sơ này, người chăm sóc có thể mở giao diện giao tiếp, hiệu chỉnh ánh mắt và tùy chỉnh bảng AAC."
        action={<ButtonLink to="/care/children/new" leftIcon={<Plus size={18} />}>Tạo hồ sơ trẻ</ButtonLink>}
      />

      <OrbisGuideCard
        mood="guide"
        title="Đây là nơi bắt đầu cho trẻ"
        message="Sau khi tạo hồ sơ, bấm “Mở giao diện giao tiếp” để chuyển sang màn hình dành cho trẻ. Không cần đăng nhập thêm và không cần kết nối một ứng dụng khác."
        className="mb-7"
      />

      {childProfiles.length === 0 ? (
        <Card className="p-8 text-center sm:p-12">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-[#eef3ff] text-[#4c57a9]"><UserRound size={36} /></span>
          <h2 className="mt-5 text-2xl font-black text-[#28305f]">Chưa có hồ sơ trẻ</h2>
          <p className="mx-auto mt-3 max-w-xl font-semibold leading-relaxed text-[#7581a4]">Tạo hồ sơ đầu tiên để thiết lập bảng biểu tượng, thời gian nhìn giữ và giọng đọc phù hợp.</p>
          <ButtonLink to="/care/children/new" className="mt-6" leftIcon={<Plus size={18} />}>Tạo hồ sơ đầu tiên</ButtonLink>
        </Card>
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          {childProfiles.map((child) => {
            const active = child.id === activeChildId;
            return (
              <Card key={child.id} className="overflow-hidden border-[#dbe5f3] shadow-[0_14px_34px_rgba(87,110,170,.08)]">
                <div className="flex items-start justify-between gap-4 border-b border-[#e3e9f3] bg-[linear-gradient(135deg,#f7f9ff,#eef4ff)] p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-white text-xl font-black text-[#4c57a9] shadow-sm">{child.avatarInitials}</span>
                    <div>
                      <p className="eyebrow">Hồ sơ giao tiếp</p>
                      <h2 className="mt-1 text-2xl font-black text-[#28305f]">{child.displayName}</h2>
                      <p className="mt-1 font-semibold text-[#7581a4]">{child.age} tuổi</p>
                    </div>
                  </div>
                  <StatusChip label={active ? 'Đang được chọn' : 'Sẵn sàng'} tone={active ? 'info' : 'neutral'} />
                </div>

                <div className="p-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#f6f8ff] p-4 text-center"><Grid2X2 className="mx-auto text-[#4c57a9]" size={21} /><p className="mt-2 text-xs font-black uppercase tracking-[.1em] text-[#7581a4]">Bố cục</p><p className="mt-1 font-black text-[#28305f]">{child.gridSize} ô</p></div>
                    <div className="rounded-2xl bg-[#f6f8ff] p-4 text-center"><Eye className="mx-auto text-[#4c57a9]" size={21} /><p className="mt-2 text-xs font-black uppercase tracking-[.1em] text-[#7581a4]">Nhìn giữ</p><p className="mt-1 font-black text-[#28305f]">{child.dwellTime} giây</p></div>
                    <div className="rounded-2xl bg-[#f6f8ff] p-4 text-center"><Volume2 className="mx-auto text-[#4c57a9]" size={21} /><p className="mt-2 text-xs font-black uppercase tracking-[.1em] text-[#7581a4]">Giọng đọc</p><p className="mt-1 font-black text-[#28305f]">{child.ttsEnabled ? 'Đã bật' : 'Đã tắt'}</p></div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Button
                      size="lg"
                      onClick={() => {
                        setActiveChildId(child.id);
                        navigate(`/child/${child.id}/aac`);
                      }}
                      leftIcon={<Eye size={19} />}
                    >
                      Mở giao diện giao tiếp
                    </Button>
                    <ButtonLink to={`/child/${child.id}/permissions`} variant="secondary" size="lg" leftIcon={<Eye size={19} />}>Hiệu chỉnh ánh mắt</ButtonLink>
                    <ButtonLink to={`/care/children/${child.id}`} variant="secondary" leftIcon={<Settings2 size={18} />}>Xem và chỉnh hồ sơ</ButtonLink>
                    <ButtonLink to="/care/aac" variant="secondary" leftIcon={<Grid2X2 size={18} />}>Chỉnh bảng AAC</ButtonLink>
                    {!active && <Button variant="ghost" onClick={() => setActiveChildId(child.id)}>Chọn hồ sơ này</Button>}
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      )}
    </>
  );
}
