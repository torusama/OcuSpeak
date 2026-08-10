import type { VitalsSample } from './types';

/**
 * Prototype rPPG (remote photoplethysmography): mỗi nhịp tim làm da vùng trán
 * đổi màu cực nhỏ (máu bơm lên) — kênh xanh lá (green channel) camera nhạy
 * nhất với biến đổi này. Ta lấy trung bình kênh green trong vùng trán theo
 * thời gian, rồi tìm tần số dao động chính bằng DFT để suy ra nhịp tim (BPM).
 * Đây là kỹ thuật rPPG kinh điển (Verkruysse et al., 2008) — không dùng API
 * trả phí, chỉ xử lý pixel từ camera đã có.
 *
 * Lưu ý: đây là PROTOTYPE — coi vitals này là chỉ số tham khảo, không phải
 * thiết bị y tế. `signalQuality` thấp nghĩa là không nên hiển thị/tin số liệu.
 */

const SAMPLE_RATE_HZ = 30; // giả định camera ~30fps, được điều chỉnh động theo timestamp thực tế
const WINDOW_SECONDS = 10; // cửa sổ phân tích cho nhịp tim (~10s đủ cho 1-2 chu kỳ ở nhịp thấp)
const BUFFER_SIZE = SAMPLE_RATE_HZ * WINDOW_SECONDS;
const HR_BAND_HZ: [number, number] = [0.7, 3.0]; // 42-180 bpm
const BREATH_WINDOW_SECONDS = 30;
const BREATH_BUFFER_SIZE = SAMPLE_RATE_HZ * BREATH_WINDOW_SECONDS;
const BREATH_BAND_HZ: [number, number] = [0.13, 0.5]; // 8-30 nhịp thở/phút

type Sample = { value: number; timestamp: number };

export class RppgEngine {
  private greenBuffer: Sample[] = [];

  /** Gọi mỗi frame với giá trị trung bình kênh green trong vùng trán (ROI). */
  pushSample(greenMean: number, timestampMs: number): VitalsSample {
    this.greenBuffer.push({ value: greenMean, timestamp: timestampMs });
    if (this.greenBuffer.length > BREATH_BUFFER_SIZE) this.greenBuffer.shift();

    if (this.greenBuffer.length < SAMPLE_RATE_HZ * 4) {
      // Chưa đủ dữ liệu (ít nhất 4s) để ước lượng bất cứ gì đáng tin.
      return { bpm: null, breathingRatePerMin: null, signalQuality: 0, timestamp: timestampMs };
    }

    const hrWindow = this.greenBuffer.slice(-BUFFER_SIZE);
    const hrResult = this.estimateDominantFrequency(hrWindow, HR_BAND_HZ);

    let breathingRatePerMin: number | null = null;
    if (this.greenBuffer.length >= BREATH_BUFFER_SIZE) {
      const breathResult = this.estimateDominantFrequency(this.greenBuffer, BREATH_BAND_HZ);
      breathingRatePerMin = breathResult.quality > 0.3 ? breathResult.freqHz * 60 : null;
    }

    return {
      bpm: hrResult.quality > 0.35 ? Math.round(hrResult.freqHz * 60) : null,
      breathingRatePerMin: breathingRatePerMin ? Math.round(breathingRatePerMin) : null,
      signalQuality: hrResult.quality,
      timestamp: timestampMs,
    };
  }

  /**
   * DFT trực tiếp (không FFT) trên buffer — kích thước buffer nhỏ (≤900 mẫu)
   * nên đủ nhanh cho realtime mà không cần thư viện DSP ngoài.
   * Trả tần số có công suất lớn nhất trong dải [minHz, maxHz] + "quality" =
   * tỉ lệ công suất đỉnh / tổng công suất trong dải (SNR proxy).
   */
  private estimateDominantFrequency(samples: Sample[], [minHz, maxHz]: [number, number]) {
    const detrended = this.detrend(samples.map((s) => s.value));
    const durationSec = (samples[samples.length - 1].timestamp - samples[0].timestamp) / 1000;
    const effectiveRate = samples.length / Math.max(durationSec, 1);

    const freqStep = 1 / Math.max(durationSec, 1);
    let bestFreq = minHz;
    let bestPower = 0;
    let totalPower = 0;

    for (let freq = minHz; freq <= maxHz; freq += freqStep) {
      let re = 0;
      let im = 0;
      for (let n = 0; n < detrended.length; n++) {
        const angle = (2 * Math.PI * freq * n) / effectiveRate;
        re += detrended[n] * Math.cos(angle);
        im -= detrended[n] * Math.sin(angle);
      }
      const power = re * re + im * im;
      totalPower += power;
      if (power > bestPower) {
        bestPower = power;
        bestFreq = freq;
      }
    }

    const quality = totalPower > 0 ? Math.min(1, bestPower / totalPower) : 0;
    return { freqHz: bestFreq, quality };
  }

  private detrend(values: number[]): number[] {
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    // Loại trực tiếp thành phần một chiều (DC) — xấp xỉ đơn giản thay cho bandpass filter đầy đủ.
    return values.map((v) => v - mean);
  }

  reset(): void {
    this.greenBuffer = [];
  }
}

/** Trích giá trị trung bình kênh green trong vùng trán (ROI) từ khung video hiện tại. */
export function sampleForeheadGreenMean(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  faceBox: { centerX: number; centerY: number; width: number; height: number },
): number {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || video.videoWidth === 0) return 0;

  // Vùng trán: phía trên tâm khuôn mặt, rộng ~40% khuôn mặt, cao ~15%.
  const roiWidth = faceBox.width * 0.4;
  const roiHeight = faceBox.height * 0.15;
  const roiX = faceBox.centerX - roiWidth / 2;
  const roiY = faceBox.centerY - faceBox.height * 0.42;

  const sx = roiX * video.videoWidth;
  const sy = roiY * video.videoHeight;
  const sw = roiWidth * video.videoWidth;
  const sh = roiHeight * video.videoHeight;

  canvas.width = 16;
  canvas.height = 8;
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let sumGreen = 0;
  const pixelCount = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    sumGreen += data[i + 1];
  }
  return sumGreen / pixelCount;
}
