import type { BlendShapeScores } from './faceMeshDetector';
import type { DistressScore } from './types';

const SUSTAINED_ALERT_THRESHOLD = 0.55;

/**
 * Tính điểm khó chịu (distress) 0..1 từ các blendshape biểu cảm do
 * FaceLandmarker của Google trả sẵn — không cần landmark thô, giảm nhiễu.
 * Engine chỉ TRẢ điểm số; quyết định có gọi SOS hay không thuộc về lớp
 * "SOS Pipeline" ở Patient Web (đọc "AI Engine chỉ trả dữ liệu nhận diện và
 * trạng thái, không xử lý giao diện" — và cũng không tự ý gọi hành động).
 */
export class ExpressionDistressAnalyzer {
  private sustainedSinceMs: number | null = null;

  evaluate(blendShapes: BlendShapeScores, timestampMs: number): DistressScore {
    const browFurrow = avg(blendShapes.browDownLeft, blendShapes.browDownRight);
    const mouthFrown = avg(blendShapes.mouthFrownLeft, blendShapes.mouthFrownRight);
    const eyeSquint = avg(blendShapes.eyeSquintLeft, blendShapes.eyeSquintRight);
    const jawOpen = blendShapes.jawOpen ?? 0;

    // Trọng số ưu tiên nhíu mày + mím môi/nhăn miệng — hai tín hiệu đặc trưng nhất cho khó chịu/đau ở trẻ không lời nói.
    const score = clamp01(browFurrow * 0.4 + mouthFrown * 0.3 + eyeSquint * 0.2 + jawOpen * 0.1);

    if (score >= SUSTAINED_ALERT_THRESHOLD) {
      if (this.sustainedSinceMs === null) this.sustainedSinceMs = timestampMs;
    } else {
      this.sustainedSinceMs = null;
    }

    return {
      score,
      signals: { browFurrow, mouthFrown, eyeSquint, jawOpen },
      sustainedMs: this.sustainedSinceMs ? timestampMs - this.sustainedSinceMs : 0,
      timestamp: timestampMs,
    };
  }

  reset(): void {
    this.sustainedSinceMs = null;
  }
}

function avg(a?: number, b?: number): number {
  return ((a ?? 0) + (b ?? 0)) / 2;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
