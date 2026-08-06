import type {
  AacCategory,
  AacItem,
  AlertEvent,
  CommunicationEvent,
  DeviceInfo,
  PatientProfile,
  ReassuranceMessage
} from '@/types';

export const patientProfile: PatientProfile = {
  id: 'patient-an',
  displayName: 'Bé An',
  age: 11,
  avatarInitials: 'AN',
  online: true,
  lastSeen: 'Vừa xong',
  gridSize: 4,
  dwellTime: 1.5,
  calibrationMode: 5,
  ttsEnabled: true,
  realImageMode: false,
  cameraQuality: 'GOOD',
  trackingConfidence: 0.86,
  monitoringConfidence: 0.71,
  bpm: null
};

export const categories: AacCategory[] = [
  {
    id: 'needs',
    label: 'Nhu cầu',
    description: 'Ăn, uống, thay đổi tư thế và những nhu cầu hằng ngày.',
    icon: 'HandHeart',
    color: 'orange',
    itemIds: ['water', 'hungry', 'toilet', 'change-position', 'hot', 'cold', 'rest', 'medicine'],
    visible: true,
    order: 1
  },
  {
    id: 'feelings',
    label: 'Cảm xúc',
    description: 'Giúp diễn đạt cảm giác và mức độ thoải mái.',
    icon: 'Heart',
    color: 'pink',
    itemIds: ['happy', 'sad', 'uncomfortable', 'scared', 'tired', 'calm', 'angry', 'lonely'],
    visible: true,
    order: 2
  },
  {
    id: 'people',
    label: 'Người thân',
    description: 'Gọi người thân hoặc người chăm sóc đang cần.',
    icon: 'UsersRound',
    color: 'blue',
    itemIds: ['mother', 'father', 'grandmother', 'caregiver', 'sibling', 'teacher', 'doctor', 'friend'],
    visible: true,
    order: 3
  },
  {
    id: 'activities',
    label: 'Hoạt động',
    description: 'Chọn điều muốn làm hoặc thay đổi môi trường.',
    icon: 'Shapes',
    color: 'green',
    itemIds: ['music', 'story', 'outside', 'sleep', 'tv', 'study', 'play', 'window'],
    visible: true,
    order: 4
  }
];

