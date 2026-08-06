import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type ToastTone = 'success' | 'info' | 'warning';

type ToastMessage = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  notify: (title: string, description?: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const remove = useCallback((id: number) => {
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  const notify = useCallback((title: string, description?: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.round(Math.random() * 1000);
    setMessages((current) => [...current.slice(-2), { id, title, description, tone }]);
    window.setTimeout(() => remove(id), 3600);
  }, [remove]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] ml-auto grid max-w-sm gap-3 sm:inset-x-auto sm:right-5 sm:top-5" aria-live="polite" aria-atomic="false">
        {messages.map((message) => {
          const Icon = message.tone === 'success' ? CheckCircle2 : message.tone === 'warning' ? TriangleAlert : Info;
          return (
            <div
              key={message.id}
              role="status"
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-[20px] border-2 bg-white p-4 shadow-[0_18px_50px_rgba(40,48,95,.18)]',
                message.tone === 'success' && 'border-ocu-green',
                message.tone === 'warning' && 'border-ocu-orange',
                message.tone === 'info' && 'border-ocu-blue'
              )}
            >
              <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-2xl', message.tone === 'success' ? 'bg-ocu-green/22' : message.tone === 'warning' ? 'bg-ocu-orange/25' : 'bg-ocu-blue/20')}>
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-black text-ocu-ink">{message.title}</p>
                {message.description && <p className="mt-1 text-sm font-semibold leading-relaxed text-ocu-muted">{message.description}</p>}
              </div>
              <button type="button" onClick={() => remove(message.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-ocu-muted hover:bg-ocu-soft" aria-label="Đóng thông báo">
                <X size={17} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
