export type PatientSessionState =
  | 'UNPAIRED'
  | 'PAIRING'
  | 'PERMISSIONS_REQUIRED'
  | 'DEVICE_SETUP'
  | 'CALIBRATION_REQUIRED'
  | 'READY'
  | 'OFFLINE_FALLBACK'
  | 'CHECK_REQUIRED'
  | 'SOS_ACTIVE';

export type CameraQualityState =
  | 'GOOD'
  | 'LOW_LIGHT'
  | 'OVEREXPOSED'
  | 'BLUR_OR_MOTION'
  | 'FACE_NOT_FOUND'
  | 'FACE_OFF_CENTER'
  | 'LOW_FPS'
  | 'UNKNOWN';

export type CommunicationStatus =
  | 'QUEUED_LOCAL'
  | 'SENT'
  | 'RECEIVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type SafetyState = 'NORMAL' | 'CHECK_REQUIRED' | 'RED_ALERT';

export type CalibrationStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'RETRY_RECOMMENDED'
  | 'FAILED';

export type ColorToken =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'pink'
  | 'purple'
  | 'indigo'
  | 'blue';

export type AacCategory = {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: ColorToken;
  itemIds: string[];
  visible: boolean;
  order: number;
};

export type AacItem = {
  id: string;
  categoryId: string;
  label: string;
  speechText: string;
  quickSentence: string;
  icon: string;
  color: ColorToken;
  visible: boolean;
  order: number;
  imageUrl?: string;
  altText: string;
};

export type PatientProfile = {
  id: string;
  displayName: string;
  age: number;
  avatarInitials: string;
  online: boolean;
  lastSeen: string;
  gridSize: 4 | 6 | 9;
  dwellTime: 1 | 1.5 | 2 | 3;
  calibrationMode: 5 | 9;
  ttsEnabled: boolean;
  realImageMode: boolean;
  cameraQuality: CameraQualityState;
  trackingConfidence: number;
  monitoringConfidence: number;
  bpm: number | null;
};

export type CommunicationEvent = {
  id: string;
  patientId: string;
  itemIds: string[];
  sentence: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  status: CommunicationStatus;
  unread: boolean;
};

export type AlertSeverity = 'CHECK_REQUIRED' | 'RED_ALERT';

export type AlertEvent = {
  id: string;
  patientId: string;
  severity: AlertSeverity;
  title: string;
  summary: string;
  reasonCodes: string[];
  source: 'MANUAL_SOS' | 'AUTOMATIC_RULE';
  createdAt: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'CHECKING' | 'RESOLVED';
  cameraQuality: CameraQualityState;
  facialState: string;
  rppgConfidence: number;
  bpm: number | null;
  configVersion: string;
};

export type ReassuranceMessage = {
  id: string;
  title: string;
  text: string;
  favorite: boolean;
  type: 'TTS' | 'AUDIO';
};

export type DeviceInfo = {
  id: string;
  name: string;
  browser: string;
  platform: string;
  online: boolean;
  lastSeen: string;
  cameraPermission: 'GRANTED' | 'DENIED' | 'PROMPT';
};

export type CapabilityResult = {
  label: string;
  supported: boolean;
  detail: string;
};
