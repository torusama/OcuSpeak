/**
 * Khởi tạo camera stream và gắn vào <video> element do Patient Web cung cấp.
 * Engine không tự tạo phần tử DOM nào — đúng nguyên tắc "AI Engine chỉ trả dữ
 * liệu nhận diện và trạng thái, không xử lý giao diện".
 */

export type CameraStreamOptions = {
  facingMode?: 'user' | 'environment';
  idealWidth?: number;
  idealHeight?: number;
  idealFrameRate?: number;
};

export class CameraStream {
  private stream: MediaStream | null = null;
  private ownsStream = true;

  constructor(private readonly videoEl: HTMLVideoElement) {}

  /**
   * Gắn một MediaStream ĐÃ có sẵn (ví dụ lấy từ CameraProvider của Patient Web,
   * nơi đã xin quyền camera ở màn PermissionsPage) — tránh gọi getUserMedia()
   * lần thứ hai gây xin quyền trùng/lỗi "stream đang được dùng".
   */
  async attachExisting(stream: MediaStream): Promise<void> {
    this.stream = stream;
    this.ownsStream = false;
    this.videoEl.srcObject = stream;
    this.videoEl.muted = true;
    this.videoEl.playsInline = true;
    await this.videoEl.play();
    if (this.videoEl.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise<void>((resolve) => {
        this.videoEl.addEventListener('loadedmetadata', () => resolve(), { once: true });
      });
    }
  }

  async start(options: CameraStreamOptions = {}): Promise<void> {
    this.ownsStream = true;
    const {
      facingMode = 'user',
      idealWidth = 640,
      idealHeight = 480,
      idealFrameRate = 30,
    } = options;

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        width: { ideal: idealWidth },
        height: { ideal: idealHeight },
        frameRate: { ideal: idealFrameRate },
      },
      audio: false,
    });

    this.videoEl.srcObject = this.stream;
    this.videoEl.muted = true;
    this.videoEl.playsInline = true;
    await this.videoEl.play();

    // Đợi tới khi có kích thước thật (một số trình duyệt trả metadata trễ một nhịp).
    if (this.videoEl.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise<void>((resolve) => {
        this.videoEl.addEventListener('loadedmetadata', () => resolve(), { once: true });
      });
    }
  }

  /** Độ sáng trung bình khung hình hiện tại (0..255) — dùng để phát hiện thiếu sáng/che camera. */
  sampleBrightness(canvas: HTMLCanvasElement): number {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || this.videoEl.videoWidth === 0) return 0;

    canvas.width = 32;
    canvas.height = 24;
    ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let sum = 0;
    const pixelCount = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      // Luminance theo chuẩn Rec. 601.
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    return sum / pixelCount;
  }

  stop(): void {
    if (this.ownsStream) {
      this.stream?.getTracks().forEach((track) => track.stop());
    }
    this.stream = null;
    this.videoEl.srcObject = null;
  }

  get videoElement(): HTMLVideoElement {
    return this.videoEl;
  }

  /**
   * Cam có thực sự đang phát khung hình sống hay không. Chỉ dựa vào
   * `videoEl.readyState` là KHÔNG đủ: khi track bị stop()/disable ở bên ngoài
   * (vd. người dùng bấm "Tắt camera", hoặc tắt cam ở hệ điều hành), video sẽ
   * đứng lại ở khung hình cuối cùng nhưng readyState vẫn báo "có dữ liệu" —
   * khiến AI Engine cứ phân tích lại đúng khung hình cũ như thể vẫn đang thấy mặt.
   */
  isLive(): boolean {
    if (!this.stream) return false;
    const [track] = this.stream.getVideoTracks();
    return !!track && track.readyState === 'live' && track.enabled;
  }
}
