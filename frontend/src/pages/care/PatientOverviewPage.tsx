import { Camera, Eye, Grid2X2, RefreshCcw, Smartphone, UserRound, Volume2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { patientProfile } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';

export function PatientOverviewPage() {
  useDocumentTitle('Hồ sơ người giao tiếp');
  const { patientId } = useParams();
  const { notify } = useToast();
  return (
    <>
      <PageHeader eyebrow={`Hồ sơ ${patientId}`} title={patientProfile.displayName} description="Hồ sơ hiển thị, thiết bị, hiệu chỉnh ánh mắt và cấu hình giao tiếp. Không lưu bệnh án chi tiết." action={<ButtonLink to="/care/settings" variant="secondary">Chỉnh cấu hình</ButtonLink>} />
      <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <Card className="p-6"><div className="flex items-center gap-5"><span className="grid h-24 w-24 place-items-center rounded-[28px] bg-ocu-yellow text-3xl font-black text-ocu-ink">{patientProfile.avatarInitials}</span><div><h2 className="text-2xl font-black">{patientProfile.displayName}</h2><p className="mt-1 font-semibold text-ocu-muted">{patientProfile.age} tuổi</p><div className="mt-3"><StatusChip label="Đang trực tuyến" tone="success" /></div></div></div><div className="mt-6 grid gap-3">{[
          [UserRound, 'Người chăm sóc chính', 'Võ Tấn An'], [Smartphone, 'Thiết bị chính', 'Laptop phòng khách'], [Camera, 'Camera', 'Quyền đã cấp']
        ].map(([Icon, label, value]) => { const I = Icon as typeof UserRound; return <div key={String(label)} className="flex items-center gap-3 rounded-2xl bg-ocu-soft p-4"><I className="text-ocu-indigo" size={20} /><div><p className="text-xs font-black uppercase tracking-[.1em] text-ocu-muted">{String(label)}</p><p className="mt-1 font-black">{String(value)}</p></div></div>; })}</div></Card>
        <div className="grid gap-6">
          <Card className="overflow-hidden"><CardHeader eyebrow="Hiệu chỉnh ánh mắt" title="Độ chính xác ánh mắt" description="Sai số kiểm tra chỉ hiển thị cho người chăm sóc." action={<Button variant="secondary" size="sm" onClick={() => notify('Đã gửi yêu cầu hiệu chỉnh', 'Màn hình giao tiếp sẽ chuyển vào bước thiết lập khi người dùng sẵn sàng.', 'info')} leftIcon={<RefreshCcw size={17} />}>Yêu cầu hiệu chỉnh lại</Button>} /><div className="grid gap-4 p-6 sm:grid-cols-3"><div className="rounded-2xl bg-ocu-green/18 p-4"><Eye className="text-[#3F7048]" /><p className="mt-3 text-sm font-black text-ocu-muted">Trạng thái</p><p className="mt-1 text-xl font-black">Sẵn sàng</p></div><div className="rounded-2xl bg-ocu-blue/18 p-4"><p className="text-sm font-black text-ocu-muted">Sai số kiểm tra</p><p className="mt-2 text-3xl font-black">74 px</p><p className="mt-1 text-sm font-semibold text-ocu-muted">Phù hợp grid 4 ô</p></div><div className="rounded-2xl bg-ocu-purple/16 p-4"><p className="text-sm font-black text-ocu-muted">Chế độ hiệu chỉnh</p><p className="mt-2 text-3xl font-black">5 điểm</p><p className="mt-1 text-sm font-semibold text-ocu-muted">9 điểm có thể bật lại</p></div></div></Card>
          <Card className="overflow-hidden"><CardHeader eyebrow="Cấu hình AAC" title="Cấu hình hiện tại" /><div className="grid gap-4 p-6 sm:grid-cols-3">{[
            { icon: Grid2X2, label: 'Số ô', value: `${patientProfile.gridSize} ô` }, { icon: Eye, label: 'Thời gian nhìn', value: `${patientProfile.dwellTime} giây` }, { icon: Volume2, label: 'Giọng đọc', value: patientProfile.ttsEnabled ? 'Đang bật' : 'Đang tắt' }
          ].map((item) => <div key={item.label} className="rounded-2xl border-2 border-ocu-border p-4"><item.icon className="text-ocu-indigo" /><p className="mt-3 text-sm font-black text-ocu-muted">{item.label}</p><p className="mt-1 text-xl font-black">{item.value}</p></div>)}</div></Card>
        </div>
      </section>
      <section className="mt-6 rounded-[24px] border-2 border-ocu-red/30 bg-ocu-red/5 p-5"><h2 className="font-black text-ocu-ink">Quản lý liên kết</h2><p className="mt-2 text-sm font-semibold text-ocu-muted">Hủy liên kết sẽ vô hiệu hóa phiên thiết bị hiện tại. Bảng cục bộ vẫn hiển thị nhưng không gửi yêu cầu vào hồ sơ này.</p><Button className="mt-4" variant="danger" size="sm" onClick={() => notify('Chưa hủy liên kết', 'Hệ thống cần xác nhận từ backend trước khi hủy liên kết.', 'warning')}>Hủy liên kết thiết bị</Button></section>
    </>
  );
}
