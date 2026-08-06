import { Camera, Clock3, Eye, HeartHandshake, HeartPulse, Plus, Send, UsersRound, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertCard } from '@/components/care/AlertCard';
import { CommunicationCard } from '@/components/care/CommunicationCard';
import { MetricCard } from '@/components/care/MetricCard';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { alerts, activityByDay, communications, patientProfile, reassuranceMessages } from '@/data/mockData';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';
import { useAppStore } from '@/stores/useAppStore';

export function DashboardPage() {
  useDocumentTitle('Tổng quan người chăm sóc');
  const { notify } = useToast();
  const childProfiles = useAppStore((state) => state.childProfiles);
  const activeChildId = useAppStore((state) => state.activeChildId);
  const activeChild = childProfiles.find((child) => child.id === activeChildId) ?? childProfiles[0];
  return (
    <>
      <PageHeader eyebrow="Tổng quan hôm nay" title="Không gian người chăm sóc" description={activeChild ? `Đang quản lý hồ sơ ${activeChild.displayName}. Bạn có thể mở giao diện cho trẻ, chỉnh bảng AAC và xử lý yêu cầu.` : 'Hãy tạo hồ sơ trẻ đầu tiên để bắt đầu sử dụng OcuSpeak.'} action={activeChild ? <ButtonLink to={`/child/${activeChild.id}/aac`} leftIcon={<Eye size={18} />}>Mở giao diện cho {activeChild.displayName}</ButtonLink> : <ButtonLink to="/care/children/new" leftIcon={<Plus size={18} />}>Tạo hồ sơ trẻ</ButtonLink>} />
      <section className="mb-7 grid gap-4 sm:grid-cols-2">
        <ButtonLink to="/care/children" variant="secondary" size="lg" leftIcon={<UsersRound size={20} />}>Quản lý hồ sơ trẻ</ButtonLink>
        <ButtonLink to="/care/reassurance" variant="secondary" size="lg" leftIcon={<Send size={20} />}>Gửi lời trấn an</ButtonLink>
      </section>
      <section className="care-grid">
        <MetricCard icon={Wifi} label="Trạng thái giao tiếp" value="Đang trực tuyến" helper={activeChild?.displayName ?? "Chưa chọn hồ sơ"} tone="green" />
        <MetricCard icon={Camera} label="Chất lượng camera" value="Tốt" helper="Mặt ở giữa, đủ sáng" tone="blue" />
        <MetricCard icon={Eye} label="Theo dõi ánh mắt" value="86%" helper="Hiệu chỉnh 5 điểm" tone="indigo" />
        <MetricCard icon={HeartPulse} label="Theo dõi an toàn" value="Đủ theo dõi" helper="rPPG là ước tính thử nghiệm" tone="purple" />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="overflow-hidden"><CardHeader eyebrow="Giao tiếp" title="Yêu cầu mới nhất" description="Yêu cầu mới được kiểm tra mã để tránh hiển thị trùng." action={<Link to="/care/communications" className="text-sm font-black text-ocu-indigo">Xem tất cả</Link>} /><div className="p-5 sm:p-6"><CommunicationCard event={communications[0]} /></div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="Phản hồi nhanh" title="Phản hồi nhanh" description="Câu mẫu đã được người chăm sóc xác nhận." /><div className="grid gap-3 p-5 sm:p-6">{reassuranceMessages.slice(0, 3).map((message) => <button key={message.id} type="button" onClick={() => notify('Đã gửi lời trấn an', message.text)} className="flex items-center gap-4 rounded-2xl border-2 border-ocu-border p-4 text-left hover:border-ocu-pink"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ocu-pink/22 text-ocu-ink"><HeartHandshake size={20} /></span><span className="flex-1"><strong className="block">{message.title}</strong><span className="mt-1 block text-sm font-semibold text-ocu-muted">{message.text}</span></span><Send size={18} className="text-ocu-indigo" /></button>)}</div></Card>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="overflow-hidden"><CardHeader eyebrow="Mức sử dụng" title="Giao tiếp trong 7 ngày" description="Số yêu cầu đã gửi và số yêu cầu đã hoàn thành." /><div className="h-[320px] p-4 sm:p-6"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activityByDay}><defs><linearGradient id="eventsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4C57A9" stopOpacity={0.35}/><stop offset="100%" stopColor="#4C57A9" stopOpacity={0.02}/></linearGradient></defs><CartesianGrid strokeDasharray="4 4" stroke="#E4E1D8" /><XAxis dataKey="day" tick={{ fill: '#737993', fontWeight: 700 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#737993', fontWeight: 700 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 16, border: '2px solid #E4E1D8', fontWeight: 700 }} /><Area type="monotone" dataKey="events" stroke="#4C57A9" strokeWidth={3} fill="url(#eventsFill)" /></AreaChart></ResponsiveContainer></div></Card>
        <div className="grid gap-6"><AlertCard alert={alerts[0]} /><Card className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-orange/25"><Clock3 size={23} /></span><span className="rounded-full bg-ocu-green/20 px-3 py-2 text-xs font-black text-[#3F7048]">-18% tuần này</span></div><p className="mt-4 text-sm font-black text-ocu-muted">Thời gian phản hồi trung bình</p><p className="mt-1 text-3xl font-black text-ocu-ink">2 phút 14 giây</p><p className="mt-2 text-sm font-semibold text-ocu-muted">Tính từ lúc gửi đến lúc người chăm sóc xác nhận đã nhận.</p></Card></div>
      </section>
    </>
  );
}
