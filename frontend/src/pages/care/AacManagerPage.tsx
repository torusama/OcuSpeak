import { ChevronDown, ChevronUp, Eye, EyeOff, Grid2X2, Plus, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BoardPreview } from '@/components/care/BoardPreview';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { aacItems, categories } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';
import { useAppStore } from '@/stores/useAppStore';

export function AacManagerPage() {
  useDocumentTitle('Quản lý bảng giao tiếp');
  const { notify } = useToast();
  const activeChildId = useAppStore((state) => state.activeChildId);
  const childProfiles = useAppStore((state) => state.childProfiles);
  const activeChild = childProfiles.find((child) => child.id === activeChildId) ?? childProfiles[0];
  const previewPath = activeChild ? `/child/${activeChild.id}/aac` : '/care/children';
  return (
    <>
      <PageHeader eyebrow="Tùy chỉnh bảng AAC" title="Quản lý bảng giao tiếp" description={activeChild ? `Đang chỉnh bảng AAC cho ${activeChild.displayName}. Sắp xếp danh mục, thêm biểu tượng và xem trước giao diện dành cho trẻ.` : "Hãy tạo hoặc chọn một hồ sơ trẻ trước khi chỉnh bảng AAC."} action={<ButtonLink to="/care/aac/item/new" leftIcon={<Plus size={18} />}>Thêm lựa chọn</ButtonLink>} />
      <section className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Card className="overflow-hidden"><CardHeader eyebrow="Danh mục" title="Danh mục đang hiển thị" action={<ButtonLink to="/care/aac/item/new" variant="secondary" size="sm">Thêm lựa chọn nhanh</ButtonLink>} /><div className="divide-y-2 divide-ocu-border">{categories.map((category, index) => {
          const itemCount = aacItems.filter((item) => item.categoryId === category.id && item.visible).length;
          return <div key={category.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-indigo/12 font-black text-ocu-indigo">{index + 1}</span><div className="min-w-0 flex-1"><Link to={`/care/aac/category/${category.id}`} className="text-lg font-black text-ocu-ink hover:text-ocu-indigo">{category.label}</Link><p className="mt-1 text-sm font-semibold text-ocu-muted">{itemCount} lựa chọn, {Math.ceil(itemCount / 4)} trang bốn ô</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => notify(`Đã ưu tiên ${category.label}`, 'Thứ tự mới đã được ghi nhận và sẽ được lưu qua backend.', 'info')} className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ocu-border" aria-label="Di chuyển lên"><ChevronUp size={18} /></button><button type="button" onClick={() => notify(`Đã hạ ${category.label}`, 'Màn hình giao tiếp sẽ nhận thứ tự mới sau khi người dùng hoàn thành thao tác hiện tại.', 'info')} className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ocu-border" aria-label="Di chuyển xuống"><ChevronDown size={18} /></button><button type="button" onClick={() => notify(`${category.visible ? 'Ẩn' : 'Hiện'} ${category.label}`, 'Thay đổi đã được ghi nhận và sẽ được lưu qua backend.', 'warning')} className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ocu-border" aria-label={category.visible ? 'Ẩn danh mục' : 'Hiện danh mục'}>{category.visible ? <Eye size={18} /> : <EyeOff size={18} />}</button><Link to={`/care/aac/category/${category.id}`} className="grid h-10 w-10 place-items-center rounded-xl bg-ocu-indigo text-white" aria-label="Mở trang chỉnh sửa"><Settings2 size={18} /></Link></div></div>})}</div></Card>
        <Card className="overflow-hidden"><CardHeader eyebrow="Xem trước màn hình giao tiếp" title={activeChild ? `Bố cục ${activeChild.gridSize} ô của ${activeChild.displayName}` : "Chưa chọn hồ sơ trẻ"} description="Xem trước vị trí các mục tiêu và nội dung trang đầu tiên." action={<ButtonLink to={previewPath} variant="secondary" size="sm" leftIcon={<Eye size={17} />}>Mở bản xem trước</ButtonLink>} /><div className="p-5 sm:p-6"><BoardPreview items={aacItems.filter((item) => item.categoryId === 'needs').slice(0, 4)} /><div className="mt-5 grid grid-cols-3 gap-3">{[['Bố cục', `${activeChild?.gridSize ?? 4} ô`], ['Thời gian nhìn', `${activeChild?.dwellTime ?? 1.5} giây`], ['Số trang', '2']].map(([label, value]) => <div key={label} className="rounded-2xl bg-ocu-soft p-4 text-center"><p className="text-xs font-black uppercase tracking-[.1em] text-ocu-muted">{label}</p><p className="mt-1 text-lg font-black">{value}</p></div>)}</div><ButtonLink to="/care/settings" variant="secondary" fullWidth className="mt-5" leftIcon={<Grid2X2 size={18} />}>Chỉnh bố cục và thời gian nhìn</ButtonLink></div></Card>
      </section>
    </>
  );
}
