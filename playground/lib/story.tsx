import type { ReactNode } from "react";

/** One titled block in a story. */
export function Story({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3 border-t border-border py-6 first:border-t-0">
      <header className="flex items-baseline gap-3">
        <h3 className="text-13 font-medium">{title}</h3>
        {note ? <p className="text-xs text-faint">{note}</p> : null}
      </header>
      {children}
    </section>
  );
}

/** A wrapping row of examples, baseline-aligned. */
export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={["flex flex-wrap items-center gap-3", className].filter(Boolean).join(" ")}>{children}</div>;
}

/** A mono caption under or beside an example. */
export function Label({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}
