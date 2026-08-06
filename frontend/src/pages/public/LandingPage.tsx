import {
  ArrowRight,
  BellRing,
  Camera,
  Check,
  Eye,
  Grid2X2,
  HeartHandshake,
  KeyRound,
  Link2,
  MessageSquareText,
  MonitorCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TriangleAlert,
  UserRound,
  Volume2,
  Wifi
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrbisGuideCard } from '@/components/brand/OrbisGuideCard';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const webFunctions = [
  {
    icon: UserRound,
    title: 'Tạo hồ sơ trẻ',
    text: 'Người chăm sóc tạo hồ sơ riêng cho trẻ, chọn bố cục bảng, thời gian nhìn giữ và giọng đọc.',
    to: '/care/children/new',
    label: 'Tạo hồ sơ trẻ'
  },
  {
    icon: Eye,
    title: 'Mở giao diện cho trẻ',
    text: 'Từ hồ sơ đã tạo, mở trực tiếp màn hình giao tiếp dành cho trẻ trong cùng website.',
    to: '/care/children',
    label: 'Chọn hồ sơ trẻ'
  },
  {
    icon: Grid2X2,
    title: 'Tùy chỉnh bảng AAC',
    text: 'Thêm biểu tượng, ảnh quen thuộc, nhóm nhu cầu và sắp xếp nội dung phù hợp với từng trẻ.',
    to: '/care/aac',
    label: 'Quản lý bảng AAC'
  },
  {
    icon: MessageSquareText,
    title: 'Theo dõi yêu cầu',
    text: 'Người chăm sóc nhận câu trẻ vừa gửi, xác nhận đã nhận và cập nhật trạng thái xử lý.',
    to: '/care/communications',
    label: 'Mở danh sách yêu cầu'
  },
  {
    icon: TriangleAlert,
    title: 'Cảnh báo và SOS',
    text: 'Theo dõi trạng thái cần kiểm tra và xử lý cảnh báo SOS từ giao diện giao tiếp của trẻ.',
    to: '/care/alerts',
    label: 'Mở cảnh báo'
  },
  {
    icon: HeartHandshake,
    title: 'Gửi lời trấn an',
    text: 'Gửi câu ngắn để hiển thị và phát giọng nói trên màn hình giao tiếp của trẻ.',
    to: '/care/reassurance',
    label: 'Mở lời trấn an'
  }
];

const steps = [
  {
    icon: KeyRound,
    title: 'Người chăm sóc đăng nhập',
    text: 'Đăng nhập bằng Google hoặc email để mở không gian quản lý gia đình.'
  },
  {
    icon: UserRound,
    title: 'Tạo hồ sơ cho trẻ',
    text: 'Nhập tên, tuổi, bố cục bảng, thời gian nhìn giữ và các tùy chọn giao tiếp.'
  },
  {
    icon: Eye,
    title: 'Mở giao diện giao tiếp',
    text: 'Chọn hồ sơ và chuyển trực tiếp sang màn hình dành cho trẻ trong cùng website.'
  },
  {
    icon: HeartHandshake,
    title: 'Nhận và phản hồi',
    text: 'Người chăm sóc nhận yêu cầu, xác nhận đã tiếp nhận và gửi lời trấn an.'
  }
];

const companionFeatures = [
  { icon: MessageSquareText, title: 'Nhận yêu cầu giao tiếp', text: 'Điện thoại hiển thị câu người dùng vừa gửi và trạng thái đang chờ xử lý.' },
  { icon: Grid2X2, title: 'Tùy chỉnh bảng biểu tượng', text: 'Thêm ảnh quen thuộc, đổi nhãn và sắp xếp các nhóm lựa chọn từ xa.' },
  { icon: HeartHandshake, title: 'Gửi lời trấn an', text: 'Gửi câu mẫu hoặc nội dung ngắn để hiển thị và phát giọng nói trên thiết bị giao tiếp.' },
  { icon: BellRing, title: 'Nhận cảnh báo', text: 'Phân biệt yêu cầu thông thường, trạng thái cần kiểm tra và SOS khẩn cấp.' }
];

const devices = [
  { icon: MonitorCheck, title: 'Laptop hoặc tablet', text: 'Thiết bị nên được đặt cố định ngang tầm mắt và hạn chế rung.' },
  { icon: Camera, title: 'Camera trước', text: 'Camera dùng để nhận diện khuôn mặt và ánh mắt ngay trên thiết bị.' },
  { icon: Wifi, title: 'Kết nối mạng', text: 'Mạng giúp đồng bộ yêu cầu, lời trấn an và thông báo với người chăm sóc.' },
  { icon: Smartphone, title: 'Điện thoại người chăm sóc', text: 'Đăng nhập cùng website bằng điện thoại để quản lý hồ sơ, nhận yêu cầu và cảnh báo.' }
];

