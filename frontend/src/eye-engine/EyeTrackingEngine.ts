import { CameraStream, type CameraStreamOptions } from './cameraStream';
import { FaceMeshDetector, LANDMARK_INDEX } from './faceMeshDetector';
import { estimateRawGaze, estimateFaceBox } from './gazeEstimation';
import { OneEuroFilter2D } from './oneEuroFilter';
import { CalibrationEngine, applyCalibration } from './calibrationEngine';
import { QualityMonitor } from './qualityMonitor';
import { ExpressionDistressAnalyzer } from './expressionDistress';
import { RppgEngine, sampleForeheadGreenMean } from './rppgEngine';
import { EventBus } from './eventBus';
import type {
  CalibrationMethod,
  CalibrationProfile,
  EngineEventMap,
  EngineEventName,
  GazeSample,
  Point2D,
  TrackingState,
} from './types';

export type EyeTrackingEngineOptions = {
  camera?: CameraStreamOptions;
  /** Điểm hiệu chỉnh đã lưu trước đó cho trẻ này (nếu có) — nạp lại để dùng ngay không cần calibration lại. */
  calibrationProfile?: CalibrationProfile;
};

/**
 * SDK chính: "Eye Tracking, Calibration & Monitoring Engine".
 *
 * Nguyên tắc: engine CHỈ xử lý camera + AI + trả dữ liệu/trạng thái qua
 * events và getState(). Không render UI, không tự gọi API backend/SOS —
 * việc đó do lớp gọi (Patient Web / bridge riêng) quyết định.
 *
 * Cách dùng cơ bản:
 * ```ts
 * const engine = new EyeTrackingEngine(videoElement);
 * await engine.init();
 * engine.on('gaze', (sample) => { ... di chuyển con trỏ nhìn ... });
 * engine.on('distress', (d) => { if (d.score > 0.7 && d.sustainedMs > 3000) { ... } });
 * engine.start();
 * ```
 */
export class EyeTrackingEngine {
  private readonly camera: CameraStream;
  private readonly detector = new FaceMeshDetector();
  private readonly gazeFilter = new OneEuroFilter2D(1.2, 0.015);
  private readonly calibrationEngine = new CalibrationEngine();
  private readonly qualityMonitor = new QualityMonitor();
  private readonly distressAnalyzer = new ExpressionDistressAnalyzer();
  private readonly rppgEngine = new RppgEngine();
  private readonly bus = new EventBus();
  private readonly workCanvas = document.createElement('canvas');

  private calibrationProfile: CalibrationProfile | null = null;
  private rafHandle: number | null = null;
  private running = false;
  private previousState: TrackingState = 'INITIALIZING';
  private latestState: {
    gaze: GazeSample | null;
    trackingState: TrackingState;
  } = { gaze: null, trackingState: 'INITIALIZING' };

  constructor(videoEl: HTMLVideoElement, private readonly options: EyeTrackingEngineOptions = {}) {
    this.camera = new CameraStream(videoEl);
    if (options.calibrationProfile) this.calibrationProfile = options.calibrationProfile;
  }

