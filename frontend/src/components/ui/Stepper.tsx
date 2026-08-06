import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Stepper({ steps, currentIndex }: { steps: string[]; currentIndex: number }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const completed = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step} className={cn('rounded-2xl border-2 p-3', completed ? 'border-ocu-green bg-ocu-green/12' : active ? 'border-ocu-indigo bg-ocu-indigo/8' : 'border-ocu-border bg-white')}>
            <div className="flex items-center gap-3">
              <span className={cn('grid h-8 w-8 place-items-center rounded-full text-sm font-black', completed ? 'bg-ocu-green text-ocu-ink' : active ? 'bg-ocu-indigo text-white' : 'bg-ocu-soft text-ocu-muted')}>
                {completed ? <Check size={16} /> : index + 1}
              </span>
              <span className="text-sm font-black text-ocu-ink">{step}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
