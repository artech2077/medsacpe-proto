import type { ReactNode } from "react";

type ScreenShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function ScreenShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: ScreenShellProps) {
  return (
    <main className="min-h-screen bg-[var(--surface-canvas)] px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-panel)]">
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-[var(--text-muted)] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] md:text-base">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
