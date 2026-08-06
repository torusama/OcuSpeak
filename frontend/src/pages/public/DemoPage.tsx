import { Bell, Camera, Check, Eye, HeartHandshake, LogIn, MessageSquareText, RefreshCcw, TriangleAlert } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const patientFlow = [
  ['Kết nối thiết bị', 'Nhập mã 6 ký tự do Caregiver tạo.'],
  ['Cấp quyền camera', 'Preview chỉ hiển thị local, có manual mode khi từ chối.'],
  ['Đặt thiết bị', 'Giữ khuôn mặt ở giữa và ánh sáng ổn định.'],
  ['Calibration', 'Chạy 5 điểm mặc định hoặc 9 điểm nâng cao.'],
  ['Chọn AAC', 'Dwell chọn danh mục, item và arrow xem nhóm tiếp theo.'],
  ['Gửi câu', 'Xác nhận câu, phát TTS và theo dõi trạng thái.']
];

const caregiverFlow = [
  ['Đăng nhập demo', 'Dùng bất kỳ email hợp lệ và mật khẩu từ 6 ký tự trong mock mode.'],
  ['Tạo hoặc chọn hồ sơ', 'Dashboard hiển thị Bé An làm patient mẫu.'],
  ['Theo dõi yêu cầu', 'Mở Communication Inbox và cập nhật status.'],
  ['Gửi lời trấn an', 'Chọn câu mẫu hoặc nhập câu tùy chỉnh.'],
  ['Xử lý cảnh báo', 'Phân biệt CHECK_REQUIRED và RED_ALERT.'],
  ['Chỉnh bảng AAC', 'Thêm item, xem preview page bốn ô và cập nhật cấu hình.']
];

export function DemoPage() {
  useDocumentTitle('Hướng dẫn demo');
  return (
    <main className="page-shell py-12 lg:py-16">
      <PageHeader
        eyebrow="Competition demo"
        title="Luồng demo end-to-end"
        description="Hai cửa sổ chạy song song: một cửa sổ Patient Web và một cửa sổ Caregiver PWA. Mock mode cho phép xem đầy đủ UI khi backend và AI Engine chưa được kết nối."
        action={<ButtonLink to="/requirements" variant="secondary">Kiểm tra thiết bị</ButtonLink>}
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="bg-ocu-indigo p-6 text-white">
            <Eye size={32} />
            <h2 className="mt-4 font-display text-3xl">Patient Web</h2>
            <p className="mt-2 font-semibold text-white/75">Giao tiếp gaze-first, manual fallback và SOS độc lập.</p>
          </div>
          <ol className="divide-y-2 divide-ocu-border p-5 sm:p-6">
            {patientFlow.map(([title, text], index) => (
              <li key={title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ocu-indigo/12 font-black text-ocu-indigo">{index + 1}</span>
                <div><h3 className="font-black text-ocu-ink">{title}</h3><p className="mt-1 text-sm font-semibold leading-relaxed text-ocu-muted">{text}</p></div>
              </li>
            ))}
          </ol>
          <div className="border-t-2 border-ocu-border p-5 sm:p-6"><ButtonLink to="/patient/connect" fullWidth>Mở Patient Flow</ButtonLink></div>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-ocu-pink p-6 text-ocu-ink">
            <HeartHandshake size={32} />
            <h2 className="mt-4 font-display text-3xl">Caregiver PWA</h2>
            <p className="mt-2 font-semibold text-ocu-ink/70">Quản lý bảng AAC, giao tiếp, cảnh báo và dữ liệu hỗ trợ theo dõi.</p>
          </div>
          <ol className="divide-y-2 divide-ocu-border p-5 sm:p-6">
            {caregiverFlow.map(([title, text], index) => (
              <li key={title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ocu-pink/24 font-black text-ocu-ink">{index + 1}</span>
                <div><h3 className="font-black text-ocu-ink">{title}</h3><p className="mt-1 text-sm font-semibold leading-relaxed text-ocu-muted">{text}</p></div>
              </li>
            ))}
          </ol>
          <div className="border-t-2 border-ocu-border p-5 sm:p-6"><ButtonLink to="/care/login" fullWidth variant="secondary">Mở Caregiver Flow</ButtonLink></div>
        </Card>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Camera, title: 'Camera', text: 'Cho phép để xem preview và setup. Có thể tiếp tục manual mode khi bị từ chối.' },
          { icon: Bell, title: 'Notification', text: 'Caregiver xin quyền trên trang Notification Settings. Mock mode vẫn mô phỏng trạng thái.' },
          { icon: MessageSquareText, title: 'Gemini fallback', text: 'Nếu dịch vụ tạo câu lỗi, frontend hiển thị câu mẫu deterministic ngay.' },
          { icon: TriangleAlert, title: 'SOS', text: 'Kích hoạt RED_ALERT ngay và deduplicate theo cùng event ID.' }
        ].map((item) => (
          <Card key={item.title} className="p-5"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-ocu-indigo/12 text-ocu-indigo"><item.icon size={22} /></span><h3 className="mt-4 font-black text-ocu-ink">{item.title}</h3><p className="mt-2 text-sm font-semibold leading-relaxed text-ocu-muted">{item.text}</p></Card>
        ))}
      </section>

      <section className="mt-10 rounded-[28px] border-2 border-ocu-border bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow">Reset scenario</p>
            <h2 className="mt-2 text-2xl font-black text-ocu-ink">Dữ liệu demo chạy độc lập trong trình duyệt</h2>
            <p className="mt-2 max-w-2xl font-semibold leading-relaxed text-ocu-muted">Xóa localStorage key <code className="rounded bg-ocu-soft px-2 py-1 text-sm">ocuspeak-ui-state</code> để reset selected items, pairing và trạng thái request.</p>
          </div>
          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-ocu-border px-5 font-black text-ocu-indigo" onClick={() => { localStorage.removeItem('ocuspeak-ui-state'); window.location.reload(); }}><RefreshCcw size={18} /> Reset demo</button>
        </div>
      </section>

      <section className="mt-8 rounded-[24px] bg-ocu-yellow/55 p-5">
        <div className="flex items-start gap-3"><Check className="mt-0.5 shrink-0 text-[#4F875A]" /><p className="font-bold leading-relaxed text-ocu-ink">Luồng trình diễn khuyến nghị: Caregiver login → pair → Patient permissions/setup/calibration → AAC selection → compose/send → Caregiver communication detail → reassurance → Patient request status → Manual SOS → Caregiver alert acknowledgement.</p></div>
      </section>
    </main>
  );
}
