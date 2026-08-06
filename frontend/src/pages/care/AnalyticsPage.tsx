import { Activity, BarChart3, Clock3, Eye, MessageSquareText, ShieldAlert, TriangleAlert } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MetricCard } from '@/components/care/MetricCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { activityByDay, communicationStatusData, topNeeds } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const pieColors = ['#6BAA75', '#FFAD33', '#6698CC', '#967CC7'];

export function AnalyticsPage() {
  useDocumentTitle('Phân tích giao tiếp');
  return (
    <>
      <PageHeader eyebrow="Phân tích hỗ trợ chăm sóc" title="Xu hướng giao tiếp" description="Các chỉ số hỗ trợ chăm sóc và chất lượng hệ thống. Không diễn giải thành chẩn đoán y khoa." />
      <section className="care-grid"><MetricCard icon={MessageSquareText} label="Lượt giao tiếp" value="88" helper="7 ngày gần nhất" tone="indigo" /><MetricCard icon={Clock3} label="Phản hồi trung bình" value="2m 14s" helper="Từ lúc gửi đến lúc đã nhận" tone="green" /><MetricCard icon={Eye} label="Hiệu chỉnh thành công" value="92%" helper="12 phiên gần nhất" tone="blue" /><MetricCard icon={TriangleAlert} label="Cần kiểm tra" value="4" helper="Không phải chẩn đoán" tone="orange" /></section>
      <section className="mt-7 grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden"><CardHeader eyebrow="Lượt giao tiếp" title="Giao tiếp theo ngày" /><div className="h-[320px] p-4 sm:p-6"><ResponsiveContainer width="100%" height="100%"><LineChart data={activityByDay}><CartesianGrid strokeDasharray="4 4" stroke="#E4E1D8" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737993', fontWeight: 700 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#737993', fontWeight: 700 }} /><Tooltip contentStyle={{ borderRadius: 16, border: '2px solid #E4E1D8', fontWeight: 700 }} /><Line type="monotone" dataKey="events" stroke="#4C57A9" strokeWidth={3} dot={{ r: 5, fill: '#4C57A9' }} /><Line type="monotone" dataKey="completed" stroke="#6BAA75" strokeWidth={3} dot={{ r: 4, fill: '#6BAA75' }} /></LineChart></ResponsiveContainer></div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="Nhu cầu thường dùng" title="Nhu cầu được chọn nhiều" /><div className="h-[320px] p-4 sm:p-6"><ResponsiveContainer width="100%" height="100%"><BarChart data={topNeeds} layout="vertical" margin={{ left: 20 }}><CartesianGrid strokeDasharray="4 4" stroke="#E4E1D8" /><XAxis type="number" axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} tick={{ fill: '#434967', fontWeight: 700 }} /><Tooltip contentStyle={{ borderRadius: 16, border: '2px solid #E4E1D8', fontWeight: 700 }} /><Bar dataKey="value" fill="#6698CC" radius={[0, 10, 10, 0]} /></BarChart></ResponsiveContainer></div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="Trạng thái" title="Phân bố trạng thái" /><div className="grid items-center gap-4 p-6 md:grid-cols-[1fr_.8fr]"><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={communicationStatusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={4}>{communicationStatusData.map((entry, index) => <Cell key={entry.name} fill={pieColors[index]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 16, border: '2px solid #E4E1D8', fontWeight: 700 }} /></PieChart></ResponsiveContainer></div><div className="grid gap-3">{communicationStatusData.map((entry, index) => <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-ocu-soft p-3"><span className="flex items-center gap-3 font-bold"><span className="h-3 w-3 rounded-full" style={{ background: pieColors[index] }} />{entry.name}</span><strong>{entry.value}%</strong></div>)}</div></div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="System quality" title="Tracking và safety reason codes" /><div className="grid gap-4 p-6 sm:grid-cols-2">{[
          { icon: Eye, label: 'Mất theo dõi', value: '7', helper: 'Face mất > 2 giây' }, { icon: Activity, label: 'Tốc độ hình thấp', value: '2', helper: 'Thiết bị yếu' }, { icon: ShieldAlert, label: 'Cảnh báo khẩn cấp', value: '1', helper: 'SOS do người dùng gửi' }, { icon: BarChart3, label: 'Sai số hiệu chỉnh', value: '74 px', helper: 'Trung bình gần nhất' }
        ].map((item) => <div key={item.label} className="rounded-2xl border-2 border-ocu-border p-4"><item.icon className="text-ocu-indigo" /><p className="mt-3 text-sm font-black text-ocu-muted">{item.label}</p><p className="mt-1 text-2xl font-black">{item.value}</p><p className="mt-1 text-sm font-semibold text-ocu-muted">{item.helper}</p></div>)}</div></Card>
      </section>
      <div className="mt-7 rounded-[24px] border-2 border-ocu-orange bg-ocu-orange/15 p-5 font-bold leading-relaxed text-ocu-ink">rPPG không được vẽ như medical trend chính xác. Khi confidence thấp, dashboard hiển thị “Không đủ dữ liệu” thay vì giữ số BPM cũ.</div>
    </>
  );
}
