import { BrainCircuit, CameraOff, Check, Cloud, FileText, LockKeyhole, ShieldAlert, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function PrivacyPage() {
  useDocumentTitle('An toàn dữ liệu');
  const localOnly = ['Video hoặc camera frame', 'Ảnh chụp khuôn mặt', 'Eye crop và face crop', 'Face landmarks đầy đủ', 'Chuỗi RGB rPPG thô', 'Biometric template dài hạn'];
  const normalized = ['AAC item ID đã chọn', 'Câu đã xác nhận', 'Calibration status tổng quát', 'Tracking confidence và validation error', 'Camera quality state và reason code', 'Manual SOS và acknowledgement', 'Timestamp và pseudonymous patient ID'];

  return (
    <main className="page-shell py-12 lg:py-16">
      <PageHeader eyebrow="Privacy by architecture" title="Camera được xử lý tại thiết bị" description="Privacy boundary này là ràng buộc kỹ thuật của frontend, không chỉ là câu chữ marketing. Network request và logs production không được chứa dữ liệu camera thô." />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-ocu-green">
          <div className="bg-ocu-green/18 p-6"><CameraOff className="text-[#3F7048]" size={34} /><h2 className="mt-4 text-2xl font-black text-ocu-ink">Không rời thiết bị</h2><p className="mt-2 font-semibold text-ocu-text">Dùng trong RAM để gaze, quality gate và rPPG thử nghiệm.</p></div>
          <ul className="grid gap-3 p-6">
            {localOnly.map((item) => <li key={item} className="flex items-center gap-3 font-bold text-ocu-text"><span className="grid h-7 w-7 place-items-center rounded-full bg-ocu-green/20 text-[#3F7048]"><LockKeyhole size={15} /></span>{item}</li>)}
          </ul>
        </Card>

        <Card className="overflow-hidden border-ocu-blue">
          <div className="bg-ocu-blue/18 p-6"><Cloud className="text-ocu-indigo" size={34} /><h2 className="mt-4 text-2xl font-black text-ocu-ink">Có thể gửi dạng chuẩn hóa</h2><p className="mt-2 font-semibold text-ocu-text">Chỉ gửi phần cần thiết để đồng bộ giao tiếp và trạng thái.</p></div>
          <ul className="grid gap-3 p-6">
            {normalized.map((item) => <li key={item} className="flex items-center gap-3 font-bold text-ocu-text"><span className="grid h-7 w-7 place-items-center rounded-full bg-ocu-blue/20 text-ocu-indigo"><Check size={15} /></span>{item}</li>)}
          </ul>
        </Card>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          { icon: BrainCircuit, title: 'Gemini', text: 'Chỉ nhận item IDs/labels và context không nhạy cảm. Không nhận camera hoặc quyết định SOS.' },
          { icon: Volume2, title: 'Text-to-Speech', text: 'Chỉ nhận câu text đã xác nhận hoặc lời trấn an caregiver.' },
          { icon: FileText, title: 'Logging', text: 'Log module, request ID, latency, error code và reason code đã tổng hợp; không log token hoặc camera data.' }
        ].map((item) => <Card key={item.title} className="p-5"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocu-purple/18 text-[#654D99]"><item.icon size={24} /></span><h3 className="mt-4 text-lg font-black text-ocu-ink">{item.title}</h3><p className="mt-2 text-sm font-semibold leading-relaxed text-ocu-muted">{item.text}</p></Card>)}
      </section>

      <section className="mt-8 rounded-[26px] border-2 border-ocu-red bg-ocu-red/6 p-6">
        <div className="flex items-start gap-4"><ShieldAlert className="mt-1 shrink-0 text-ocu-red" size={28} /><div><h2 className="text-xl font-black text-ocu-ink">Không phải thiết bị y tế</h2><p className="mt-2 max-w-4xl font-semibold leading-relaxed text-ocu-text">rPPG và facial state chỉ là tín hiệu hỗ trợ thử nghiệm. UI không được ghi rằng người dùng đang bị co giật, khó thở, đột quỵ hoặc một chẩn đoán cụ thể. Confidence thấp hiển thị “Không đủ dữ liệu”.</p></div></div>
      </section>
    </main>
  );
}
