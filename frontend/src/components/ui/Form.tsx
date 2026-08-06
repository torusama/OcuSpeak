import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: boolean }>(
  function Input({ className, error, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-12 w-full rounded-2xl border-2 border-ocu-border bg-white px-4 font-bold text-ocu-ink placeholder:font-semibold placeholder:text-ocu-muted focus:border-ocu-blue disabled:bg-ocu-soft disabled:text-ocu-muted',
          error && 'border-ocu-red',
          className
        )}
        {...props}
      />
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }>(
  function Textarea({ className, error, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-28 w-full resize-y rounded-2xl border-2 border-ocu-border bg-white px-4 py-3 font-bold text-ocu-ink placeholder:font-semibold placeholder:text-ocu-muted focus:border-ocu-blue disabled:bg-ocu-soft disabled:text-ocu-muted',
          error && 'border-ocu-red',
          className
        )}
        {...props}
      />
    );
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-12 w-full rounded-2xl border-2 border-ocu-border bg-white px-4 font-bold text-ocu-ink focus:border-ocu-blue disabled:bg-ocu-soft',
        className
      )}
      {...props}
    />
  );
});

export function Field({
  label,
  hint,
  error,
  children,
  required
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-black text-ocu-ink">
        {label}
        {required && <span className="text-ocu-red" aria-label="bắt buộc">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-2 block text-sm font-bold text-ocu-red">{error}</span>
      ) : hint ? (
        <span className="mt-2 block text-sm font-semibold text-ocu-muted">{hint}</span>
      ) : null}
    </label>
  );
}
