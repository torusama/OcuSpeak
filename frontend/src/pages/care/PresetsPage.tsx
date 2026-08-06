import { Clock3, Copy, Eye, Moon, Plus, Sun, Sunset } from 'lucide-react';
import { BoardPreview } from '@/components/care/BoardPreview';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { aacItems } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/app/providers/ToastProvider';

const presets = [
  { id: 'morning', title: 'Buổi sáng', description: 'Uống nước, ăn sáng, vệ sinh và gọi mẹ.', icon: Sun, color: 'bg-ocu-yellow/65', items: ['water', 'hungry', 'toilet', 'mother'] },
  { id: 'afternoon', title: 'Buổi chiều', description: 'Đổi tư thế, nghe nhạc, ra ngoài và nghỉ.', icon: Sunset, color: 'bg-ocu-orange/25', items: ['change-position', 'music', 'outside', 'rest'] },
  { id: 'night', title: 'Buổi tối', description: 'Đi ngủ, nghe truyện, gọi ba và kiểm tra.', icon: Moon, color: 'bg-ocu-indigo/14', items: ['sleep', 'story', 'father', 'medicine'] }
];

export function PresetsPage() {
  useDocumentTitle('Bộ lựa chọn theo tình huống');
  const { notify } = useToast();
  return (
    <>
      <PageHeader eyebrow="Bộ lựa chọn theo tình huống" title="Bộ lựa chọn theo tình huống" description="Người chăm sóc có thể bật bộ lựa chọn phù hợp với từng thời điểm. Hệ thống không đổi bố cục khi người dùng đang nhìn chọn một biểu tượng." action={<Button onClick={() => notify('Bộ lựa chọn mới', 'Biểu mẫu sẽ lưu danh mục và lựa chọn qua backend.', 'info')} leftIcon={<Plus size={18} />}>Tạo bộ lựa chọn</Button>} />
      <section className="grid gap-6 xl:grid-cols-3">
        {presets.map((preset) => {
          const items = preset.items.map((id) => aacItems.find((item) => item.id === id)!).filter(Boolean);
          return <Card key={preset.id} className="overflow-hidden"><div className={`${preset.color} p-5`}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-ocu-indigo shadow-sm"><preset.icon size={24} /></span><h2 className="mt-4 text-xl font-black">{preset.title}</h2><p className="mt-2 text-sm font-semibold leading-relaxed text-ocu-muted">{preset.description}</p></div><div className="p-5"><BoardPreview items={items} compact /><div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => notify(`Đã bật bộ ${preset.title}`, 'Màn hình giao tiếp áp dụng sau khi người dùng hoàn thành thao tác hiện tại.')} leftIcon={<Eye size={16} />}>Bật bộ lựa chọn</Button><Button size="sm" variant="secondary" onClick={() => notify(`Đã nhân bản ${preset.title}`, 'Bản sao đã được tạo trong giao diện.', 'info')} leftIcon={<Copy size={16} />}>Nhân bản</Button></div></div></Card>;
        })}
      </section>
      <section className="mt-7 rounded-[24px] border-2 border-ocu-orange bg-ocu-orange/14 p-5"><div className="flex items-start gap-3"><Clock3 className="mt-0.5 shrink-0" /><div><h2 className="font-black">Lên lịch tự động sẽ được bổ sung sau</h2><p className="mt-1 text-sm font-semibold leading-relaxed text-ocu-muted">Giao diện hiện hỗ trợ tạo bộ lựa chọn và bật thủ công. Chức năng lên lịch sẽ được bổ sung sau khi luồng giao tiếp chính hoạt động ổn định.</p></div></div></section>
    </>
  );
}
