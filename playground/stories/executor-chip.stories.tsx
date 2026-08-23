import { Badge } from "@/registry/grana/ui/badge";
import { ExecutorChip, type Executor } from "@/registry/grana/ui/executor-chip";
import { Label, Row, Story } from "@/playground/lib/story";

/* The words are the product's (i18n `flow.exec.*`, the console's step list) — the chip never
 * carries copy of its own. */
const executors: { executor: Executor; label: string }[] = [
  { executor: "agent", label: "AI step" },
  { executor: "human", label: "Your step" },
  { executor: "api", label: "Connected tool" },
  { executor: "screen", label: "Screen step" },
  { executor: "wait", label: "Waits until" },
];

const steps: { n: number; intent: string; executor: Executor; label: string; gate?: boolean; inferred?: boolean }[] = [
  { n: 1, intent: "Open the team's Linear board and read every issue closed since Monday.", executor: "screen", label: "Screen step" },
  { n: 2, intent: "Pull the week's calendar: meetings held, who attended, anything cancelled.", executor: "api", label: "Connected tool" },
  { n: 3, intent: "Draft the update — three shipped, one slipped, the open question for the owner.", executor: "agent", label: "AI step", inferred: true },
  { n: 4, intent: "Read the draft; change anything that reads wrong before it goes out.", executor: "human", label: "Your step", gate: true },
  { n: 5, intent: "Hold until Friday 17:00 Europe/Rome.", executor: "wait", label: "Waits until" },
];

export default function ExecutorChipStories() {
  return (
    <div>
      <Story title="Executors · md (default)" note="the console step row: 11.5px; agent is DASHED — an inferred AI step">
        <Row>
          {executors.map((e) => (
            <ExecutorChip key={e.executor} executor={e.executor} label={e.label} />
          ))}
        </Row>
        <Row>
          {executors.map((e) => (
            <Label key={e.executor}>{e.executor}</Label>
          ))}
        </Row>
      </Story>

      <Story title="Executors · sm" note="the flow node chip: 10.5px, 2px 9px">
        <Row>
          {executors.map((e) => (
            <ExecutorChip key={e.executor} executor={e.executor} label={e.label} size="sm" />
          ))}
        </Row>
      </Story>

      <Story title="With a dot" note="dot: a 6px dot in the executor's hue before the word (off by default)">
        <Row>
          {executors.map((e) => (
            <ExecutorChip key={e.executor} executor={e.executor} label={e.label} dot />
          ))}
        </Row>
        <Row>
          {executors.map((e) => (
            <ExecutorChip key={e.executor} executor={e.executor} label={e.label} dot size="sm" />
          ))}
        </Row>
      </Story>

      <Story title="Next to text" note="baseline in a sentence and beside a Badge">
        <Row>
          <span className="text-13">
            Step 3 is an <ExecutorChip executor="agent" label="AI step" size="sm" /> that drafts the update, then{" "}
            <ExecutorChip executor="human" label="Your step" size="sm" /> reads it.
          </span>
        </Row>
        <Row>
          <span className="text-13 font-medium">Draft the weekly update</span>
          <ExecutorChip executor="agent" label="AI step" />
          <Badge variant="dashed">Inferred</Badge>
          <span className="num text-xs text-muted-foreground">3/5</span>
        </Row>
      </Story>

      <Story title="In a step list" note="the console's step rows: index · intent · executor (+ gate), hairline between">
        <div className="max-w-[720px] divide-y divide-border rounded-md border border-border bg-card">
          {steps.map((s) => (
            <div key={s.n} className="grid grid-cols-[36px_1fr_auto] items-start gap-3 px-4 py-3">
              <span className="num pt-0.5 text-xs text-faint">{s.n}</span>
              <span className="text-[13.5px] leading-[1.5]">{s.intent}</span>
              <span className="inline-flex flex-wrap justify-end gap-1.5">
                <ExecutorChip executor={s.executor} label={s.label} />
                {s.gate ? <Badge>Gate</Badge> : null}
                {s.inferred ? <Badge variant="dashed">Inferred</Badge> : null}
              </span>
            </div>
          ))}
        </div>
      </Story>

      <Story title="In a flow node" note="the canvas step node: index · sm chip · gate mark, then the clamped intent">
        <Row>
          {steps.slice(1, 4).map((s) => (
            <div key={s.n} className="w-[260px] rounded-md border border-border bg-card px-3.5 py-3 text-13 shadow-card">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="num text-[11px] text-faint">{s.n}</span>
                <ExecutorChip executor={s.executor} label={s.label} size="sm" />
                {s.gate ? (
                  <span className="ml-auto text-[11px] text-muted-foreground" title="Ask me first">
                    ⏸
                  </span>
                ) : null}
              </div>
              <div className="line-clamp-3 leading-[1.45]">{s.intent}</div>
            </div>
          ))}
        </Row>
      </Story>

      <Story title="Italian-length labels">
        <Row>
          <ExecutorChip executor="agent" label="Passaggio dell'assistente" />
          <ExecutorChip executor="human" label="Aspetta la tua conferma" />
          <ExecutorChip executor="api" label="Strumento collegato" />
          <ExecutorChip executor="screen" label="Passaggio sullo schermo" />
          <ExecutorChip executor="wait" label="In attesa fino a venerdì" />
        </Row>
      </Story>

      <Story title="Rendered as a button" note="useRender — the same skin on an interactive element (the inspector's executor picker)">
        <Row>
          <ExecutorChip executor="api" label="Connected tool" render={<button type="button" aria-pressed="true" />} />
          <ExecutorChip executor="agent" label="AI step" render={<button type="button" aria-pressed="false" />} />
        </Row>
      </Story>
    </div>
  );
}
