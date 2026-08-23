// The preview build resolves `@/playground/lib/story` to this file. Same markup as the
// playground helper, plus: every section carries `data-ds-story="<title>"` (the validator and
// the ?story= capture key on it), a card can restrict itself to some sections
// (`window.__dsOnly`), and a section can render under the marketing surface
// (`window.__dsSurface[title] = "marketing"`).
import type { ReactNode } from "react";

declare global {
  interface Window {
    __dsOnly?: string[] | null;
    __dsSurface?: Record<string, string>;
  }
}

export function Story({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  const only = window.__dsOnly;
  if (only && only.length && !only.some((t) => t === title || t.toLowerCase() === title.toLowerCase())) return null;
  const surface = window.__dsSurface?.[title];
  const body = surface ? (
    <div data-surface={surface} className="rounded-md bg-background p-5">
      {children}
    </div>
  ) : (
    children
  );
  return (
    <section data-ds-story={title} className="grid gap-3 border-t border-border py-6 first:border-t-0">
      <header className="flex items-baseline gap-3">
        <h3 className="text-13 font-medium">{title}</h3>
        {note ? <p className="text-xs text-faint">{note}</p> : null}
      </header>
      {body}
    </section>
  );
}

export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={["flex flex-wrap items-center gap-3", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}
