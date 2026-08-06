import { ArrowLeft, Eraser, Send, Sparkles, Trash2, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSymbol } from '@/components/common/IconSymbol';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { submitCommunicationEvent } from '@/services/api/apiClient';
import { useAppStore } from '@/stores/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function ComposePage() {
  useDocumentTitle('Tạo câu');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const selectedItems = useAppStore((state) => state.selectedItems);
  const patientChildId = useAppStore((state) => state.patientChildId);
  const removeLast = useAppStore((state) => state.removeLastSelectedItem);
  const clear = useAppStore((state) => state.clearSelectedItems);
  const setLastRequest = useAppStore((state) => state.setLastRequest);
  const quickSentence = useMemo(() => selectedItems.map((item) => item.quickSentence).join(' '), [selectedItems]);
  const [sentence, setSentence] = useState(quickSentence);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setSentence(quickSentence), [quickSentence]);

  // Ghép các câu nhanh của từng biểu tượng thành một câu tự nhiên hơn — xử lý cục bộ, không cần gọi máy chủ.
  const makeNatural = () => {
    if (!selectedItems.length) return;
    const labels = selectedItems.map((item) => item.label).join(', ');
    const lastSentence = selectedItems[selectedItems.length - 1]?.quickSentence ?? '';
    setSentence(selectedItems.length === 1 ? lastSentence : `${labels}. ${lastSentence}`);
  };

  const speak = () => {
    if (!sentence) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'vi-VN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const send = async () => {
    if (!sentence || !selectedItems.length) return;
    if (!patientChildId) {
      setError('Thiết bị chưa ghép nối với hồ sơ trẻ nào.');
      return;
    }
    setSending(true);
    setError('');
    try {
      const event = await submitCommunicationEvent(
        patientChildId,
        selectedItems.map((item) => item.id),
        sentence
      );
      setLastRequest(event.id, navigator.onLine ? 'SENT' : 'QUEUED_LOCAL');
      clear();
      navigate(childPath(`request/${event.id}`));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể gửi câu. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Ghép câu</p><h1 className="mt-1 font-display text-4xl text-ocu-indigo sm:text-5xl">Câu của con</h1></div><Button variant="secondary" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={18} />}>Quay lại</Button></div>

      <Card className="mt-6 p-5 sm:p-7">
        <div className="flex min-h-24 flex-wrap items-center gap-3 rounded-[22px] bg-ocu-soft p-4">
          {selectedItems.length ? selectedItems.map((item, index) => <span key={`${item.id}-${index}`} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-black shadow-sm"><IconSymbol name={item.icon} size={22} />{item.label}</span>) : <p className="font-bold text-ocu-muted">Chưa có lựa chọn. Quay lại bảng để chọn biểu tượng.</p>}
        </div>
        <div className="mt-5 rounded-[24px] border-2 border-ocu-indigo/20 bg-ocu-indigo/5 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-sm font-black text-ocu-indigo"><Sparkles size={18} /> Câu giao tiếp</div>
          <p className="mt-4 min-h-20 text-2xl font-black leading-relaxed text-ocu-ink sm:text-3xl">{sentence || 'Câu sẽ xuất hiện ở đây.'}</p>
          {error && <p className="mt-3 rounded-xl bg-[#fff0ee] p-3 text-sm font-bold text-[#b73b32]">{error}</p>}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Button size="patient" variant="secondary" onClick={speak} disabled={!sentence} leftIcon={<Volume2 size={22} />}>Phát</Button>
          <Button size="patient" variant="secondary" onClick={makeNatural} disabled={!selectedItems.length} leftIcon={<Sparkles size={22} />}>Làm tự nhiên</Button>
          <Button size="patient" variant="secondary" onClick={removeLast} disabled={!selectedItems.length} leftIcon={<Eraser size={22} />}>Xóa cuối</Button>
          <Button size="patient" variant="secondary" onClick={clear} disabled={!selectedItems.length} leftIcon={<Trash2 size={22} />}>Xóa hết</Button>
          <Button size="patient" loading={sending} onClick={() => void send()} disabled={!sentence || !selectedItems.length} leftIcon={<Send size={22} />}>Gửi câu</Button>
        </div>
      </Card>
    </div>
  );
}
