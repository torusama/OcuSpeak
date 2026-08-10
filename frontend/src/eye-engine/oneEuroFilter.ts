/**
 * One Euro Filter (Casiez, Roussel, Vogel — CHI 2012).
 * Thuật toán làm mịn tín hiệu chuẩn cho gaze/mouse tracking: mượt khi đứng yên,
 * phản hồi nhanh khi di chuyển nhanh — đúng nhu cầu "Làm mịn dữ liệu gaze để
 * giảm rung và chuyển động mắt tự nhiên".
 */
class LowPassFilter {
  private y: number | null = null;
  private s: number | null = null;

  filter(value: number, alpha: number): number {
    if (this.y === null) {
      this.s = value;
    } else {
      this.s = alpha * value + (1 - alpha) * (this.s as number);
    }
    this.y = value;
    return this.s as number;
  }

  lastValue(): number | null {
    return this.s;
  }
}

function alpha(cutoff: number, dt: number): number {
  const tau = 1 / (2 * Math.PI * cutoff);
  return 1 / (1 + tau / dt);
}

export class OneEuroFilter1D {
  private xFilter = new LowPassFilter();
  private dxFilter = new LowPassFilter();
  private lastTime: number | null = null;
  private lastValue: number | null = null;

  constructor(
    private minCutoff = 1.0,
    private beta = 0.02,
    private dCutoff = 1.0,
  ) {}

  filter(value: number, timestampMs: number): number {
    if (this.lastTime === null) {
      this.lastTime = timestampMs;
      this.lastValue = value;
      this.xFilter.filter(value, 1);
      this.dxFilter.filter(0, 1);
      return value;
    }

    const dt = Math.max((timestampMs - this.lastTime) / 1000, 1 / 120);
    this.lastTime = timestampMs;

    const dx = (value - (this.lastValue as number)) / dt;
    this.lastValue = value;

    const edx = this.dxFilter.filter(dx, alpha(this.dCutoff, dt));
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    return this.xFilter.filter(value, alpha(cutoff, dt));
  }

  reset(): void {
    this.lastTime = null;
    this.lastValue = null;
  }
}

/** Bọc 2 filter 1D cho toạ độ (x, y) của gaze. */
export class OneEuroFilter2D {
  private fx: OneEuroFilter1D;
  private fy: OneEuroFilter1D;

  constructor(minCutoff = 1.0, beta = 0.02, dCutoff = 1.0) {
    this.fx = new OneEuroFilter1D(minCutoff, beta, dCutoff);
    this.fy = new OneEuroFilter1D(minCutoff, beta, dCutoff);
  }

  filter(point: { x: number; y: number }, timestampMs: number) {
    return {
      x: this.fx.filter(point.x, timestampMs),
      y: this.fy.filter(point.y, timestampMs),
    };
  }

  reset(): void {
    this.fx.reset();
    this.fy.reset();
  }
}
