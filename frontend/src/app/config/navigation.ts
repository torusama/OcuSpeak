import {
  Bell,
  ChartNoAxesCombined,
  ClipboardList,
  Grid2X2,
  HeartPulse,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Sparkles,
  UserRoundCog,
  UsersRound
} from 'lucide-react';

export const careNavigation = [
  { label: 'Tổng quan', to: '/care/dashboard', icon: LayoutDashboard },
  { label: 'Hồ sơ trẻ', to: '/care/children', icon: UsersRound },
  { label: 'Bảng AAC', to: '/care/aac', icon: Grid2X2 },
  { label: 'Yêu cầu', to: '/care/communications', icon: MessageSquareText },
  { label: 'Cảnh báo', to: '/care/alerts', icon: HeartPulse },
  { label: 'Lời trấn an', to: '/care/reassurance', icon: Sparkles },
  { label: 'Lịch sử', to: '/care/history', icon: ClipboardList },
  { label: 'Phân tích', to: '/care/analytics', icon: ChartNoAxesCombined },
  { label: 'Thông báo', to: '/care/notifications', icon: Bell },
  { label: 'Cài đặt', to: '/care/settings', icon: Settings },
  { label: 'Hồ sơ của tôi', to: '/care/profile', icon: UserRoundCog }
];

export const careMobileNavigation = careNavigation.slice(0, 5);