  /**
   * Xin quyền camera + tải model FaceLandmarker của Google. Gọi một lần trước start().
   * Nếu Patient Web đã có sẵn MediaStream (vd. từ CameraProvider ở màn Permissions),
   * truyền vào `existingStream` để tránh xin quyền camera lần thứ hai.
   */
  async init(existingStream?: MediaStream): Promise<void> {
    await Promise.all([
      existingStream ? this.camera.attachExisting(existingStream) : this.camera.start(this.options.camera),
      this.detector.load(),
    ]);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.processFrame();
      this.rafHandle = requestAnimationFrame(loop);
    };
    this.rafHandle = requestAnimationFrame(loop);
  }

  stop(): void {
    this.running = false;
    if (this.rafHandle !== null) cancelAnimationFrame(this.rafHandle);
    this.rafHandle = null;
  }

  destroy(): void {
    this.stop();
    this.camera.stop();
    this.detector.close();
    this.bus.clear();
  }

  on<K extends EngineEventName>(event: K, handler: (payload: EngineEventMap[K]) => void): () => void {
    return this.bus.on(event, handler);
  }

  // ---------------- Calibration ----------------

  beginCalibration(method: CalibrationMethod, screenTargets: Point2D[]): void {
    this.calibrationEngine.begin(method, screenTargets);
  }

  /** Gọi liên tục (vd. mỗi frame) trong khi trẻ đang nhìn vào điểm hiệu chỉnh hiện tại. */
  captureCalibrationSample(): void {
    if (!this.latestRawGaze) return;
    const count = this.calibrationEngine.addSample(this.latestRawGaze);
    this.bus.emit('calibrationProgress', {
      pointIndex: this.calibrationEngine.activePointIndex,
      total: this.calibrationEngine.totalPoints,
      sampleCount: count,
    });
  }

  /** Patient Web gọi khi đã thu đủ mẫu cho điểm hiện tại. Trả false nếu đã là điểm cuối. */
  advanceCalibrationPoint(): boolean {
    return this.calibrationEngine.advanceToNextPoint();
  }

  finishCalibration(): CalibrationProfile {
    const profile = this.calibrationEngine.finish();
    this.calibrationProfile = profile;
    this.gazeFilter.reset();
    this.bus.emit('calibrationComplete', profile);
    return profile;
  }

  loadCalibrationProfile(profile: CalibrationProfile): void {
    this.calibrationProfile = profile;
    this.gazeFilter.reset();
  }

  getCalibrationProfile(): CalibrationProfile | null {
    return this.calibrationProfile;
  }

  // ---------------- State ----------------

  getState() {
    return this.latestState;
  }

  // ---------------- Internal frame loop ----------------

  private latestRawGaze: { x: number; y: number } | null = null;

  private processFrame(): void {
    const timestampMs = performance.now();
    const video = this.camera.videoElement;
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

    if (!this.camera.isLive()) {
      // Cam đã bị tắt/ngắt ở đâu đó (không phải do engine tự stop) — đừng phân
      // tích lại khung hình đứng hình cuối cùng, coi như mất mặt ngay lập tức.
      this.latestRawGaze = null;
      this.latestState = { gaze: null, trackingState: 'NO_FACE' };
      this.emitTrackingStateIfChanged('NO_FACE');
      return;
    }

    const detection = this.detector.detect(video, timestampMs);
    const brightness = this.camera.sampleBrightness(this.workCanvas);

    if (!detection.detected || !detection.landmarks) {
      this.latestRawGaze = null;
      const quality = this.qualityMonitor.evaluate({
        detected: false,
        faceBox: null,
        nosePosition: null,
        blendShapes: {},
        brightness,
        calibrationConfidence: this.calibrationProfile?.confidence ?? 0,
        timestampMs,
      });
      // QUAN TRỌNG: phải xoá gaze cũ khi không còn thấy mặt, nếu không getState()
      // sẽ tiếp tục trả về điểm nhìn/trạng thái CŨ mãi mãi (bug: tắt cam hoặc
      // nhìn ra ngoài vẫn báo "đang nhìn" ở vị trí cũ).
      this.latestState = { gaze: null, trackingState: quality.state };
      this.emitTrackingStateIfChanged(quality.state);
      this.bus.emit('quality', quality);
      return;
    }

    const { landmarks, blendShapes } = detection;
    const rawGaze = estimateRawGaze(landmarks);
    const faceBox = estimateFaceBox(landmarks);
    const nose = landmarks[LANDMARK_INDEX.noseTip];

    this.latestRawGaze = rawGaze;

    const quality = this.qualityMonitor.evaluate({
      detected: true,
      faceBox,
      nosePosition: { x: nose.x, y: nose.y },
      blendShapes,
      brightness,
      calibrationConfidence: this.calibrationProfile?.confidence ?? 0,
      timestampMs,
    });
    this.emitTrackingStateIfChanged(quality.state);
    this.bus.emit('quality', quality);

    if (quality.state === 'TRACKING' && this.calibrationProfile) {
      const mapped = applyCalibration(this.calibrationProfile, rawGaze);
      const smoothed = this.gazeFilter.filter(mapped, timestampMs);
      const gazeSample: GazeSample = {
        screen: smoothed,
        raw: rawGaze,
        timestamp: timestampMs,
        confidence: quality.trackingConfidence,
      };
      this.latestState = { gaze: gazeSample, trackingState: quality.state };
      this.bus.emit('gaze', gazeSample);
    } else {
      this.latestState = { gaze: null, trackingState: quality.state };
    }

    const distress = this.distressAnalyzer.evaluate(blendShapes, timestampMs);
    this.bus.emit('distress', distress);

    const greenMean = sampleForeheadGreenMean(video, this.workCanvas, faceBox);
    const vitals = this.rppgEngine.pushSample(greenMean, timestampMs);
    this.bus.emit('vitals', vitals);
  }

  private emitTrackingStateIfChanged(current: TrackingState): void {
    if (current !== this.previousState) {
      this.bus.emit('trackingStateChange', { previous: this.previousState, current });
      this.previousState = current;
    }
  }
}
