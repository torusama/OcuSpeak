/**
 * Toàn bộ kiểu dữ liệu công khai của Eye Tracking Engine.
 * Engine CHỈ trả dữ liệu/trạng thái qua các type này — không có gì liên quan tới UI.
 */

export type Point2D = { x: number; y: number };

/** Một điểm nhìn (gaze) đã được làm mịn và ánh xạ ra toạ độ màn hình (0..1). */
export type GazeSample = {
  /** Toạ độ màn hình chuẩn hoá, 0..1 theo cả hai trục. */
  screen: Point2D;
  /** Đặc trưng gaze thô (chưa map ra màn hình), dùng nội bộ cho calibration. */
  raw: Point2D;
  timestamp: number;
  /** Độ tin cậy của MẪU NÀY (0..1) — dựa trên chất lượng landmark phát hiện được. */
  confidence: number;
};

export type CalibrationMethod = '5-point' | '9-point';

export type CalibrationPointResult = {
  screen: Point2D;
  /** Trung bình các mẫu gaze thô thu được khi trẻ nhìn vào điểm này. */
  rawMean: Point2D;
  /** Độ lệch chuẩn của các mẫu — phương sai càng thấp càng đáng tin. */
  rawStdDev: Point2D;
  sampleCount: number;
};

/** Hồ sơ hiệu chỉnh — lưu riêng theo từng trẻ (do lớp gọi engine tự lưu, ví dụ gửi lên backend). */
export type CalibrationProfile = {
  method: CalibrationMethod;
  points: CalibrationPointResult[];
  /** Hệ số ma trận ánh xạ raw-gaze -> screen (affine bậc 1 hoặc polynomial bậc 2). */
  transformCoefficients: { x: number[]; y: number[] };
  /** 0..1 — càng cao càng đáng tin, tính từ sai số hồi quy + phương sai từng điểm. */
  confidence: number;
  createdAt: string;
};

export type TrackingState =
  | 'INITIALIZING'
  | 'TRACKING'
  | 'NO_FACE'
  | 'FACE_MISPLACED'
  | 'OCCLUDED_OR_LOW_LIGHT'
  | 'EYES_CLOSED'
  | 'UNSTABLE';

export type QualityMetrics = {
  trackingConfidence: number;
  calibrationConfidence: number;
  lightingScore: number;
  faceBoxRatio: number;
  state: TrackingState;
  /** Số mili-giây mắt đã nhắm liên tục (0 nếu đang mở). */
  eyesClosedDurationMs: number;
};

export type DistressSignals = {
  browFurrow: number;
  mouthFrown: number;
  eyeSquint: number;
  jawOpen: number;
};

export type DistressScore = {
  /** 0..1 — điểm khó chịu tổng hợp, dùng làm input cho SOS Pipeline (không tự gọi SOS). */
  score: number;
  signals: DistressSignals;
  /** Đã vượt ngưỡng liên tục bao lâu (ms) — dùng để tránh báo động giả tức thời. */
  sustainedMs: number;
  timestamp: number;
};

export type VitalsSample = {
  bpm: number | null;
  breathingRatePerMin: number | null;
  /** 0..1 — chất lượng tín hiệu rPPG (SNR proxy). Dưới 0.4 nên coi bpm là không đáng tin. */
  signalQuality: number;
  timestamp: number;
};

export type EngineEventMap = {
  gaze: GazeSample;
  trackingStateChange: { previous: TrackingState; current: TrackingState };
  quality: QualityMetrics;
  distress: DistressScore;
  vitals: VitalsSample;
  calibrationProgress: { pointIndex: number; total: number; sampleCount: number };
  calibrationComplete: CalibrationProfile;
  error: { message: string; cause?: unknown };
};

export type EngineEventName = keyof EngineEventMap;