export const aacItems: AacItem[] = [
  { id: 'water', categoryId: 'needs', label: 'Uống nước', speechText: 'Con muốn uống nước.', quickSentence: 'Con muốn uống nước.', icon: 'GlassWater', color: 'blue', visible: true, order: 1, altText: 'Ly nước' },
  { id: 'hungry', categoryId: 'needs', label: 'Đói', speechText: 'Con đang đói.', quickSentence: 'Con đang đói và muốn ăn.', icon: 'Soup', color: 'orange', visible: true, order: 2, altText: 'Bát thức ăn' },
  { id: 'toilet', categoryId: 'needs', label: 'Đi vệ sinh', speechText: 'Con cần đi vệ sinh.', quickSentence: 'Con cần được hỗ trợ đi vệ sinh.', icon: 'Accessibility', color: 'purple', visible: true, order: 3, altText: 'Biểu tượng hỗ trợ' },
  { id: 'change-position', categoryId: 'needs', label: 'Đổi tư thế', speechText: 'Con muốn đổi tư thế.', quickSentence: 'Con cần được giúp đổi tư thế.', icon: 'RefreshCcw', color: 'green', visible: true, order: 4, altText: 'Mũi tên đổi tư thế' },
  { id: 'hot', categoryId: 'needs', label: 'Nóng', speechText: 'Con thấy nóng.', quickSentence: 'Con thấy nóng, giúp con làm mát.', icon: 'Sun', color: 'orange', visible: true, order: 5, altText: 'Mặt trời' },
  { id: 'cold', categoryId: 'needs', label: 'Lạnh', speechText: 'Con thấy lạnh.', quickSentence: 'Con thấy lạnh, giúp con giữ ấm.', icon: 'Snowflake', color: 'blue', visible: true, order: 6, altText: 'Bông tuyết' },
  { id: 'rest', categoryId: 'needs', label: 'Nghỉ một chút', speechText: 'Con muốn nghỉ một chút.', quickSentence: 'Con muốn nghỉ một chút.', icon: 'Armchair', color: 'pink', visible: true, order: 7, altText: 'Ghế nghỉ' },
  { id: 'medicine', categoryId: 'needs', label: 'Gọi kiểm tra', speechText: 'Con cần người chăm sóc kiểm tra.', quickSentence: 'Con cần người chăm sóc kiểm tra giúp con.', icon: 'ClipboardPlus', color: 'red', visible: true, order: 8, altText: 'Bảng kiểm tra' },

  { id: 'happy', categoryId: 'feelings', label: 'Vui', speechText: 'Con đang vui.', quickSentence: 'Con cảm thấy vui.', icon: 'Smile', color: 'green', visible: true, order: 1, altText: 'Khuôn mặt vui' },
  { id: 'sad', categoryId: 'feelings', label: 'Buồn', speechText: 'Con đang buồn.', quickSentence: 'Con cảm thấy buồn và muốn có người bên cạnh.', icon: 'Frown', color: 'blue', visible: true, order: 2, altText: 'Khuôn mặt buồn' },
  { id: 'uncomfortable', categoryId: 'feelings', label: 'Khó chịu', speechText: 'Con đang khó chịu.', quickSentence: 'Con cảm thấy khó chịu, hãy kiểm tra giúp con.', icon: 'Meh', color: 'orange', visible: true, order: 3, altText: 'Khuôn mặt khó chịu' },
  { id: 'scared', categoryId: 'feelings', label: 'Sợ', speechText: 'Con đang sợ.', quickSentence: 'Con đang sợ, hãy ở bên con.', icon: 'ShieldAlert', color: 'red', visible: true, order: 4, altText: 'Khiên cảnh báo' },
  { id: 'tired', categoryId: 'feelings', label: 'Mệt', speechText: 'Con thấy mệt.', quickSentence: 'Con thấy mệt và muốn nghỉ.', icon: 'BatteryLow', color: 'purple', visible: true, order: 5, altText: 'Pin yếu' },
  { id: 'calm', categoryId: 'feelings', label: 'Ổn hơn', speechText: 'Con thấy ổn hơn.', quickSentence: 'Con cảm thấy ổn hơn rồi.', icon: 'Leaf', color: 'green', visible: true, order: 6, altText: 'Chiếc lá' },
  { id: 'angry', categoryId: 'feelings', label: 'Bực mình', speechText: 'Con đang bực mình.', quickSentence: 'Con đang bực mình và cần một chút thời gian.', icon: 'Flame', color: 'orange', visible: true, order: 7, altText: 'Ngọn lửa' },
  { id: 'lonely', categoryId: 'feelings', label: 'Muốn có người', speechText: 'Con muốn có người ở bên.', quickSentence: 'Con muốn có người ở bên cạnh con.', icon: 'HeartHandshake', color: 'pink', visible: true, order: 8, altText: 'Hai bàn tay và trái tim' },

  { id: 'mother', categoryId: 'people', label: 'Mẹ', speechText: 'Con gọi mẹ.', quickSentence: 'Mẹ ơi, con cần mẹ.', icon: 'UserRound', color: 'pink', visible: true, order: 1, altText: 'Mẹ' },
  { id: 'father', categoryId: 'people', label: 'Ba', speechText: 'Con gọi ba.', quickSentence: 'Ba ơi, con cần ba.', icon: 'UserRound', color: 'blue', visible: true, order: 2, altText: 'Ba' },
  { id: 'grandmother', categoryId: 'people', label: 'Bà', speechText: 'Con gọi bà.', quickSentence: 'Bà ơi, con muốn gặp bà.', icon: 'PersonStanding', color: 'purple', visible: true, order: 3, altText: 'Bà' },
  { id: 'caregiver', categoryId: 'people', label: 'Người chăm sóc', speechText: 'Con cần người chăm sóc.', quickSentence: 'Con cần người chăm sóc đến giúp.', icon: 'BadgeHelp', color: 'green', visible: true, order: 4, altText: 'Người chăm sóc' },
  { id: 'sibling', categoryId: 'people', label: 'Anh chị em', speechText: 'Con muốn gặp anh chị em.', quickSentence: 'Con muốn gặp anh chị em.', icon: 'Users', color: 'orange', visible: true, order: 5, altText: 'Anh chị em' },
  { id: 'teacher', categoryId: 'people', label: 'Thầy cô', speechText: 'Con cần thầy cô.', quickSentence: 'Con muốn nói với thầy cô.', icon: 'GraduationCap', color: 'indigo', visible: true, order: 6, altText: 'Thầy cô' },
  { id: 'doctor', categoryId: 'people', label: 'Nhân viên y tế', speechText: 'Con cần được kiểm tra.', quickSentence: 'Con cần người lớn liên hệ nhân viên y tế.', icon: 'Stethoscope', color: 'red', visible: true, order: 7, altText: 'Ống nghe' },
  { id: 'friend', categoryId: 'people', label: 'Bạn', speechText: 'Con muốn gặp bạn.', quickSentence: 'Con muốn gặp hoặc nói chuyện với bạn.', icon: 'ContactRound', color: 'yellow', visible: true, order: 8, altText: 'Bạn' },

  { id: 'music', categoryId: 'activities', label: 'Nghe nhạc', speechText: 'Con muốn nghe nhạc.', quickSentence: 'Con muốn nghe nhạc.', icon: 'Music2', color: 'purple', visible: true, order: 1, altText: 'Nốt nhạc' },
  { id: 'story', categoryId: 'activities', label: 'Nghe truyện', speechText: 'Con muốn nghe truyện.', quickSentence: 'Con muốn nghe một câu chuyện.', icon: 'BookOpen', color: 'blue', visible: true, order: 2, altText: 'Quyển sách' },
  { id: 'outside', categoryId: 'activities', label: 'Ra ngoài', speechText: 'Con muốn ra ngoài.', quickSentence: 'Con muốn ra ngoài một chút.', icon: 'Trees', color: 'green', visible: true, order: 3, altText: 'Cây xanh' },
  { id: 'sleep', categoryId: 'activities', label: 'Đi ngủ', speechText: 'Con muốn ngủ.', quickSentence: 'Con muốn đi ngủ.', icon: 'MoonStar', color: 'indigo', visible: true, order: 4, altText: 'Mặt trăng' },
  { id: 'tv', categoryId: 'activities', label: 'Xem video', speechText: 'Con muốn xem video.', quickSentence: 'Con muốn xem một video.', icon: 'MonitorPlay', color: 'pink', visible: true, order: 5, altText: 'Màn hình video' },
  { id: 'study', categoryId: 'activities', label: 'Học', speechText: 'Con muốn học.', quickSentence: 'Con muốn bắt đầu hoạt động học tập.', icon: 'NotebookTabs', color: 'orange', visible: true, order: 6, altText: 'Vở học' },
  { id: 'play', categoryId: 'activities', label: 'Chơi', speechText: 'Con muốn chơi.', quickSentence: 'Con muốn chơi một trò đơn giản.', icon: 'Puzzle', color: 'yellow', visible: true, order: 7, altText: 'Mảnh ghép' },
  { id: 'window', categoryId: 'activities', label: 'Mở cửa sổ', speechText: 'Con muốn mở cửa sổ.', quickSentence: 'Con muốn mở cửa sổ hoặc thay đổi không khí.', icon: 'PanelsTopLeft', color: 'blue', visible: true, order: 8, altText: 'Cửa sổ' }
];

