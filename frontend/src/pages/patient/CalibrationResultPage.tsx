import { CheckCircle2, CircleAlert, Eye, RotateCcw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useChildPath } from '@/hooks/useChildPath';

export function CalibrationResultPage() {
  useDocumentTitle('Kết quả hiệu chỉnh ánh mắt');
  const navigate = useNavigate();
  const childPath = useChildPath();
  const [params] = useSearchParams();
  const ready = params.get('status') !== 'retry';
  const mode = params.get('mode') === '9' ? 9 : 5;

  return (
    <div className="grid min-h-[calc(100vh-66px)] place-items-center px-4 py-10">
      <Card className={`w-full max-w-3xl overflow-hidden ${ready ? 'border-ocu-green' : 'border-ocu-orange'}`}>
        <div className={`p-7 text-center sm:p-10 ${ready ? 'bg-ocu-green/18' : 'bg-ocu-orange/20'}`}>
          <span className={`mx-auto grid h-20 w-20 place-items-center rounded-[24px] ${ready ? 'bg-ocu-green text-ocu-ink' : 'bg-ocu-orange text-ocu-ink'}`}>{ready ? <CheckCircle2 size={40} /> : <CircleAlert size={40} />}</span>
          <h1 className="mt-5 font-display text-4xl text-ocu-indigo sm:text-5xl">{ready ? 'Hiệu chỉnh đạt yêu cầu' : 'Nên thực hiện lại'}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-relaxed text-ocu-text">{ready ? `Hiệu chỉnh ${mode} điểm đã đủ ổn định cho bảng bốn ô. Người chăm sóc có thể điều chỉnh lại sau trong phần cài đặt.` : 'Dữ liệu chưa đủ ổn định. Hãy kiểm tra ánh sáng, vị trí khuôn mặt hoặc dùng chuột/cảm ứng để tiếp tục.'}</p>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <Button size="patient" fullWidth onClick={() => navigate(childPath('aac'))} leftIcon={<Eye size={22} />}>Vào bảng giao tiếp</Button>
          <Button size="patient" fullWidth variant="secondary" onClick={() => navigate(`${childPath('calibration')}?mode=${mode}`)} leftIcon={<RotateCcw size={22} />}>Làm lại</Button>
          <Button size="patient" fullWidth variant="secondary" onClick={() => navigate(childPath('aac'))}>Dùng điều khiển tay</Button>
        </div>
      </Card>
    </div>
  );
}
