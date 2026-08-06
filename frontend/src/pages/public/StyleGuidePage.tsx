import { AlertTriangle, Check, ChevronDown, Eye, HeartHandshake, LoaderCircle, MessageSquareText, Send, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input, Select } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Toggle } from '@/components/ui/Toggle';
import { useState } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const palette = [
  ['Ocu Red', '#CC1400', 'SOS và danger'], ['Ocu Orange', '#FFAD33', 'Warning'], ['Ocu Yellow', '#FFEC89', 'Highlight'], ['Ocu Green', '#6BAA75', 'Success'],
  ['Ocu Pink', '#C28CAE', 'Reassurance'], ['Ocu Purple', '#967CC7', 'AI và presets'], ['Ocu Indigo', '#4C57A9', 'Primary brand'], ['Ocu Blue', '#6698CC', 'Information']
];

export function StyleGuidePage() {
  useDocumentTitle('UI System');
  const [enabled, setEnabled] = useState(true);
  return (
    <main className="page-shell py-12 lg:py-16">
      <PageHeader eyebrow="OcuSpeak design system" title="Friendly, stable, gaze-first" description="Nunito và Feather Bold, palette tám màu OcuSpeak, mục tiêu lớn và trạng thái không phụ thuộc riêng vào màu." />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6"><p className="eyebrow">Foundations</p><h2 className="mt-2 text-2xl font-black">Color palette</h2><div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">{palette.map(([name, hex, usage]) => <div key={hex}><div className="aspect-square rounded-[22px] border border-black/5" style={{ background: hex }} /><p className="mt-3 text-sm font-black text-ocu-ink">{name}</p><p className="text-xs font-bold text-ocu-muted">{hex}</p><p className="mt-1 text-xs font-semibold text-ocu-muted">{usage}</p></div>)}</div></Card>
        <Card className="p-6"><p className="eyebrow">Typography</p><div className="mt-5 grid gap-5"><div><span className="text-xs font-black text-ocu-blue">52px / Feather Bold</span><p className="font-display text-5xl text-ocu-indigo">OcuSpeak</p></div><div><span className="text-xs font-black text-ocu-blue">32px / Nunito 900</span><p className="text-3xl font-black">Heading One</p></div><div><span className="text-xs font-black text-ocu-blue">18px / Nunito 600</span><p className="text-lg font-semibold leading-relaxed text-ocu-muted">Nội dung rõ ràng với khoảng cách dòng thoải mái cho caregiver.</p></div><div><span className="text-xs font-black uppercase tracking-[.14em] text-ocu-muted">Caption label</span></div></div></Card>

        <Card className="p-6"><p className="eyebrow">Buttons</p><h2 className="mt-2 text-2xl font-black">Tactile actions</h2><div className="mt-6 flex flex-wrap gap-4"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="danger">Danger</Button><Button variant="warning">Warning</Button><Button variant="success">Success</Button><Button loading>Loading</Button><Button disabled>Disabled</Button></div></Card>
        <Card className="p-6"><p className="eyebrow">States</p><h2 className="mt-2 text-2xl font-black">Status language</h2><div className="mt-6 flex flex-wrap gap-3"><StatusChip label="Normal" tone="success" /><StatusChip label="Tracking" tone="info" icon={<Eye size={15} />} /><StatusChip label="Cần kiểm tra" tone="warning" /><StatusChip label="Khẩn cấp" tone="danger" /></div><div className="mt-6 grid gap-3"><Toggle checked={enabled} onChange={setEnabled} label="Phản hồi âm thanh" description="Có thể tắt theo hồ sơ người dùng." /><Toggle checked={false} onChange={() => undefined} label="rPPG thử nghiệm" description="Không hiển thị BPM khi confidence thấp." disabled /></div></Card>

        <Card className="p-6 lg:col-span-2"><p className="eyebrow">AAC gaze targets</p><h2 className="mt-2 text-2xl font-black">Grid ổn định và dwell progress</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[
          { label: 'Uống nước', icon: Volume2, bg: 'bg-ocu-blue/22' }, { label: 'Gọi mẹ', icon: HeartHandshake, bg: 'bg-ocu-pink/24' }, { label: 'Đang nhìn', icon: Eye, bg: 'bg-ocu-yellow/60', focused: true }, { label: 'Đã chọn', icon: Check, bg: 'bg-ocu-green/24', selected: true }
        ].map((item) => <div key={item.label} className={`relative flex min-h-[180px] flex-col items-center justify-center gap-4 overflow-hidden rounded-[26px] border-4 bg-white p-5 shadow-card ${item.focused ? 'border-ocu-indigo' : item.selected ? 'border-ocu-green' : 'border-transparent'}`}><span className={`grid h-20 w-20 place-items-center rounded-[22px] ${item.bg}`}><item.icon size={36} /></span><span className="text-xl font-black">{item.label}</span>{item.focused && <span className="absolute inset-x-0 bottom-0 h-3 bg-ocu-yellow"><span className="block h-full w-2/3 bg-ocu-indigo" /></span>}</div>)}</div><div className="mt-5 flex min-h-[78px] items-center justify-center gap-3 rounded-[22px] border-4 border-transparent bg-white font-black text-ocu-indigo shadow-card"><ChevronDown /> Xem bốn lựa chọn tiếp theo</div></Card>

        <Card className="p-6"><p className="eyebrow">Forms</p><h2 className="mt-2 text-2xl font-black">Caregiver inputs</h2><div className="mt-6 grid gap-5"><Field label="Nhãn hiển thị"><Input defaultValue="Uống nước" /></Field><Field label="Danh mục"><Select defaultValue="needs"><option value="needs">Nhu cầu</option><option value="feelings">Cảm xúc</option></Select></Field><Field label="Trạng thái lỗi" error="Nhãn không được để trống"><Input error placeholder="Nhập nhãn" /></Field></div></Card>
        <Card className="p-6"><p className="eyebrow">Safety</p><h2 className="mt-2 text-2xl font-black">Alert hierarchy</h2><div className="mt-6 grid gap-4"><div className="rounded-2xl border-2 border-ocu-green bg-ocu-green/12 p-4"><div className="flex items-center gap-3"><Check className="text-[#3F7048]" /><strong>Normal</strong></div></div><div className="rounded-2xl border-2 border-ocu-orange bg-ocu-orange/18 p-4"><div className="flex items-center gap-3"><AlertTriangle /><strong>CHECK_REQUIRED</strong></div><p className="mt-2 text-sm font-semibold text-ocu-muted">Cần kiểm tra, không phải chẩn đoán.</p></div><div className="rounded-2xl bg-ocu-red p-4 text-white"><div className="flex items-center gap-3"><AlertTriangle /><strong>RED_ALERT</strong></div><p className="mt-2 text-sm font-semibold text-white/75">Manual SOS hoặc rule đã qua confidence gate.</p></div></div></Card>
      </section>
    </main>
  );
}
