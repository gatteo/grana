import { SparklesIcon } from "lucide-react";

import { Badge } from "@/registry/grana/ui/badge";
import { Chip } from "@/registry/grana/ui/chip";
import { Label, Row, Story } from "@/playground/lib/story";

export default function BadgeStories() {
  return (
    <div>
      <Story title="Variants" note="a Badge names a PROPERTY of the thing — its grade, its author; never a state">
        <Row>
          <Badge>Grade A</Badge>
          <Label>outline (default)</Label>
          <Badge variant="dashed">Inferred</Badge>
          <Label>dashed = inferred, not asserted</Label>
          <Badge variant="ink">New</Badge>
          <Label>ink</Label>
          <Badge variant="tag">Beta</Badge>
          <Label>tag (RF .tag)</Label>
          <Badge variant="action">Azione AI</Badge>
          <Label>action (RF .by-ai)</Label>
        </Row>
      </Story>

      <Story title="Shape override" note="pill is the Luminars default; square the RF one — either can be forced">
        <Row>
          <Badge shape="square">Grade A</Badge>
          <Badge variant="dashed" shape="square">Inferred</Badge>
          <Badge variant="ink" shape="square">New</Badge>
          <Badge variant="tag" shape="pill">Beta</Badge>
          <Badge variant="action" shape="pill">Azione AI</Badge>
        </Row>
      </Story>

      <Story title="With an icon" note="a 10px glyph before the word">
        <Row>
          <Badge variant="action">
            <SparklesIcon />
            Azione AI
          </Badge>
          <Badge variant="dashed">
            <SparklesIcon />
            Stimato
          </Badge>
        </Row>
      </Story>

      <Story title="Rendered as a link" note="useRender — the same skin on an anchor">
        <Row>
          <Badge render={<a href="#badge" />}>Vedi autore</Badge>
          <Badge variant="tag" render={<a href="#badge" />}>v3.2</Badge>
        </Row>
      </Story>

      <Story title="Italian-length labels">
        <Row>
          <Badge>Proprietario del workspace</Badge>
          <Badge variant="dashed">Rilevato automaticamente</Badge>
          <Badge variant="tag">Configurazione avanzata</Badge>
          <Badge variant="action">Generato dall&apos;assistente</Badge>
        </Row>
      </Story>

      <Story title="In a row" note="name · chip (a state) · badge (a property) · mono count">
        <div className="max-w-[640px] divide-y divide-border rounded-md border border-border bg-card">
          {[
            { name: "Weekly team update", tone: "ok" as const, state: "Pronto", badge: "Grade A", n: "12" },
            { name: "Riconciliazione fatture Q3", tone: "warning" as const, state: "In attesa", badge: "Inferred", dashed: true, n: "3" },
            { name: "Onboarding nuovo cliente", tone: "attention" as const, state: "Bloccato", badge: "Grade C", n: "148" },
          ].map((r) => (
            <div key={r.name} className="flex items-center gap-3 px-4 py-2.5 text-13">
              <span className="min-w-0 flex-1 truncate font-medium">{r.name}</span>
              <Chip tone={r.tone}>{r.state}</Chip>
              <Badge variant={r.dashed ? "dashed" : "outline"}>{r.badge}</Badge>
              <span className="num w-10 text-right text-xs text-muted-foreground">{r.n}</span>
            </div>
          ))}
        </div>
      </Story>
    </div>
  );
}
