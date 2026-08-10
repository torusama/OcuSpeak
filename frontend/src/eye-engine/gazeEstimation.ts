import { LANDMARK_INDEX } from './faceMeshDetector';

type Landmark = { x: number; y: number; z: number };

/**
 * Ước lượng hướng nhìn (gaze) theo phương pháp "iris-to-eye-corner ratio":
 * với mỗi mắt, tính vị trí tương đối của tâm iris trong hình chữ nhật tạo bởi
 * 4 mốc khoé mắt/mí mắt (trong khoảng 0..1). Khi mống mắt lệch về phía nào,
 * tỉ lệ lệch về phía đó — đây là phương pháp kinh điển, đủ chính xác cho AAC
 * eye-gaze mà không cần huấn luyện mô hình riêng.
 *
 * Kết quả 2 mắt được lấy trung bình để giảm nhiễu do góc nghiêng đầu nhẹ.
 */

function eyeGazeRatio(landmarks: Landmark[], irisIdx: number, innerIdx: number, outerIdx: number, topIdx: number, bottomIdx: number) {
  const iris = landmarks[irisIdx];
  const inner = landmarks[innerIdx];
  const outer = landmarks[outerIdx];
  const top = landmarks[topIdx];
  const bottom = landmarks[bottomIdx];

  const left = Math.min(inner.x, outer.x);
  const right = Math.max(inner.x, outer.x);
  const eyeWidth = right - left || 1e-6;

  const eyeTop = Math.min(top.y, bottom.y);
  const eyeBottom = Math.max(top.y, bottom.y);
  const eyeHeight = eyeBottom - eyeTop || 1e-6;

  return {
    x: (iris.x - left) / eyeWidth, // 0 = nhìn hẳn sang một bên, 1 = phía đối diện
    y: (iris.y - eyeTop) / eyeHeight,
  };
}

export type RawGazeFeature = { x: number; y: number };

export function estimateRawGaze(landmarks: Landmark[]): RawGazeFeature {
  const left = eyeGazeRatio(
    landmarks,
    LANDMARK_INDEX.leftIrisCenter,
    LANDMARK_INDEX.leftEyeInnerCorner,
    LANDMARK_INDEX.leftEyeOuterCorner,
    LANDMARK_INDEX.leftEyeTop,
    LANDMARK_INDEX.leftEyeBottom,
  );
  const right = eyeGazeRatio(
    landmarks,
    LANDMARK_INDEX.rightIrisCenter,
    LANDMARK_INDEX.rightEyeInnerCorner,
    LANDMARK_INDEX.rightEyeOuterCorner,
    LANDMARK_INDEX.rightEyeTop,
    LANDMARK_INDEX.rightEyeBottom,
  );

  return {
    x: (left.x + right.x) / 2,
    y: (left.y + right.y) / 2,
  };
}

/** Bounding box khuôn mặt chuẩn hoá theo kích thước khung hình (0..1) — dùng để phát hiện khuôn mặt lệch/quá gần/quá xa. */
export function estimateFaceBox(landmarks: Landmark[]) {
  const left = landmarks[LANDMARK_INDEX.faceLeft];
  const right = landmarks[LANDMARK_INDEX.faceRight];
  const top = landmarks[LANDMARK_INDEX.faceTop];
  const bottom = landmarks[LANDMARK_INDEX.faceBottom];

  const width = Math.abs(right.x - left.x);
  const height = Math.abs(bottom.y - top.y);
  const centerX = (left.x + right.x) / 2;
  const centerY = (top.y + bottom.y) / 2;

  return { centerX, centerY, width, height };
}
