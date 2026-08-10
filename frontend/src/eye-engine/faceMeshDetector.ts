import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from '@mediapipe/tasks-vision';

/**
 * Bọc FaceLandmarker của Google (@mediapipe/tasks-vision).
 * Model 478 điểm này đã bao gồm sẵn iris (không cần cờ refineLandmarks như
 * FaceMesh cũ) và trả kèm 52 "blendshape" biểu cảm khuôn mặt — dùng trực tiếp
 * cho việc phát hiện mắt nhắm kéo dài & biểu cảm khó chịu thay vì tự tính
 * bằng landmark thô, giảm sai số đáng kể.
 *
 * Model & wasm runtime được tải trực tiếp từ CDN chính thức của Google
 * (storage.googleapis.com/mediapipe-*), chạy suy luận ngay trên thiết bị
 * (không gửi khung hình camera lên máy chủ nào).
 */

const WASM_BASE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// Chỉ số landmark quan trọng trong model 478 điểm của MediaPipe Face Landmarker.
export const LANDMARK_INDEX = {
  leftIrisCenter: 468,
  rightIrisCenter: 473,
  leftEyeInnerCorner: 133,
  leftEyeOuterCorner: 33,
  leftEyeTop: 159,
  leftEyeBottom: 145,
  rightEyeInnerCorner: 362,
  rightEyeOuterCorner: 263,
  rightEyeTop: 386,
  rightEyeBottom: 374,
  noseTip: 1,
  faceLeft: 234,
  faceRight: 454,
  faceTop: 10,
  faceBottom: 152,
} as const;

export type BlendShapeScores = Record<string, number>;

export type FrameDetection = {
  landmarks: { x: number; y: number; z: number }[] | null;
  blendShapes: BlendShapeScores;
  /** 0..1 — MediaPipe không trả "confidence" trực tiếp cho face landmarker; ta suy ra từ việc có phát hiện được mặt hay không cộng độ ổn định. */
  detected: boolean;
};

export class FaceMeshDetector {
  private landmarker: FaceLandmarker | null = null;

  async load(): Promise<void> {
    const filesetResolver = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
    this.landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: false,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }

  detect(video: HTMLVideoElement, timestampMs: number): FrameDetection {
    if (!this.landmarker) {
      throw new Error('FaceMeshDetector chưa được load(). Gọi load() trước khi detect().');
    }

    const result: FaceLandmarkerResult = this.landmarker.detectForVideo(video, timestampMs);

    if (!result.faceLandmarks?.length) {
      return { landmarks: null, blendShapes: {}, detected: false };
    }

    const blendShapes: BlendShapeScores = {};
    result.faceBlendshapes?.[0]?.categories.forEach((category) => {
      blendShapes[category.categoryName] = category.score;
    });

    return {
      landmarks: result.faceLandmarks[0],
      blendShapes,
      detected: true,
    };
  }

  close(): void {
    this.landmarker?.close();
    this.landmarker = null;
  }
}
