import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('ui-reveal-card rounded-[22px] border-2 border-ocu-border bg-white shadow-card', className)} {...props} />;
}

export function CardHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b-2 border-ocu-border p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-1 text-xl font-black text-ocu-ink sm:text-2xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-ocu-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
