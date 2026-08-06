import { LockKeyhole, Save, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Field, Select } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { Toggle } from '@/components/ui/Toggle';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';

export function SettingsPage() {
  useDocumentTitle('Cài đặt giao tiếp');
  const [sound, setSound] = useState(true);
  const [tts, setTts] = useState(true);
  const [realImages, setRealImages] = useState(false);
  const [segmenter, setSegmenter] = useState(false);
  const [rppg, setRppg] = useState(true);
  const { notify } = useToast();
  return (
    <>
      <PageHeader eyebrow="Cấu hình giao tiếp" title="Cài đặt giao tiếp" description="Một số ngưỡng được quản lý từ cấu hình hệ thống. Nút SOS luôn được giữ hoạt động." action={<Button onClick={() => notify('Đã lưu cấu hình', 'Backend sẽ kiểm tra giới hạn và ghi phiên bản cấu hình.')} leftIcon={<Save size={18} />}>Lưu cài đặt</Button>} />
      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden"><CardHeader eyebrow="AAC" title="Bố cục và thời gian nhìn" /><div className="grid gap-5 p-6"><Field label="Số ô"><Select defaultValue="4"><option value="4">4 ô — khuyến nghị</option><option value="6">6 ô</option><option value="9">9 ô — nâng cao</option></Select></Field><Field label="Thời gian nhìn để chọn"><Select defaultValue="1.5"><option value="1">1 giây</option><option value="1.5">1.5 giây</option><option value="2">2 giây</option><option value="3">3 giây</option></Select></Field><Field label="Chế độ hiệu chỉnh ánh mắt"><Select defaultValue="5"><option value="5">5 điểm</option><option value="9">9 điểm</option></Select></Field><Toggle checked={realImages} onChange={setRealImages} label="Ưu tiên ảnh thật" description="Dùng ảnh vật dụng quen thuộc thay biểu tượng khi có." /></div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="Phản hồi" title="Âm thanh và giọng đọc" /><div className="grid gap-4 p-6"><Toggle checked={sound} onChange={setSound} label="Âm thanh khi chọn" description="Âm thanh ngắn sau khi chọn, có thể tắt." /><Toggle checked={tts} onChange={setTts} label="Phát câu bằng giọng nói" description="Luôn hiển thị văn bản và dùng giọng đọc của trình duyệt khi dịch vụ chính lỗi." /><Field label="Giọng đọc"><Select defaultValue="vi-female"><option value="vi-female">Tiếng Việt — nữ</option><option value="vi-male">Tiếng Việt — nam</option></Select></Field></div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="Tính năng thử nghiệm" title="Tính năng camera thông minh" description="Các tính năng này có thể được bật hoặc tắt từ cấu hình hệ thống." /><div className="grid gap-4 p-6"><Toggle checked={segmenter} onChange={setSegmenter} label="Nhận diện người trong khung hình" description="Chỉ chạy bổ trợ khi nhận diện khuôn mặt không ổn định." /><Toggle checked={rppg} onChange={setRppg} label="Hiển thị nhịp mạch ước tính" description="Chỉ hiển thị khi chất lượng tín hiệu đạt yêu cầu." /><Toggle checked={false} onChange={() => undefined} disabled label="Cảnh báo khẩn cấp tự động" description="Mặc định tắt cho đến khi kiểm thử tích hợp đạt yêu cầu." /></div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="Cấu hình từ xa" title="Giá trị chỉ đọc" /><div className="grid gap-3 p-6">{['gaze_confidence_min', 'alert_cooldown_ms', 'auto_red_alert_enabled'].map((key) => <div key={key} className="flex items-center justify-between gap-4 rounded-2xl bg-ocu-soft p-4"><div className="flex items-center gap-3"><LockKeyhole className="text-ocu-indigo" size={19} /><div><p className="font-black">{key}</p><p className="text-sm font-semibold text-ocu-muted">Nguồn: cấu hình từ xa phiên bản 3</p></div></div><span className="rounded-full bg-white px-3 py-2 text-xs font-black text-ocu-muted">Chỉ đọc</span></div>)}</div></Card>
      </section>
      <div className="mt-7 flex items-start gap-3 rounded-[24px] bg-ocu-yellow/55 p-5"><Settings2 className="mt-0.5 shrink-0" /><p className="font-bold leading-relaxed">Thay đổi ngưỡng không áp dụng giữa phiên hiệu chỉnh. Giao diện chỉ nhận cấu hình mới sau khi người dùng hoàn thành thao tác hiện tại hoặc ở phiên tiếp theo.</p></div>
    </>
  );
}
