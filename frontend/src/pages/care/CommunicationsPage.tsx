import { Filter, MessageSquareText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CommunicationCard } from '@/components/care/CommunicationCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input, Select } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { communications } from '@/data/mockData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function CommunicationsPage() {
  useDocumentTitle('Yêu cầu giao tiếp');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const filtered = useMemo(() => communications.filter((event) => (status === 'ALL' || event.status === status) && event.sentence.toLowerCase().includes(query.toLowerCase())), [query, status]);
  return (
    <>
      <PageHeader eyebrow="Theo thời gian thực" title="Yêu cầu giao tiếp" description="Yêu cầu mới được đưa lên đầu và kiểm tra mã để tránh trùng. Bộ lọc không làm thay đổi trạng thái xử lý." />
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_240px]"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ocu-muted" size={19} /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-12" placeholder="Tìm trong câu giao tiếp" /></div><div className="relative"><Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-ocu-muted" size={18} /><Select value={status} onChange={(event) => setStatus(event.target.value)} className="pl-11"><option value="ALL">Tất cả trạng thái</option><option value="SENT">Chưa nhận</option><option value="PROCESSING">Đang xử lý</option><option value="COMPLETED">Hoàn thành</option></Select></div></div>
      {filtered.length ? <section className="grid gap-5 lg:grid-cols-2">{filtered.map((event) => <CommunicationCard key={event.id} event={event} />)}</section> : <EmptyState icon={MessageSquareText} title="Không có kết quả" description="Thử đổi bộ lọc hoặc từ khóa tìm kiếm." />}
    </>
  );
}
