import { useNavigate } from 'react-router-dom';
import { AacCategoryCard } from '@/components/patient/AacCard';
import { ComposerTray } from '@/components/patient/ComposerTray';
import { categories } from '@/data/mockData';
import { useAppStore } from '@/stores/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function AacCategoriesPage() {
  useDocumentTitle('Bảng giao tiếp');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const selectedItems = useAppStore((state) => state.selectedItems);
  const removeLast = useAppStore((state) => state.removeLastSelectedItem);
  const clear = useAppStore((state) => state.clearSelectedItems);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-66px)] max-w-[1500px] flex-col px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 pr-36 sm:pr-0"><p className="eyebrow">Bảng giao tiếp</p><h1 className="mt-1 font-display text-4xl text-ocu-indigo sm:text-5xl">Con muốn nói gì?</h1><p className="mt-2 text-base font-semibold text-ocu-muted">Nhìn vào một nhóm khoảng 1,5 giây để mở các lựa chọn.</p></div>
      <div className="grid flex-1 grid-cols-2 gap-4 sm:gap-6">
        {categories.filter((category) => category.visible).map((category) => <AacCategoryCard key={category.id} category={category} onSelect={() => navigate(childPath(`aac/${category.id}`))} />)}
      </div>
      <div className="mt-5"><ComposerTray items={selectedItems} onRemoveLast={removeLast} onClear={clear} /></div>
    </div>
  );
}
