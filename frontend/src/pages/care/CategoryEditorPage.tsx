import { ArrowLeft, Eye, EyeOff, GripVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useToast } from '@/app/providers/ToastProvider';
import { BoardPreview } from '@/components/care/BoardPreview';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { aacItems, categories } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function CategoryEditorPage() {
  const { categoryId = 'needs' } = useParams();
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  useDocumentTitle(`Chỉnh ${category.label}`);
  const { notify } = useToast();
  const [query, setQuery] = useState('');
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const items = useMemo(
    () =>
      aacItems
        .filter(
          (item) =>
            item.categoryId === category.id &&
            !removedIds.includes(item.id) &&
            item.label.toLowerCase().includes(query.toLowerCase())
        )
        .map((item) => ({ ...item, visible: item.visible && !hiddenIds.includes(item.id) }))
        .sort((a, b) => a.order - b.order),
    [category.id, hiddenIds, query, removedIds]
  );

  const visibleItems = items.filter((item) => item.visible);
  const pages = Array.from({ length: Math.max(1, Math.ceil(visibleItems.length / 4)) }, (_, index) =>
    visibleItems.slice(index * 4, index * 4 + 4)
  );

  const toggleVisibility = (id: string, label: string) => {
    setHiddenIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
    notify('Đã cập nhật hiển thị', `${label} sẽ được đồng bộ sau khi người dùng hoàn thành thao tác hiện tại.`, 'info');
  };

  const removeItem = (id: string, label: string) => {
    setRemovedIds((current) => [...current, id]);
    notify('Đã xóa khỏi bản nháp', `${label} sẽ được xóa khi backend xác nhận thao tác.`, 'warning');
  };

  return (
    <>
      <PageHeader
        eyebrow="Chỉnh sửa danh mục"
        title={category.label}
        description={`${visibleItems.length} lựa chọn đang hiển thị, chia thành ${pages.length} trang. Màn hình giao tiếp áp dụng thay đổi sau khi người dùng hoàn thành thao tác hiện tại.`}
        action={<ButtonLink to="/care/aac/item/new" leftIcon={<Plus size={18} />}>Thêm item</ButtonLink>}
      />
      <Link to="/care/aac" className="mb-5 inline-flex items-center gap-2 text-sm font-black text-ocu-indigo">
        <ArrowLeft size={17} /> Quay lại quản lý bảng
      </Link>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ocu-muted" size={18} />
        <Input className="pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm lựa chọn theo nhãn" />
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="overflow-hidden">
          <CardHeader eyebrow="Các lựa chọn" title="Danh sách lựa chọn" description="Các nút ẩn và xóa cập nhật ngay phần xem trước bên cạnh." />
          <div className="divide-y-2 divide-ocu-border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4 sm:p-5">
                <GripVertical className="shrink-0 text-ocu-muted" size={20} aria-hidden="true" />
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ocu-soft font-black text-ocu-indigo">{item.order}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-ocu-ink">{item.label}</p>
                  <p className="truncate text-sm font-semibold text-ocu-muted">{item.speechText}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(item.id, item.label)}
                    className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ocu-border"
                    aria-label={item.visible ? 'Ẩn lựa chọn' : 'Hiện lựa chọn'}
                  >
                    {item.visible ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                  <Link to={`/care/aac/item/${item.id}/edit`} className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ocu-border text-ocu-indigo" aria-label="Sửa lựa chọn">
                    <Pencil size={17} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id, item.label)}
                    className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ocu-red/25 text-ocu-red"
                    aria-label="Xóa lựa chọn"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="p-8 text-center font-bold text-ocu-muted">Không có item phù hợp.</p>}
          </div>
        </Card>
        <div className="grid content-start gap-5">
          {pages.map((page, index) => (
            <Card key={index} className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div><p className="eyebrow">Trang giao tiếp {index + 1}</p><h2 className="mt-1 text-lg font-black">{page.length}/4 lựa chọn</h2></div>
                <span className="rounded-full bg-ocu-indigo/10 px-3 py-2 text-xs font-black text-ocu-indigo">Ổn định vị trí</span>
              </div>
              <BoardPreview items={page} compact />
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
