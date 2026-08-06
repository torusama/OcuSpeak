import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ocu-canvas text-ocu-text">
      <UnifiedHeader />

      <div key={location.pathname} className="route-enter">
        <Outlet />
      </div>

      <footer className="border-t border-[#dfe6f2] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm font-semibold leading-relaxed text-[#7581a4]">
              OcuSpeak hỗ trợ trẻ hạn chế vận động và lời nói giao tiếp bằng ánh mắt, đồng thời kết nối với không gian web dành cho người chăm sóc trong gia đình.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#28305f]">Bắt đầu sử dụng</h3>
            <div className="mt-4 grid gap-2 text-sm font-bold text-[#7581a4]">
              <NavLink to="/login">Đăng nhập người chăm sóc</NavLink>
              <NavLink to="/care/children/new">Tạo hồ sơ trẻ</NavLink>
              <NavLink to="/care/children">Mở giao diện cho trẻ</NavLink>
              <NavLink to="/care/aac">Quản lý bảng AAC</NavLink>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#28305f]">Thông tin</h3>
            <div className="mt-4 grid gap-2 text-sm font-bold text-[#7581a4]">
              <a href="/#about">OcuSpeak dành cho ai</a>
              <a href="/#how-it-works">Cách hoạt động</a>
              <a href="/#privacy">An toàn dữ liệu</a>
              <a href="/#devices">Thiết bị hỗ trợ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
