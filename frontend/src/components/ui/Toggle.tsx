import { cn } from '@/utils/cn';

export function Toggle({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string; disabled?: boolean }) {
  return (
    <label className={cn('flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-ocu-border bg-white p-4', disabled && 'cursor-not-allowed opacity-55')}>
      <span>
        <span className="block font-black text-ocu-ink">{label}</span>
        {description && <span className="mt-1 block text-sm font-semibold leading-relaxed text-ocu-muted">{description}</span>}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={cn('relative h-8 w-14 shrink-0 rounded-full border-2 transition-colors', checked ? 'border-ocu-green bg-ocu-green' : 'border-ocu-border bg-ocu-soft')}>
        <span className={cn('absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[27px]' : 'translate-x-[3px]')} />
      </span>
    </label>
  );
}