export const communications: CommunicationEvent[] = [
  {
    id: 'comm-1042',
    patientId: 'patient-an',
    itemIds: ['mother', 'water'],
    sentence: 'Mẹ ơi, con muốn uống nước.',
    category: 'Nhu cầu',
    createdAt: '20:34 hôm nay',
    updatedAt: '20:35 hôm nay',
    status: 'PROCESSING',
    unread: true
  },
  {
    id: 'comm-1041',
    patientId: 'patient-an',
    itemIds: ['change-position'],
    sentence: 'Con cần được giúp đổi tư thế.',
    category: 'Nhu cầu',
    createdAt: '18:12 hôm nay',
    updatedAt: '18:17 hôm nay',
    status: 'COMPLETED',
    unread: false
  },
  {
    id: 'comm-1040',
    patientId: 'patient-an',
    itemIds: ['music'],
    sentence: 'Con muốn nghe nhạc.',
    category: 'Hoạt động',
    createdAt: '16:40 hôm nay',
    updatedAt: '16:41 hôm nay',
    status: 'RECEIVED',
    unread: false
  },
  {
    id: 'comm-1039',
    patientId: 'patient-an',
    itemIds: ['uncomfortable'],
    sentence: 'Con cảm thấy khó chịu, hãy kiểm tra giúp con.',
    category: 'Cảm xúc',
    createdAt: '14:22 hôm nay',
    updatedAt: '14:25 hôm nay',
    status: 'COMPLETED',
    unread: false
  }
];

