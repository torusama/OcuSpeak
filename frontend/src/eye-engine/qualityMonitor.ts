import type { BlendShapeScores } from './faceMeshDetector';
import type { QualityMetrics, TrackingState } from './types';

const NO_FACE_FRAMES_THRESHOLD = 10; // ~0.3s ở 30fps
const EYE_CLOSED_SCORE_THRESHOLD = 0.6; // blendshape eyeBlink* > ngưỡng này coi là nhắm
const EYE_CLOSED_ALERT_MS = 4000; // nhắm liên tục >4s mới coi là bất thường (chớp mắt bình thường không tính)
const LOW_LIGHT_THRESHOLD = 40; // luminance trung bình 0..255
const OVER_EXPOSED_THRESHOLD = 235;
const FACE_TOO_SMALL_RATIO = 0.12; // face width / frame width
const FACE_TOO_LARGE_RATIO = 0.75;
const FACE_OFFCENTER_THRESHOLD = 0.28; // lệch tâm khung hình quá mức này
const JITTER_WINDOW = 15;
const JITTER_STD_THRESHOLD = 0.02; // độ lệch chuẩn vị trí mũi (toạ độ chuẩn hoá) trên cửa sổ trượt

export type QualityInput = {
  detected: boolean;
  faceBox: { centerX: number; centerY: number; width: number; height: number } | null;
  nosePosition: { x: number; y: number } | null;
  blendShapes: BlendShapeScores;
  brightness: number; // 0..255
  calibrationConfidence: number;
  timestampMs: number;
};

export class QualityMonitor {
  private consecutiveNoFaceFrames = 0;
  private eyesClosedSinceMs: number | null = null;
  private noseHistory: { x: number; y: number }[] = [];
  private previousState: TrackingState = 'INITIALIZING';

  evaluate(input: QualityInput): QualityMetrics {
    let state: TrackingState;

    if (!input.detected || !input.faceBox) {
      this.consecutiveNoFaceFrames += 1;
      this.eyesClosedSinceMs = null;
      state = this.consecutiveNoFaceFrames >= NO_FACE_FRAMES_THRESHOLD ? 'NO_FACE' : this.previousState;
    } else {
      this.consecutiveNoFaceFrames = 0;

      const offCenter = Math.hypot(input.faceBox.centerX - 0.5, input.faceBox.centerY - 0.5);
      const tooSmall = input.faceBox.width < FACE_TOO_SMALL_RATIO;
      const tooLarge = input.faceBox.width > FACE_TOO_LARGE_RATIO;
      const misplaced = offCenter > FACE_OFFCENTER_THRESHOLD || tooSmall || tooLarge;

      const poorLighting = input.brightness < LOW_LIGHT_THRESHOLD || input.brightness > OVER_EXPOSED_THRESHOLD;

      const leftClosed = (input.blendShapes.eyeBlinkLeft ?? 0) > EYE_CLOSED_SCORE_THRESHOLD;
      const rightClosed = (input.blendShapes.eyeBlinkRight ?? 0) > EYE_CLOSED_SCORE_THRESHOLD;
      const eyesClosed = leftClosed && rightClosed;

      if (eyesClosed) {
        if (this.eyesClosedSinceMs === null) this.eyesClosedSinceMs = input.timestampMs;
      } else {
        this.eyesClosedSinceMs = null;
      }
      const eyesClosedDuration = this.eyesClosedSinceMs ? input.timestampMs - this.eyesClosedSinceMs : 0;

      const unstable = this.computeJitter(input.nosePosition) > JITTER_STD_THRESHOLD;

      if (misplaced) state = 'FACE_MISPLACED';
      else if (poorLighting) state = 'OCCLUDED_OR_LOW_LIGHT';
      else if (eyesClosedDuration >= EYE_CLOSED_ALERT_MS) state = 'EYES_CLOSED';
      else if (unstable) state = 'UNSTABLE';
      else state = 'TRACKING';

      const metrics: QualityMetrics = {
        trackingConfidence: this.computeTrackingConfidence(state, input),
        calibrationConfidence: input.calibrationConfidence,
        lightingScore: this.computeLightingScore(input.brightness),
        faceBoxRatio: input.faceBox.width,
        state,
        eyesClosedDurationMs: eyesClosedDuration,
      };

      this.previousState = state;
      return metrics;
    }

    this.previousState = state;
    return {
      trackingConfidence: 0,
      calibrationConfidence: input.calibrationConfidence,
      lightingScore: this.computeLightingScore(input.brightness),
      faceBoxRatio: 0,
      state,
      eyesClosedDurationMs: 0,
    };
  }

  private computeJitter(nose: { x: number; y: number } | null): number {
    if (!nose) return 0;
    this.noseHistory.push(nose);
    if (this.noseHistory.length > JITTER_WINDOW) this.noseHistory.shift();
    if (this.noseHistory.length < JITTER_WINDOW) return 0;

    const meanX = this.noseHistory.reduce((s, p) => s + p.x, 0) / this.noseHistory.length;
    const meanY = this.noseHistory.reduce((s, p) => s + p.y, 0) / this.noseHistory.length;
    const varX = this.noseHistory.reduce((s, p) => s + (p.x - meanX) ** 2, 0) / this.noseHistory.length;
    const varY = this.noseHistory.reduce((s, p) => s + (p.y - meanY) ** 2, 0) / this.noseHistory.length;
    return Math.sqrt(varX + varY);
  }

  private computeLightingScore(brightness: number): number {
    const ideal = 130;
    const distance = Math.abs(brightness - ideal) / ideal;
    return Math.max(0, 1 - distance);
  }

  private computeTrackingConfidence(state: TrackingState, input: QualityInput): number {
    if (state === 'NO_FACE') return 0;
    if (state === 'FACE_MISPLACED') return 0.15;
    if (state === 'OCCLUDED_OR_LOW_LIGHT') return 0.25;
    if (state === 'UNSTABLE') return 0.5;
    if (state === 'EYES_CLOSED') return 0.4;
    // TRACKING: kết hợp lighting score + kích thước khuôn mặt hợp lý (gần 1 khi ở khoảng cách tối ưu ~0.3-0.45).
    const sizeScore = 1 - Math.min(1, Math.abs(input.faceBox!.width - 0.35) / 0.35);
    return Math.min(1, 0.5 + this.computeLightingScore(input.brightness) * 0.25 + sizeScore * 0.25);
  }

  reset(): void {
    this.consecutiveNoFaceFrames = 0;
    this.eyesClosedSinceMs = null;
    this.noseHistory = [];
    this.previousState = 'INITIALIZING';
  }
}
