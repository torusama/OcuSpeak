import type { CapabilityResult } from '@/types';

export function checkCapabilities(): CapabilityResult[] {
  const secure = typeof window === 'undefined' ? false : window.isSecureContext || window.location.hostname === 'localhost';
  const media = typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
  const wasm = typeof WebAssembly !== 'undefined';
  const serviceWorker = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  const notification = typeof window !== 'undefined' && 'Notification' in window;
  const speech = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return [
    {
      label: 'Kết nối bảo mật HTTPS',
      supported: secure,
      detail: secure ? 'Đủ điều kiện mở camera.' : 'Cần HTTPS hoặc localhost để dùng camera.'
    },
    {
      label: 'Camera trình duyệt',
      supported: media,
      detail: media ? 'Trình duyệt hỗ trợ getUserMedia.' : 'Không tìm thấy API camera.'
    },
    {
      label: 'WebAssembly',
      supported: wasm,
      detail: wasm ? 'Có thể chạy MediaPipe trên thiết bị.' : 'Không thể chạy mô hình thị giác cục bộ.'
    },
    {
      label: 'PWA và offline',
      supported: serviceWorker,
      detail: serviceWorker ? 'Có thể lưu shell ứng dụng và fallback.' : 'Service Worker chưa được hỗ trợ.'
    },
    {
      label: 'Thông báo',
      supported: notification,
      detail: notification ? 'Caregiver có thể xin quyền nhận thông báo.' : 'Không hỗ trợ Notification API.'
    },
    {
      label: 'Giọng nói dự phòng',
      supported: speech,
      detail: speech ? 'Có thể dùng speech synthesis khi cloud TTS lỗi.' : 'Không có giọng nói trình duyệt dự phòng.'
    }
  ];
}
