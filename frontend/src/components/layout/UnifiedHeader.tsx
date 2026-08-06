import {
  BellRing,
  HeartHandshake,
  Home,
  LogIn,
  Menu,
  MessageSquareText,
  ShieldAlert,
  UserRound,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/utils/cn';

type HeaderMode = 'public' | 'caregiver' | 'child';

const caregiverLinks = [
  { label: 'Tổng quan', to: '/care/dashboard' },
  { label: 'Hồ sơ trẻ', to: '/care/children' },
  { label: 'Bảng AAC', to: '/care/aac' },
  { label: 'Yêu cầu', to: '/care/communications' },
  { label: 'Cảnh báo', to: '/care/alerts' },
  { label: 'Lịch sử', to: '/care/history' }
];

export function UnifiedHeader({ mode = 'public' }: { mode?: HeaderMode }) {
  const [open, setOpen] = useState(false);
  const caregiverLoggedIn = useAppStore((state) => state.caregiverLoggedIn);
  const caregiverName = useAppStore((state) => state.caregiverName);
  const childProfiles = useAppStore((state) => state.childProfiles);
  const activeChildId = useAppStore((state) => state.activeChildId);
  const activeChild = childProfiles.find((child) => child.id === activeChildId) ?? childProfiles[0];
  const childBase = activeChild ? `/child/${activeChild.id}` : '/care/children';

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe6f2] bg-white/95 backdrop-blur-xl">
      <div className="grid min-h-20 grid-cols-[auto_1fr] items-center gap-4 px-4 sm:px-6 xl:grid-cols-[1fr_auto_1fr] lg:px-8 xl:px-10">
        <div className="justify-self-start">
          <Logo to={mode === 'caregiver' ? '/care/dashboard' : mode === 'child' ? `${childBase}/aac` : '/'} />
        </div>

        {mode === 'public' && (
          <nav className="hidden items-center justify-center gap-1 xl:flex" aria-label="Điều hướng giới thiệu">
            <a href="/#about" className="rounded-2xl px-4 py-2 text-sm font-black text-[#737e9d] hover:bg-[#eef3ff] hover:text-[#4c57a9]">OcuSpeak là gì</a>
            <a href="/#patient" className="rounded-2xl px-4 py-2 text-sm font-black text-[#737e9d] hover:bg-[#eef3ff] hover:text-[#4c57a9]">Dành cho trẻ</a>
            <a href="/#caregiver" className="rounded-2xl px-4 py-2 text-sm font-black text-[#737e9d] hover:bg-[#eef3ff] hover:text-[#4c57a9]">Người chăm sóc</a>
            <a href="/#privacy" className="rounded-2xl px-4 py-2 text-sm font-black text-[#737e9d] hover:bg-[#eef3ff] hover:text-[#4c57a9]">An toàn dữ liệu</a>
          </nav>
        )}

        {mode === 'caregiver' && (
          <nav className="hidden items-center justify-center gap-1 xl:flex" aria-label="Điều hướng người chăm sóc">
            {caregiverLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl px-3 py-2 text-sm font-black text-[#737e9d] transition-colors hover:bg-[#eef3ff] hover:text-[#4c57a9]',
                    isActive && 'bg-[#eaf0ff] text-[#4c57a9]'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        {mode === 'child' && activeChild && (
          <nav className="hidden items-center justify-center gap-1 xl:flex" aria-label="Điều hướng giao tiếp">
            <NavLink to={`${childBase}/aac`} className={({ isActive }) => cn('rounded-2xl px-4 py-2 text-sm font-black text-[#737e9d] hover:bg-[#eef3ff]', isActive && 'bg-[#eaf0ff] text-[#4c57a9]')}>Bảng giao tiếp</NavLink>
            <NavLink to={`${childBase}/compose`} className={({ isActive }) => cn('rounded-2xl px-4 py-2 text-sm font-black text-[#737e9d] hover:bg-[#eef3ff]', isActive && 'bg-[#eaf0ff] text-[#4c57a9]')}>Ghép câu</NavLink>
            <NavLink to={`${childBase}/reassurance`} className={({ isActive }) => cn('rounded-2xl px-4 py-2 text-sm font-black text-[#737e9d] hover:bg-[#eef3ff]', isActive && 'bg-[#eaf0ff] text-[#4c57a9]')}>Lời trấn an</NavLink>
            <NavLink to={`${childBase}/sos`} className={({ isActive }) => cn('rounded-2xl px-4 py-2 text-sm font-black text-[#a53a32] hover:bg-[#fff0ee]', isActive && 'bg-[#fff0ee] text-[#a53a32]')}>SOS</NavLink>
          </nav>
        )}

        <div className="hidden items-center justify-self-end gap-3 xl:flex">
          {mode === 'public' && !caregiverLoggedIn && (
            <ButtonLink to="/login" size="sm" leftIcon={<LogIn size={17} />}>Đăng nhập người chăm sóc</ButtonLink>
          )}

          {mode === 'public' && caregiverLoggedIn && (
            <>
              <ButtonLink to="/care/dashboard" variant="secondary" size="sm">Mở trang quản lý</ButtonLink>
              <Link to="/care/profile" className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#dbe3f1] bg-white px-3 font-black text-[#4c57a9] shadow-sm">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#eaf0ff]"><UserRound size={18} /></span>
                <span className="max-w-32 truncate text-sm">{caregiverName}</span>
              </Link>
            </>
          )}

          {mode === 'caregiver' && (
            <>
              {activeChild ? (
                <ButtonLink to={`${childBase}/aac`} size="sm" leftIcon={<MessageSquareText size={17} />}>Mở giao diện cho {activeChild.displayName}</ButtonLink>
              ) : (
                <ButtonLink to="/care/children/new" size="sm" leftIcon={<UserRound size={17} />}>Tạo hồ sơ trẻ</ButtonLink>
              )}
              <Link to="/care/profile" className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#dbe3f1] bg-white px-3 font-black text-[#4c57a9] shadow-sm" aria-label="Mở hồ sơ người chăm sóc">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#eaf0ff]"><UserRound size={18} /></span>
                <span className="max-w-28 truncate text-sm">{caregiverName}</span>
              </Link>
            </>
          )}

          {mode === 'child' && activeChild && (
            <>
              <div className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#f4f7ff] px-3 font-black text-[#4c57a9]">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-white">{activeChild.avatarInitials}</span>
                <span className="text-sm">{activeChild.displayName}</span>
              </div>
              <ButtonLink to="/care/dashboard" variant="secondary" size="sm" leftIcon={<Home size={17} />}>Về trang quản lý</ButtonLink>
            </>
          )}
        </div>

        <button
          className="ml-auto grid h-11 w-11 place-items-center rounded-xl text-[#4c57a9] xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#dfe6f2] bg-white px-4 py-4 xl:hidden">
          <nav className="grid gap-1">
            {mode === 'public' && (
              <>
                <a href="/#about" onClick={close} className="rounded-2xl px-4 py-3 font-black text-[#59627f] hover:bg-[#eef3ff]">OcuSpeak là gì</a>
                <a href="/#patient" onClick={close} className="rounded-2xl px-4 py-3 font-black text-[#59627f] hover:bg-[#eef3ff]">Dành cho trẻ</a>
                <a href="/#caregiver" onClick={close} className="rounded-2xl px-4 py-3 font-black text-[#59627f] hover:bg-[#eef3ff]">Người chăm sóc</a>
                <a href="/#privacy" onClick={close} className="rounded-2xl px-4 py-3 font-black text-[#59627f] hover:bg-[#eef3ff]">An toàn dữ liệu</a>
              </>
            )}

            {mode === 'caregiver' && caregiverLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={close} className={({ isActive }) => cn('rounded-2xl px-4 py-3 font-black text-[#59627f] hover:bg-[#eef3ff]', isActive && 'bg-[#eaf0ff] text-[#4c57a9]')}>
                {link.label}
              </NavLink>
            ))}

            {mode === 'child' && activeChild && (
              <>
                <NavLink to={`${childBase}/aac`} onClick={close} className="rounded-2xl px-4 py-3 font-black text-[#59627f] hover:bg-[#eef3ff]">Bảng giao tiếp</NavLink>
                <NavLink to={`${childBase}/compose`} onClick={close} className="rounded-2xl px-4 py-3 font-black text-[#59627f] hover:bg-[#eef3ff]">Ghép câu</NavLink>
                <NavLink to={`${childBase}/reassurance`} onClick={close} className="rounded-2xl px-4 py-3 font-black text-[#59627f] hover:bg-[#eef3ff]">Lời trấn an</NavLink>
                <NavLink to={`${childBase}/sos`} onClick={close} className="rounded-2xl px-4 py-3 font-black text-[#a53a32] hover:bg-[#fff0ee]">SOS</NavLink>
              </>
            )}

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {mode === 'public' && (
                caregiverLoggedIn
                  ? <ButtonLink to="/care/dashboard" size="sm" fullWidth>Trang quản lý</ButtonLink>
                  : <ButtonLink to="/login" size="sm" fullWidth>Đăng nhập người chăm sóc</ButtonLink>
              )}
              {mode === 'caregiver' && (
                activeChild
                  ? <ButtonLink to={`${childBase}/aac`} size="sm" fullWidth>Mở giao diện cho trẻ</ButtonLink>
                  : <ButtonLink to="/care/children/new" size="sm" fullWidth>Tạo hồ sơ trẻ</ButtonLink>
              )}
              {mode === 'caregiver' && <ButtonLink to="/care/profile" variant="secondary" size="sm" fullWidth>Hồ sơ của tôi</ButtonLink>}
              {mode === 'child' && <ButtonLink to="/care/dashboard" variant="secondary" size="sm" fullWidth>Về trang quản lý</ButtonLink>}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
