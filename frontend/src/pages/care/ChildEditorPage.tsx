import { ArrowLeft, Check, Eye, Grid2X2, Save, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrbisGuideCard } from '@/components/brand/OrbisGuideCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input, Select } from '@/components/ui/Form';
import { Toggle } from '@/components/ui/Toggle';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAppStore, type ChildProfileSummary } from '@/stores/useAppStore';

export function ChildEditorPage() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const childProfiles = useAppStore((state) => state.childProfiles);
  const addChildProfile = useAppStore((state) => state.addChildProfile);
  const updateChildProfile = useAppStore((state) => state.updateChildProfile);
  const existing = useMemo(() => childProfiles.find((child) => child.id === childId), [childId, childProfiles]);
  const editing = Boolean(existing);

  useDocumentTitle(editing ? `Hồ sơ ${existing?.displayName ?? ''}` : 'Tạo hồ sơ trẻ');

  const [displayName, setDisplayName] = useState(existing?.displayName ?? '');
  const [age, setAge] = useState(existing?.age ?? 10);
  const [gridSize, setGridSize] = useState<4 | 6 | 9>(existing?.gridSize ?? 4);
  const [dwellTime, setDwellTime] = useState<1 | 1.5 | 2 | 3>(existing?.dwellTime ?? 1.5);
  const [calibrationMode, setCalibrationMode] = useState<5 | 9>(existing?.calibrationMode ?? 5);
  const [ttsEnabled, setTtsEnabled] = useState(existing?.ttsEnabled ?? true);
  const [realImageMode, setRealImageMode] = useState(existing?.realImageMode ?? false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    const cleanName = displayName.trim() || 'Hồ sơ mới';
    const initials = cleanName
      .split(/\s+/)
      .slice(-2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'TR';

    const profile: ChildProfileSummary = {
      id: existing?.id ?? `child-${Date.now()}`,
      displayName: cleanName,
      age,
      avatarInitials: initials,
      gridSize,
      dwellTime,
      calibrationMode,
      ttsEnabled,
      realImageMode
    };

    if (existing) updateChildProfile(existing.id, profile);
    else addChildProfile(profile);

    setSaved(true);
    window.setTimeout(() => navigate('/care/children'), 500);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <button onClick={() => navigate('/care/children')} className="mb-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 font-black text-[#4c57a9] hover:bg-[#eef3ff]"><ArrowLeft size={18} />Quay lại hồ sơ trẻ</button>

      <div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="border-[#dbe5f3] p-6 shadow-[0_14px_34px_rgba(87,110,170,.08)] sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-[20px] bg-[#eef3ff] text-[#4c57a9]"><UserRound size={28} /></span>
            <div>
              <p className="eyebrow">{editing ? 'Chỉnh hồ sơ trẻ' : 'Tạo hồ sơ trẻ'}</p>
              <h1 className="display-rounded mt-1 text-4xl font-extrabold text-[#28305f]">{editing ? existing?.displayName : 'Thông tin người sử dụng'}</h1>
            </div>
          </div>

          <div className="mt-7 grid gap-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tên hiển thị" hint="Tên này xuất hiện trên trang quản lý và giao diện giao tiếp.">
                <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Ví dụ: Bé An" />
              </Field>
              <Field label="Tuổi">
                <Input type="number" min={3} max={30} value={age} onChange={(event) => setAge(Number(event.target.value))} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Bố cục bảng">
                <Select value={gridSize} onChange={(event) => setGridSize(Number(event.target.value) as 4 | 6 | 9)}>
                  <option value={4}>4 ô — khuyến nghị</option>
                  <option value={6}>6 ô</option>
                  <option value={9}>9 ô</option>
                </Select>
              </Field>
              <Field label="Thời gian nhìn giữ">
                <Select value={dwellTime} onChange={(event) => setDwellTime(Number(event.target.value) as 1 | 1.5 | 2 | 3)}>
                  <option value={1}>1 giây</option>
                  <option value={1.5}>1,5 giây</option>
                  <option value={2}>2 giây</option>
                  <option value={3}>3 giây</option>
                </Select>
              </Field>
              <Field label="Hiệu chỉnh ánh mắt">
                <Select value={calibrationMode} onChange={(event) => setCalibrationMode(Number(event.target.value) as 5 | 9)}>
                  <option value={5}>5 điểm</option>
                  <option value={9}>9 điểm</option>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Toggle checked={ttsEnabled} onChange={setTtsEnabled} label="Phát câu bằng giọng nói" description="Câu được phát sau khi người dùng xác nhận." />
              <Toggle checked={realImageMode} onChange={setRealImageMode} label="Ưu tiên ảnh thật" description="Dùng ảnh vật dụng và người thân quen thuộc khi có." />
            </div>

            {saved && <div className="flex items-center gap-3 rounded-2xl bg-[#e7f5ee] p-4 font-black text-[#4f7b64]"><Check size={20} />Đã lưu hồ sơ trẻ.</div>}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => navigate('/care/children')}>Hủy</Button>
              <Button onClick={save} leftIcon={<Save size={18} />}>{editing ? 'Lưu thay đổi' : 'Tạo hồ sơ trẻ'}</Button>
            </div>
          </div>
        </Card>

        <div className="grid content-start gap-6">
          <OrbisGuideCard
            mood="guide"
            title="Thiết lập phù hợp với khả năng của trẻ"
            message="Nên bắt đầu bằng bảng 4 ô và thời gian nhìn giữ 1,5–2 giây. Sau khi thử thực tế, người chăm sóc có thể chỉnh lại bất cứ lúc nào."
          />
          <Card className="border-[#dbe5f3] p-6">
            <p className="eyebrow">Sau khi lưu</p>
            <div className="mt-4 grid gap-3">
              <div className="flex items-start gap-3 rounded-2xl bg-[#f6f8ff] p-4"><Eye className="mt-0.5 shrink-0 text-[#4c57a9]" size={20} /><div><p className="font-black text-[#28305f]">Mở giao diện giao tiếp</p><p className="mt-1 text-sm font-semibold text-[#7581a4]">Chuyển trực tiếp sang màn hình dành cho trẻ trong cùng website.</p></div></div>
              <div className="flex items-start gap-3 rounded-2xl bg-[#f6f8ff] p-4"><Grid2X2 className="mt-0.5 shrink-0 text-[#4c57a9]" size={20} /><div><p className="font-black text-[#28305f]">Tùy chỉnh bảng AAC</p><p className="mt-1 text-sm font-semibold text-[#7581a4]">Thêm, ẩn và sắp xếp biểu tượng phù hợp với hồ sơ này.</p></div></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