function FunctionTile({ item }: { item: (typeof webFunctions)[number] }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className="group flex h-full min-h-[280px] flex-col rounded-[26px] border border-[#dbe5f3] bg-white/92 p-6 shadow-[0_12px_30px_rgba(87,110,170,.07)] transition duration-300 hover:-translate-y-1 hover:border-[#bfcdeb] hover:shadow-[0_18px_42px_rgba(87,110,170,.12)]"
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#edf3ff] text-[#4c57a9]"><Icon size={25} /></span>
      <h3 className="mt-5 text-xl font-black text-[#28305f]">{item.title}</h3>
      <p className="mt-3 flex-1 text-sm font-semibold leading-relaxed text-[#74809f]">{item.text}</p>
      <span className="mt-6 inline-flex items-center justify-between gap-3 border-t border-[#e3e9f3] pt-4 text-sm font-black text-[#4c57a9]">
        {item.label}
        <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
      </span>
    </Link>
  );
}

export function LandingPage() {
  useDocumentTitle('OcuSpeak - Giao tiếp bằng ánh mắt');

  return (
    <main className="bg-[linear-gradient(180deg,#f8fbff_0%,#f5f8ff_45%,#f4f8ff_100%)]">
      <section id="home" className="relative overflow-hidden scroll-mt-24">
        <div className="absolute left-[-120px] top-[-130px] h-[360px] w-[360px] rounded-full bg-[#dfeeff] blur-3xl" />
        <div className="absolute bottom-[-170px] right-[-110px] h-[380px] w-[380px] rounded-full bg-[#e8efff] blur-3xl" />
        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-20">
          <div>
            <Reveal direction="scale">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d4dcf5] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#4c57a9] shadow-sm">
                <Sparkles size={16} /> AI Riser Vietnam 2026
              </span>
            </Reveal>
            <Reveal direction="left" delay={80}>
              <h1 className="display-rounded mt-6 max-w-3xl text-[54px] font-extrabold leading-[0.96] text-[#4c57a9] sm:text-[70px] lg:text-[84px]">
                Một ánh nhìn.
                <br />
                Một lời được nói.
              </h1>
            </Reveal>
            <Reveal direction="left" delay={150}>
              <p className="mt-6 max-w-2xl text-lg font-bold leading-relaxed text-[#56607f] sm:text-xl">
                OcuSpeak giúp trẻ gặp hạn chế nghiêm trọng về vận động và lời nói lựa chọn biểu tượng bằng ánh mắt, ghép thành câu và kết nối trực tiếp với người chăm sóc trong gia đình.
              </p>
            </Reveal>
            <Reveal direction="left" delay={220}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <ButtonLink to="/login" size="lg" rightIcon={<ArrowRight size={20} />}>Đăng nhập người chăm sóc</ButtonLink>
                <ButtonLink to="/#patient" variant="secondary" size="lg">Xem các chức năng</ButtonLink>
              </div>
            </Reveal>
            <Reveal direction="up" delay={260}>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  'Không cần eye-tracker chuyên dụng',
                  'Chuột và cảm ứng là phương án hỗ trợ',
                  'Không tải video camera lên máy chủ'
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm font-bold text-[#7581a4]">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#dff2ea] text-[#5f8d79]"><Check size={13} /></span>
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal direction="left" delay={300}>
              <OrbisGuideCard mood="happy" title="Chào bạn, mình là Orbis" message="Mình sẽ hướng dẫn ở những bước cần thiết. Bảng giao tiếp luôn được giữ rộng, rõ và không bị che khuất." className="mt-8 max-w-[590px]" />
            </Reveal>
          </div>

          <Reveal direction="right" delay={120}>
            <div className="mx-auto w-full max-w-[590px]">
              <div className="rounded-[36px] border border-[#dbe5f3] bg-white/94 p-5 shadow-[0_28px_70px_rgba(87,110,170,.12)] backdrop-blur sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">Bảng giao tiếp</p>
                    <h2 className="display-rounded mt-1 text-2xl font-extrabold text-[#28305f]">Con muốn nói gì?</h2>
                  </div>
                  <span className="rounded-full bg-[#e1f2eb] px-3 py-2 text-xs font-black text-[#5f8d79]">Camera sẵn sàng</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Nhu cầu', icon: Grid2X2, bg: 'bg-[#e5efff]', active: true },
                    { label: 'Cảm xúc', icon: HeartHandshake, bg: 'bg-[#edf1fb]' },
                    { label: 'Người thân', icon: MessageSquareText, bg: 'bg-[#e8f1ff]' },
                    { label: 'Hoạt động', icon: Sparkles, bg: 'bg-[#e8f5f3]' }
                  ].map((item) => (
                    <div key={item.label} className={`relative flex aspect-square flex-col items-center justify-center gap-4 rounded-[26px] border-2 ${item.active ? 'border-[#4c57a9]' : 'border-transparent'} bg-[#fcfdff] shadow-sm`}>
                      <span className={`grid h-20 w-20 place-items-center rounded-[24px] ${item.bg} text-[#28305f]`}><item.icon size={36} /></span>
                      <span className="text-lg font-black text-[#28305f]">{item.label}</span>
                      {item.active && <span className="absolute inset-x-5 bottom-4 h-2 rounded-full bg-[#e7ecf6]"><span className="block h-full w-[68%] rounded-full bg-[#4c57a9]" /></span>}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[#dbe5f3] bg-[#f8fbff] p-3">
                  <p className="font-bold text-[#6f7b9d]">Nhìn vào biểu tượng khoảng 1,5 giây để chọn</p>
                  <span className="rounded-xl bg-[#cc1400] px-4 py-3 font-black text-white shadow-[0_4px_0_#8c190d]">SOS</span>
                </div>
              </div>
              <OrbisGuideCard
                mood="guide"
                title="Hướng dẫn bằng ánh mắt"
                message="Thanh tiến trình đầy dần khi ánh mắt ổn định. Hệ thống tự chọn biểu tượng, không cần dùng tay."
                className="mt-5"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="patient" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">Chức năng trên web</p>
            <h2 className="display-rounded mt-3 text-4xl font-extrabold text-[#4c57a9] sm:text-5xl">Một luồng rõ ràng từ đăng nhập đến giao tiếp</h2>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-[#7581a4]">Mỗi thẻ là một chức năng thật và mở trực tiếp đúng màn hình cần dùng.</p>
          </Reveal>
          <div className="mt-12 grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
            {webFunctions.map((item, index) => (
              <Reveal key={item.title} direction="up" delay={(index % 3) * 90} className="h-full">
                <FunctionTile item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <Reveal direction="left">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">OcuSpeak dành cho ai</p>
            <h2 className="display-rounded mt-3 text-4xl font-extrabold text-[#4c57a9] sm:text-5xl">Giao tiếp khi đôi mắt là cách điều khiển chủ động nhất</h2>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-[#687493]">Sản phẩm tập trung vào trẻ từ 6–16 tuổi gặp hạn chế vận động nặng và khó giao tiếp bằng lời nói, nhưng vẫn có thể nhận biết biểu tượng và chủ động điều khiển ánh mắt.</p>
            <div className="mt-7 grid gap-3">
              {[
                'Biểu tượng lớn và ít lựa chọn trên một màn hình',
                'Có phản hồi bằng hình ảnh, âm thanh và giọng nói',
                'Người chăm sóc thiết lập và tùy chỉnh bằng giao diện web trên điện thoại',
                'Không thay thế thiết bị y tế hoặc đánh giá chuyên môn'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#dbe5f3] bg-white/80 p-4 text-sm font-bold text-[#596584]"><Check className="mt-0.5 shrink-0 text-[#5f8d79]" size={18} />{item}</div>
              ))}
            </div>
          </Reveal>
          <Reveal direction="right" delay={100}>
            <div>
              <OrbisGuideCard mood="calm" title="Không cần dùng tay để chọn biểu tượng" message="Khi camera nhận diện ánh mắt đủ ổn định, người dùng chỉ cần nhìn vào biểu tượng muốn chọn. Chuột và cảm ứng chỉ là phương án hỗ trợ." />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#eef3ff] p-5"><Eye className="text-[#4c57a9]" /><h3 className="mt-4 font-black text-[#28305f]">Điều khiển bằng ánh mắt</h3><p className="mt-2 text-sm font-semibold leading-relaxed text-[#74809f]">Dữ liệu được làm mịn để giảm chọn nhầm do chuyển động mắt tự nhiên.</p></div>
                <div className="rounded-2xl bg-[#edf7f5] p-5"><HeartHandshake className="text-[#5f8d79]" /><h3 className="mt-4 font-black text-[#28305f]">Kết nối gia đình</h3><p className="mt-2 text-sm font-semibold leading-relaxed text-[#74809f]">Người chăm sóc nhận yêu cầu và gửi phản hồi gần thời gian thực.</p></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">Cách hoạt động</p>
            <h2 className="display-rounded mt-3 text-4xl font-extrabold text-[#4c57a9] sm:text-5xl">Từ hồ sơ đến phản hồi của người chăm sóc</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80} className="h-full">
                <Card className="relative h-full overflow-hidden border-[#dbe5f3] bg-white/92 p-6 shadow-[0_12px_30px_rgba(87,110,170,.07)]">
                  <span className="absolute right-5 top-4 display-rounded text-6xl font-extrabold text-[#dfe5f6]">0{index + 1}</span>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eef3ff] text-[#4c57a9]"><step.icon size={28} /></span>
                  <h3 className="mt-6 text-xl font-black text-[#28305f]">{step.title}</h3>
                  <p className="mt-3 font-semibold leading-relaxed text-[#74809f]">{step.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="caregiver" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">Không gian người chăm sóc</p>
            <h2 className="display-rounded mt-3 text-4xl font-extrabold text-[#4c57a9] sm:text-5xl">Quản lý và phản hồi ngay trên điện thoại</h2>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-[#7581a4]">OcuSpeak Care nằm trong cùng hệ thống web và được thiết kế mobile-first. Người chăm sóc đăng nhập, tạo hồ sơ trẻ, tùy chỉnh bảng AAC và mở giao diện dành cho trẻ mà không cần kết nối một ứng dụng riêng.</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {companionFeatures.map((item, index) => (
              <Reveal key={item.title} delay={index * 80} className="h-full">
                <Card className="h-full border-[#dbe5f3] bg-white/92 p-6 shadow-[0_10px_28px_rgba(87,110,170,.06)]">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef3ff] text-[#4c57a9]"><item.icon size={24} /></span>
                  <h3 className="mt-5 text-lg font-black text-[#28305f]">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#74809f]">{item.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <ButtonLink to="/login" size="lg" leftIcon={<Smartphone size={19} />}>Đăng nhập người chăm sóc</ButtonLink>
          </Reveal>
        </div>
      </section>

      <section id="privacy" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="scale">
            <div className="rounded-[34px] border border-[#dbe5f5] bg-[linear-gradient(180deg,#eef4ff_0%,#e8f1ff_100%)] p-7 text-[#28305f] shadow-[0_18px_40px_rgba(87,110,170,.08)] sm:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5f6ab5]">An toàn dữ liệu</p>
                  <h2 className="display-rounded mt-3 text-4xl font-extrabold text-[#4c57a9] sm:text-5xl">Hình ảnh camera được xử lý ngay trên thiết bị</h2>
                  <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-[#5f6a8f]">Máy chủ chỉ nhận các sự kiện đã chuẩn hóa như biểu tượng được chọn, câu đã xác nhận, trạng thái chất lượng và cảnh báo.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    'Không tải video camera lên máy chủ',
                    'Không lưu ảnh cắt khuôn mặt hoặc mắt',
                    'Không gửi toàn bộ điểm nhận diện khuôn mặt',
                    'Chỉ đồng bộ thông tin cần thiết cho giao tiếp'
                  ].map((item) => <div key={item} className="rounded-2xl border border-[#dbe5f5] bg-white/80 p-4 text-sm font-black"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[#5f8d79]" size={19} />{item}</div></div>)}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="devices" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6ab5]">Thiết bị cần chuẩn bị</p>
            <h2 className="display-rounded mt-3 text-4xl font-extrabold text-[#4c57a9] sm:text-5xl">Không cần mua thiết bị theo dõi mắt riêng</h2>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-[#7581a4]">Một thiết bị có camera trước và trình duyệt hiện đại là đủ để bắt đầu.</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {devices.map((item, index) => (
              <Reveal key={item.title} delay={index * 80} className="h-full">
                <Card className="h-full border-[#dbe5f3] bg-white/94 p-6 shadow-[0_10px_28px_rgba(87,110,170,.06)]">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef3ff] text-[#4c57a9]"><item.icon size={24} /></span>
                  <h3 className="mt-5 text-lg font-black text-[#28305f]">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#74809f]">{item.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="scale">
            <div className="rounded-[34px] border border-[#dbe5f3] bg-white/92 p-8 text-center shadow-[0_16px_34px_rgba(87,110,170,.08)] sm:p-10">
              <h2 className="display-rounded text-3xl font-extrabold text-[#4c57a9] sm:text-4xl">Sẵn sàng bắt đầu giao tiếp?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-relaxed text-[#7581a4]">Người chăm sóc đăng nhập, tạo hồ sơ trẻ rồi mở trực tiếp giao diện giao tiếp. Khi cần, hệ thống hướng dẫn hiệu chỉnh ánh mắt trước khi vào bảng biểu tượng.</p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <ButtonLink to="/login" size="lg">Đăng nhập và tạo hồ sơ trẻ</ButtonLink>
                <ButtonLink to="/#patient" variant="secondary" size="lg">Xem chức năng</ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
