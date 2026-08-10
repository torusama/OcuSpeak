import { leastSquaresFit } from './leastSquares';
import type { CalibrationMethod, CalibrationPointResult, CalibrationProfile, Point2D } from './types';
import type { RawGazeFeature } from './gazeEstimation';

function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stdDev(values: number[], avg: number): number {
  return Math.sqrt(mean(values.map((v) => (v - avg) ** 2)));
}

/** Đặc trưng đa thức bậc 2 [1, x, y, x², y², xy] — dùng cho 9 điểm để bù méo phi tuyến do góc nhìn camera. */
function polynomialFeatures(raw: RawGazeFeature): number[] {
  return [1, raw.x, raw.y, raw.x * raw.x, raw.y * raw.y, raw.x * raw.y];
}

/** Đặc trưng affine bậc 1 [1, x, y] — dùng cho 5 điểm (ít điểm hơn số hệ số bậc 2 cần). */
function affineFeatures(raw: RawGazeFeature): number[] {
  return [1, raw.x, raw.y];
}

export class CalibrationEngine {
  private method: CalibrationMethod = '5-point';
  private pointTargets: Point2D[] = [];
  private samplesByPoint: RawGazeFeature[][] = [];
  private currentPointIndex = 0;

  begin(method: CalibrationMethod, targets: Point2D[]): void {
    this.method = method;
    this.pointTargets = targets;
    this.samplesByPoint = targets.map(() => []);
    this.currentPointIndex = 0;
  }

  get activePointIndex(): number {
    return this.currentPointIndex;
  }

  get totalPoints(): number {
    return this.pointTargets.length;
  }

  /** Gọi liên tục trong lúc trẻ đang nhìn vào điểm hiện tại (Patient Web quyết định khi nào đủ mẫu để sang điểm kế). */
  addSample(raw: RawGazeFeature): number {
    this.samplesByPoint[this.currentPointIndex].push(raw);
    return this.samplesByPoint[this.currentPointIndex].length;
  }

  advanceToNextPoint(): boolean {
    if (this.currentPointIndex >= this.pointTargets.length - 1) return false;
    this.currentPointIndex += 1;
    return true;
  }

  /** Hoàn tất hiệu chỉnh: hồi quy raw-gaze -> screen, tính độ tin cậy tổng hợp. */
  finish(): CalibrationProfile {
    const featureFn = this.method === '9-point' ? polynomialFeatures : affineFeatures;

    const pointResults: CalibrationPointResult[] = this.pointTargets.map((screen, i) => {
      const samples = this.samplesByPoint[i];
      const xs = samples.map((s) => s.x);
      const ys = samples.map((s) => s.y);
      const meanX = mean(xs);
      const meanY = mean(ys);
      return {
        screen,
        rawMean: { x: meanX, y: meanY },
        rawStdDev: { x: stdDev(xs, meanX), y: stdDev(ys, meanY) },
        sampleCount: samples.length,
      };
    });

    const features = pointResults.map((p) => featureFn(p.rawMean));
    const targetsX = pointResults.map((p) => p.screen.x);
    const targetsY = pointResults.map((p) => p.screen.y);

    const coeffX = leastSquaresFit(features, targetsX);
    const coeffY = leastSquaresFit(features, targetsY);

    // Sai số hồi quy (residual) — càng nhỏ, ánh xạ càng khớp dữ liệu hiệu chỉnh.
    let squaredError = 0;
    pointResults.forEach((p, i) => {
      const predictedX = features[i].reduce((sum, f, k) => sum + f * coeffX[k], 0);
      const predictedY = features[i].reduce((sum, f, k) => sum + f * coeffY[k], 0);
      squaredError += (predictedX - p.screen.x) ** 2 + (predictedY - p.screen.y) ** 2;
    });
    const rmse = Math.sqrt(squaredError / pointResults.length);

    // Phương sai trung bình của mẫu thô tại mỗi điểm — trẻ nhìn không ổn định sẽ có phương sai cao.
    const avgVariance = mean(pointResults.flatMap((p) => [p.rawStdDev.x, p.rawStdDev.y]));

    const fitConfidence = clamp01(1 - rmse * 4);
    const stabilityConfidence = clamp01(1 - avgVariance * 8);
    const confidence = clamp01(fitConfidence * 0.6 + stabilityConfidence * 0.4);

    return {
      method: this.method,
      points: pointResults,
      transformCoefficients: { x: coeffX, y: coeffY },
      confidence,
      createdAt: new Date().toISOString(),
    };
  }
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** Áp dụng hồ sơ hiệu chỉnh đã lưu để chuyển raw-gaze hiện tại -> toạ độ màn hình. */
export function applyCalibration(profile: CalibrationProfile, raw: RawGazeFeature): Point2D {
  const featureFn = profile.method === '9-point' ? polynomialFeatures : affineFeatures;
  const features = featureFn(raw);
  const x = features.reduce((sum, f, k) => sum + f * profile.transformCoefficients.x[k], 0);
  const y = features.reduce((sum, f, k) => sum + f * profile.transformCoefficients.y[k], 0);
  return { x: clamp01(x), y: clamp01(y) };
}
