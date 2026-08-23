import { useEffect, useState, type ComponentType } from "react";

/* Stories are discovered by glob: every `playground/stories/<name>.stories.tsx`
 * default-exports a component. No registration step, no merge conflicts. */
const modules = import.meta.glob<{ default: ComponentType }>("./stories/*.stories.tsx", {
  eager: true,
});

const stories = Object.entries(modules)
  .map(([path, mod]) => ({
    id: path.replace("./stories/", "").replace(".stories.tsx", ""),
    Component: mod.default,
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

type Brand = "luminars" | "rf";
type Surface = "app" | "marketing";

function useHtmlAttr<T extends string>(name: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const fromUrl = new URLSearchParams(location.search).get(name);
    return (fromUrl as T) || initial;
  });
  useEffect(() => {
    document.documentElement.setAttribute(`data-${name}`, value);
    const url = new URL(location.href);
    url.searchParams.set(name, value);
    history.replaceState(null, "", url);
  }, [name, value]);
  return [value, setValue] as const;
}

export function App() {
  const [brand, setBrand] = useHtmlAttr<Brand>("brand", "luminars");
  const [surface, setSurface] = useHtmlAttr<Surface>("surface", "app");
  const [current, setCurrent] = useState<string>(() => location.hash.slice(1) || stories[0]?.id || "");

  useEffect(() => {
    const onHash = () => setCurrent(location.hash.slice(1));
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const active = stories.find((s) => s.id === current) ?? stories[0];

  return (
    <div className="grid h-dvh grid-cols-[220px_1fr] overflow-hidden">
      <aside className="flex flex-col gap-4 overflow-y-auto border-r border-border p-4">
        <div className="grid gap-1">
          <span className="eyebrow">Grana</span>
          <strong className="font-voice text-lg">Playground</strong>
        </div>
        <div className="grid gap-2">
          <span className="eyebrow">Brand</span>
          <Switch value={brand} options={["luminars", "rf"]} onChange={setBrand} />
          <span className="eyebrow">Surface</span>
          <Switch value={surface} options={["app", "marketing"]} onChange={setSurface} />
        </div>
        <nav className="grid gap-px">
          <span className="eyebrow mb-1">Stories · {stories.length}</span>
          {stories.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={s.id === active?.id ? "page" : undefined}
              className="rounded-sm px-2 py-1 text-13 text-muted-foreground hover:bg-accent aria-[current]:bg-card aria-[current]:text-foreground aria-[current]:shadow-[inset_0_0_0_1px_var(--border)]"
            >
              {s.id}
            </a>
          ))}
        </nav>
      </aside>
      <main className="overflow-y-auto p-8">
        {active ? (
          <>
            <h2 className="mb-2 font-voice text-2xl">{active.id}</h2>
            <active.Component />
          </>
        ) : (
          <p className="text-muted-foreground">No stories yet — add `playground/stories/&lt;name&gt;.stories.tsx`.</p>
        )}
      </main>
    </div>
  );
}

function Switch<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-sm border border-border p-0.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          aria-pressed={o === value}
          className="rounded-xs px-2 py-0.5 text-xs text-muted-foreground aria-pressed:bg-secondary aria-pressed:font-medium aria-pressed:text-foreground"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
