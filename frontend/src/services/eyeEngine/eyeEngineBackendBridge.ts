import type { CalibrationProfile, DistressScore, TrackingState, VitalsSample } from '@/eye-engine';
import type { EyeTrackingEngine } from '@/eye-engine';
import { createMonitoringRecord, triggerSos } from '@/services/api/apiClient';
import { joinChildRoom } from '@/services/socket/realtimeClient';

export type SosPipelineOptions = {
  /** Điểm distress phải vượt ngưỡng này liên tục đủ lâu mới coi là cần báo động. */
  distressScoreThreshold?: number;
  distressSustainedMs?: number;
  /** Không gửi SOS quá dày — khoảng cách tối thiểu giữa 2 lần báo cho cùng một nguyên nhân. */
  cooldownMs?: number;
};

const DEFAULT_OPTIONS: Required<SosPipelineOptions> = {
  distressScoreThreshold: 0.7,
  distressSustainedMs: 3000,
  cooldownMs: 60_000,
};

/**
 * "SOS Pipeline" — đọc distress score do AI Engine trả ra và QUYẾT ĐỊNH khi
 * nào cần gọi /sos/alerts thật. Tách riêng khỏi engine để logic ngưỡng/SOS có
 * thể chỉnh theo từng trẻ (qua ChildConfig) mà không đụng vào AI Engine.
 *
 * Cũng đồng thời đẩy dữ liệu monitoring (calibration, mất khuôn mặt kéo dài,
 * nhịp tim/thở ước tính) lên backend + phòng chờ realtime để Caregiver App
 * nhận được ngay qua Socket.io (đã dựng sẵn ở backend/src/socket).
 */
export class EyeEngineBackendBridge {
  private readonly options: Required<SosPipelineOptions>;
  private lastSosAt = 0;
  private lastPersistedState: TrackingState | null = null;
  private stateEnteredAt = 0;
  private unsubscribers: Array<() => void> = [];

  constructor(
    private readonly engine: EyeTrackingEngine,
    private readonly childId: string,
    options: SosPipelineOptions = {},
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /** Gọi một lần sau khi engine.start() — đăng ký lắng nghe + join room realtime. */
  attach(): void {
    joinChildRoom(this.childId, 'PATIENT');

    this.unsubscribers.push(
      this.engine.on('distress', (score) => this.handleDistress(score)),
      this.engine.on('trackingStateChange', ({ current }) => this.handleTrackingStateChange(current)),
      this.engine.on('calibrationComplete', (profile) => this.handleCalibrationComplete(profile)),
      this.engine.on('vitals', (vitals) => this.handleVitals(vitals)),
    );
  }

  detach(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
  }

  private handleDistress(distress: DistressScore): void {
    const overThreshold =
      distress.score >= this.options.distressScoreThreshold &&
      distress.sustainedMs >= this.options.distressSustainedMs;

    if (!overThreshold) return;

    const now = Date.now();
    if (now - this.lastSosAt < this.options.cooldownMs) return;
    this.lastSosAt = now;

    void triggerSos(
      this.childId,
      `Phát hiện biểu cảm khó chịu kéo dài (điểm ${distress.score.toFixed(2)}, ${Math.round(distress.sustainedMs / 1000)}s)`,
    );
  }

  private handleTrackingStateChange(state: TrackingState): void {
    this.stateEnteredAt = Date.now();

    // Chỉ báo cáo các trạng thái bất thường kéo dài (tránh spam khi tracking bình thường).
    if (state === 'TRACKING' || state === 'INITIALIZING') {
      this.lastPersistedState = state;
      return;
    }

    // Trì hoãn 5s trước khi ghi nhận, để bỏ qua các gián đoạn ngắn/thoáng qua.
    window.setTimeout(() => {
      if (Date.now() - this.stateEnteredAt < 4900) return; // trạng thái đã đổi trước khi hết chờ
      if (this.lastPersistedState === state) return;
      this.lastPersistedState = state;

      void createMonitoringRecord(this.childId, 'INACTIVITY', {
        reason: state,
        detectedAt: new Date().toISOString(),
      });
    }, 5000);
  }

  private handleCalibrationComplete(profile: CalibrationProfile): void {
    void createMonitoringRecord(this.childId, 'CALIBRATION', {
      method: profile.method,
      confidence: profile.confidence,
      pointCount: profile.points.length,
      createdAt: profile.createdAt,
    });
  }

  private lastVitalsPersistAt = 0;

  private handleVitals(vitals: VitalsSample): void {
    // Chỉ lưu định kỳ (mỗi 30s) và khi tín hiệu đủ tin cậy — tránh làm ngập bảng monitoring_records.
    if (vitals.signalQuality < 0.4 || vitals.bpm === null) return;
    const now = Date.now();
    if (now - this.lastVitalsPersistAt < 30_000) return;
    this.lastVitalsPersistAt = now;

    void createMonitoringRecord(this.childId, 'HEARTBEAT', {
      bpm: vitals.bpm,
      breathingRatePerMin: vitals.breathingRatePerMin,
      signalQuality: vitals.signalQuality,
    });
  }
}
