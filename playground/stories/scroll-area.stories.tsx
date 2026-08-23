import { ScrollArea, ScrollBar } from "@/registry/grana/ui/scroll-area";
import { Label, Row, Story } from "@/playground/lib/story";

const steps = Array.from({ length: 24 }, (_, i) => ({
  n: i + 1,
  label: [
    "Apri il gestionale",
    "Filtra le fatture del mese",
    "Esporta il CSV",
    "Confronta con l'estratto conto",
    "Segna le differenze",
    "Invia il riepilogo",
  ][i % 6],
}));

export default function ScrollAreaStories() {
  return (
    <div>
      <Story title="Vertical" note="a quiet overlay scrollbar: stone-300 thumb on a transparent track, painted only on overflow">
        <Row className="items-start">
          <ScrollArea className="h-56 w-72 rounded-md border border-border bg-card">
            <ol className="p-1">
              {steps.map((s) => (
                <li key={s.n} className="flex items-center gap-3 rounded-sm px-2.5 py-1.5 text-13">
                  <span className="num w-5 text-right text-xs text-faint">{s.n}</span>
                  <span className="truncate">{s.label}</span>
                </li>
              ))}
            </ol>
          </ScrollArea>
          <Label>h-56 · 24 rows</Label>
        </Row>
      </Story>

      <Story title="Horizontal" note="explicit ScrollBar orientation=horizontal">
        <ScrollArea className="w-96 rounded-md border border-border bg-card whitespace-nowrap">
          <div className="flex w-max gap-2 p-3">
            {steps.slice(0, 12).map((s) => (
              <div key={s.n} className="w-40 shrink-0 rounded-sm border border-border p-3 text-13">
                <span className="num block text-xs text-faint">passo {s.n}</span>
                {s.label}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Story>
    </div>
  );
}
