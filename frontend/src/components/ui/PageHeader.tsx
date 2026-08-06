import type { ReactNode } from 'react';

export function PageHeader({
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
    <header className="ui-reveal-heading mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-black tracking-tight text-ocu-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-base font-semibold leading-relaxed text-ocu-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}
