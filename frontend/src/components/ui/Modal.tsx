import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

export function Modal({ open, onClose, title, description, children, footer }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ocu-ink/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-[26px] border-2 border-white/70 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b-2 border-ocu-border p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-black text-ocu-ink">{title}</h2>
            {description && <p className="mt-2 text-sm font-semibold leading-relaxed text-ocu-muted">{description}</p>}
          </div>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-ocu-muted hover:bg-ocu-soft hover:text-ocu-ink" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </header>
        <div className="p-5 sm:p-6">{children}</div>
        {footer && <footer className="border-t-2 border-ocu-border p-5 sm:p-6">{footer}</footer>}
      </div>
    </div>
  );
}
