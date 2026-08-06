import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ImagePlus, Save, Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { IconSymbol } from '@/components/common/IconSymbol';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { Toggle } from '@/components/ui/Toggle';
import { aacItems, categories } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const schema = z.object({
  label: z.string().min(1, 'Nhãn không được để trống.').max(30, 'Nhãn nên tối đa 30 ký tự.'),
  categoryId: z.string().min(1),
  speechText: z.string().min(1, 'Cần speech text.').max(180, 'Speech text quá dài.'),
  quickSentence: z.string().min(1).max(220),
  altText: z.string().min(1, 'Cần alt text cho hình ảnh.'),
  icon: z.string().min(1),
  color: z.string().min(1)
});

type ItemForm = z.infer<typeof schema>;

export function ItemEditorPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const existing = aacItems.find((item) => item.id === itemId);
  const isNew = !existing;
  useDocumentTitle(isNew ? 'Thêm lựa chọn AAC' : `Sửa ${existing.label}`);
  const form = useForm<ItemForm>({ resolver: zodResolver(schema), defaultValues: existing ? { label: existing.label, categoryId: existing.categoryId, speechText: existing.speechText, quickSentence: existing.quickSentence, altText: existing.altText, icon: existing.icon, color: existing.color } : { label: '', categoryId: 'needs', speechText: '', quickSentence: '', altText: '', icon: 'GlassWater', color: 'blue' } });
  const visible = form.watch();
  const submit = form.handleSubmit(async () => { await new Promise((resolve) => setTimeout(resolve, 500)); navigate(`/care/aac/category/${visible.categoryId}`); });
  const [enabled, setEnabled] = useState(existing?.visible ?? true);

  return (
    <>
      <div className="mb-5"><Link to={`/care/aac/category/${visible.categoryId || 'needs'}`} className="inline-flex items-center gap-2 text-sm font-black text-ocu-indigo"><ArrowLeft size={17} /> Quay lại category</Link></div>
      <PageHeader eyebrow={isNew ? 'Lựa chọn AAC mới' : `Lựa chọn ${existing.id}`} title={isNew ? 'Thêm lựa chọn mới' : `Sửa “${existing.label}”`} description="Nhãn cần ngắn, hình ảnh rõ và câu phát âm không chứa mã HTML. Thẻ xem trước dùng đúng giao diện của màn hình giao tiếp." />
      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="overflow-hidden"><CardHeader eyebrow="Nội dung" title="Thông tin lựa chọn" /><div className="grid gap-5 p-6"><Field label="Nhãn hiển thị" error={form.formState.errors.label?.message} required><Input {...form.register('label')} error={Boolean(form.formState.errors.label)} placeholder="Ví dụ: Uống nước" /></Field><Field label="Danh mục" required><Select {...form.register('categoryId')}>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</Select></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Biểu tượng"><Select {...form.register('icon')}><option value="GlassWater">Ly nước</option><option value="Soup">Thức ăn</option><option value="HeartHandshake">Trấn an</option><option value="Music2">Âm nhạc</option><option value="UserRound">Người thân</option></Select></Field><Field label="Màu"><Select {...form.register('color')}><option value="blue">Ocu Blue</option><option value="orange">Ocu Orange</option><option value="pink">Ocu Pink</option><option value="green">Ocu Green</option><option value="purple">Ocu Purple</option><option value="red">Ocu Red</option></Select></Field></div><Field label="Câu phát âm" error={form.formState.errors.speechText?.message} required><Textarea {...form.register('speechText')} error={Boolean(form.formState.errors.speechText)} placeholder="Con muốn uống nước." /></Field><Field label="Câu mẫu nhanh" error={form.formState.errors.quickSentence?.message} required><Textarea {...form.register('quickSentence')} error={Boolean(form.formState.errors.quickSentence)} /></Field><Field label="Mô tả hình ảnh" error={form.formState.errors.altText?.message} required><Input {...form.register('altText')} error={Boolean(form.formState.errors.altText)} /></Field><Toggle checked={enabled} onChange={setEnabled} label="Hiển thị trên màn hình giao tiếp" description="Khi tắt, lựa chọn không xuất hiện ở lần tải trang tiếp theo." /></div></Card>
        <div className="grid content-start gap-6"><Card className="overflow-hidden"><CardHeader eyebrow="Hình ảnh" title="Ảnh hoặc biểu tượng" description="Tải ảnh quen thuộc khi nối vùng lưu trữ. Hiện tại giao diện chỉ xem trước ảnh trên thiết bị." /><div className="p-6"><button type="button" className="grid min-h-44 w-full place-items-center rounded-[22px] border-2 border-dashed border-ocu-blue bg-ocu-blue/7 text-center"><div><ImagePlus className="mx-auto text-ocu-indigo" size={36} /><p className="mt-3 font-black">Chọn hoặc kéo ảnh vào đây</p><p className="mt-1 text-sm font-semibold text-ocu-muted">JPG/PNG/WebP, kiểm tra dung lượng trước khi tải lên</p></div></button><Button type="button" variant="secondary" fullWidth className="mt-4" leftIcon={<Upload size={18} />}>Chọn tệp</Button></div></Card><Card className="p-6"><p className="eyebrow">Xem trước màn hình giao tiếp</p><div className="mt-5 flex aspect-[1.1/1] flex-col items-center justify-center gap-5 rounded-[26px] border-4 border-ocu-indigo bg-white p-5 shadow-card"><span className="grid h-28 w-28 place-items-center rounded-[26px] bg-ocu-blue/22"><IconSymbol name={visible.icon || 'GlassWater'} size={58} /></span><span className="text-2xl font-black">{visible.label || 'Nhãn lựa chọn'}</span><span className="absolute" /></div></Card><div className="grid gap-3 sm:grid-cols-2"><Button type="submit" loading={form.formState.isSubmitting} leftIcon={<Save size={18} />}>Lưu lựa chọn</Button>{!isNew && <Button type="button" variant="danger" leftIcon={<Trash2 size={18} />}>Xóa lựa chọn</Button>}</div></div>
      </form>
    </>
  );
}
