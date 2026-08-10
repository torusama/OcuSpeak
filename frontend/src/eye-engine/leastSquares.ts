/**
 * Giải hệ phương trình tuyến tính bằng khử Gauss — đủ dùng cho ma trận nhỏ
 * (5-9 điểm calibration, tối đa 6 hệ số). Không cần thêm thư viện toán ngoài,
 * giữ engine gọn nhẹ để nhúng vào Patient Web.
 */
function solveLinearSystem(a: number[][], b: number[]): number[] {
  const n = a.length;
  const matrix = a.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
    }
    [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];

    const pivotValue = matrix[col][col];
    if (Math.abs(pivotValue) < 1e-10) continue; // Ma trận suy biến — bỏ qua, trả nghiệm gần đúng.

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = matrix[row][col] / pivotValue;
      for (let k = col; k <= n; k++) {
        matrix[row][k] -= factor * matrix[col][k];
      }
    }
  }

  return matrix.map((row, i) => (Math.abs(row[i]) < 1e-10 ? 0 : row[n] / row[i]));
}

/**
 * Hồi quy tuyến tính bình phương tối thiểu: tìm coefficients sao cho
 * features · coefficients ≈ targets, dùng phương trình chuẩn (normal equations)
 * Aᵀ·A·c = Aᵀ·b.
 */
export function leastSquaresFit(features: number[][], targets: number[]): number[] {
  const numFeatures = features[0].length;

  const ata: number[][] = Array.from({ length: numFeatures }, () => new Array(numFeatures).fill(0));
  const atb: number[] = new Array(numFeatures).fill(0);

  for (let row = 0; row < features.length; row++) {
    for (let i = 0; i < numFeatures; i++) {
      atb[i] += features[row][i] * targets[row];
      for (let j = 0; j < numFeatures; j++) {
        ata[i][j] += features[row][i] * features[row][j];
      }
    }
  }

  return solveLinearSystem(ata, atb);
}
