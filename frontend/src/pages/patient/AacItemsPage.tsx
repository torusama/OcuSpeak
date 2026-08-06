import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AacItemCard } from '@/components/patient/AacCard';
import { AacPageNavigator } from '@/components/patient/AacPageNavigator';
import { ComposerTray } from '@/components/patient/ComposerTray';
import { aacItems, categories } from '@/data/mockData';
import { useAppStore } from '@/stores/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function AacItemsPage() {
  const { categoryId = '' } = useParams();
  const category = categories.find((item) => item.id === categoryId);
  useDocumentTitle(category?.label ?? 'Lựa chọn AAC');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const selectedItems = useAppStore((state) => state.selectedItems);
  const addItem = useAppStore((state) => state.addSelectedItem);
  const removeLast = useAppStore((state) => state.removeLastSelectedItem);
  const clear = useAppStore((state) => state.clearSelectedItems);
  const page = useAppStore((state) => state.pageByCategory[categoryId] ?? 0);
  const setPage = useAppStore((state) => state.setCategoryPage);

  const items = useMemo(() => aacItems.filter((item) => item.categoryId === categoryId && item.visible).sort((a, b) => a.order - b.order), [categoryId]);
  const pages = Math.max(1, Math.ceil(items.length / 4));
  const currentItems = items.slice(page * 4, page * 4 + 4);

  if (!category) {
    return <div className="grid min-h-[calc(100vh-66px)] place-items-center p-6"><div className="text-center"><h1 className="text-3xl font-black">Không tìm thấy danh mục</h1><button className="mt-4 font-black text-ocu-indigo" onClick={() => navigate(childPath('aac'))}>Quay lại bảng chính</button></div></div>;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-66px)] max-w-[1500px] flex-col px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-4 pr-36 sm:pr-0"><p className="eyebrow">{category.label}</p><h1 className="mt-1 font-display text-4xl text-ocu-indigo sm:text-5xl">Chọn một điều</h1><p className="mt-2 font-semibold text-ocu-muted">Nhìn vào một biểu tượng khoảng 1,5 giây để chọn. Bốn vị trí luôn giữ nguyên khi chuyển trang.</p></div>
      <div className="grid flex-1 grid-cols-2 gap-4 sm:gap-6">
        {currentItems.map((item) => <AacItemCard key={item.id} item={item} onSelect={() => addItem(item)} />)}
      </div>
      <div className="mt-5 grid gap-4">
        <AacPageNavigator page={page} totalPages={pages} onBack={() => navigate(childPath('aac'))} onNext={() => setPage(categoryId, Math.min(page + 1, pages - 1))} onPrevious={() => setPage(categoryId, Math.max(page - 1, 0))} />
        <ComposerTray items={selectedItems} onRemoveLast={removeLast} onClear={clear} />
      </div>
    </div>
  );
}