export const alerts: AlertEvent[] = [
  {
    id: 'alert-902',
    patientId: 'patient-an',
    severity: 'CHECK_REQUIRED',
    title: 'Cần kiểm tra camera',
    summary: 'Khuôn mặt không nằm ổn định trong khung hình và tracking confidence giảm kéo dài.',
    reasonCodes: ['FACE_OFF_CENTER', 'TRACKING_CONFIDENCE_LOW'],
    source: 'AUTOMATIC_RULE',
    createdAt: '19:58 hôm nay',
    status: 'ACKNOWLEDGED',
    cameraQuality: 'FACE_OFF_CENTER',
    facialState: 'FACE_NOT_STABLE',
    rppgConfidence: 0.28,
    bpm: null,
    configVersion: 'remote-config-v3'
  },
  {
    id: 'alert-901',
    patientId: 'patient-an',
    severity: 'RED_ALERT',
    title: 'Manual SOS',
    summary: 'Người dùng đã chủ động kích hoạt nút SOS. Cần kiểm tra ngay.',
    reasonCodes: ['MANUAL_SOS'],
    source: 'MANUAL_SOS',
    createdAt: 'Hôm qua, 21:10',
    status: 'RESOLVED',
    cameraQuality: 'UNKNOWN',
    facialState: 'NOT_EVALUATED',
    rppgConfidence: 0,
    bpm: null,
    configVersion: 'remote-config-v3'
  }
];

export const reassuranceMessages: ReassuranceMessage[] = [
  { id: 'rea-1', title: 'Đã nhận', text: 'Mẹ đã nhận được rồi.', favorite: true, type: 'TTS' },
  { id: 'rea-2', title: 'Đang đến', text: 'Mẹ đang đến, con chờ một chút nhé.', favorite: true, type: 'TTS' },
  { id: 'rea-3', title: 'Con an toàn', text: 'Mẹ đang ở đây. Con cứ bình tĩnh nhé.', favorite: false, type: 'TTS' },
  { id: 'rea-4', title: 'Âm thanh quen thuộc', text: 'Tệp âm thanh đã ghi sẵn', favorite: false, type: 'AUDIO' }
];

export const devices: DeviceInfo[] = [
  {
    id: 'device-1',
    name: 'Laptop phòng khách',
    browser: 'Chrome 150',
    platform: 'Windows 11',
    online: true,
    lastSeen: 'Vừa xong',
    cameraPermission: 'GRANTED'
  },
  {
    id: 'device-2',
    name: 'Máy tính bảng dự phòng',
    browser: 'Chrome Mobile',
    platform: 'Android',
    online: false,
    lastSeen: '2 ngày trước',
    cameraPermission: 'PROMPT'
  }
];

export const activityByDay = [
  { day: 'T2', events: 9, completed: 7 },
  { day: 'T3', events: 13, completed: 11 },
  { day: 'T4', events: 8, completed: 8 },
  { day: 'T5', events: 15, completed: 12 },
  { day: 'T6', events: 12, completed: 10 },
  { day: 'T7', events: 17, completed: 14 },
  { day: 'CN', events: 14, completed: 12 }
];

export const topNeeds = [
  { name: 'Uống nước', value: 21 },
  { name: 'Đổi tư thế', value: 15 },
  { name: 'Gọi mẹ', value: 12 },
  { name: 'Nghe nhạc', value: 9 },
  { name: 'Nghỉ', value: 7 }
];

export const communicationStatusData = [
  { name: 'Hoàn thành', value: 68 },
  { name: 'Đang xử lý', value: 17 },
  { name: 'Đã nhận', value: 10 },
  { name: 'Chưa gửi', value: 5 }
];
