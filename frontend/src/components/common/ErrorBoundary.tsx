import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('OcuSpeak UI error', { message: error.message, componentStack: info.componentStack });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-ocu-canvas p-6">
        <section className="max-w-lg rounded-[28px] border-2 border-ocu-border bg-white p-8 text-center shadow-card">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ocu-red text-white">
            <AlertTriangle size={34} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-ocu-ink">Giao diện gặp sự cố</h1>
          <p className="mt-3 font-semibold leading-relaxed text-ocu-muted">
            Dữ liệu camera không được gửi đi. Hãy tải lại trang để khởi tạo lại giao diện.
          </p>
          <button
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-ocu-indigo px-5 font-black text-white shadow-tactile"
            onClick={() => window.location.reload()}
          >
            <RotateCcw size={18} />
            Tải lại
          </button>
        </section>
      </main>
    );
  }
}
