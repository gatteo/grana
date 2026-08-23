import { BotIcon } from "lucide-react";

import { Badge } from "@/registry/grana/ui/badge";
import { Chip } from "@/registry/grana/ui/chip";
import { type StatusTone } from "@/registry/grana/ui/status-dot";
import { Label, Row, Story } from "@/playground/lib/story";

const tones: { tone: StatusTone; word: string }[] = [
  { tone: "ok", word: "Pronto" },
  { tone: "attention", word: "Bloccato" },
  { tone: "serious", word: "Degradato" },
  { tone: "warning", word: "In attesa" },
  { tone: "info", word: "In corso" },
  { tone: "quiet", word: "Archiviato" },
];

export default function ChipStories() {
  return (
    <div>
      <Story title="Outline (default)" note="the Luminars pill: hairline, 6px dot + word; only the dot carries the tone">
        <Row>
          {tones.map((t) => (
            <Chip key={t.tone} tone={t.tone}>
              {t.word}
            </Chip>
          ))}
        </Row>
        <Row>
          {tones.map((t) => (
            <Label key={t.tone}>{t.tone}</Label>
          ))}
        </Row>
      </Story>

      <Story title="Tinted" note="the RF recipe: 6px radius, 12% fill, dark-tinted text, 11px glyph (neutral has none)">
        <Row>
          {tones.map((t) => (
            <Chip key={t.tone} appearance="tinted" tone={t.tone}>
              {t.word}
            </Chip>
          ))}
        </Row>
      </Story>

      <Story title="Emphasis" note="the first rung of the attention ladder: warmer ground, firmer border, medium weight">
        <Row>
          {tones.map((t) => (
            <Chip key={t.tone} tone={t.tone} emphasis>
              {t.word}
            </Chip>
          ))}
        </Row>
        <Row>
          {tones.map((t) => (
            <Chip key={t.tone} appearance="tinted" tone={t.tone} emphasis>
              {t.word}
            </Chip>
          ))}
        </Row>
      </Story>

      <Story title="No indicator" note="dot={false}: a chip naming an origin or a kind, not a state">
        <Row>
          <Chip dot={false}>Screen</Chip>
          <Chip dot={false}>Calendario</Chip>
          <Chip dot={false}>Importato</Chip>
          <Chip appearance="tinted" dot={false}>
            Demand
          </Chip>
          <Chip appearance="tinted" tone="info" dot={false}>
            Piattaforma
          </Chip>
        </Row>
      </Story>

      <Story title="Custom glyph (tinted)" note="an 11px icon in place of the tone glyph">
        <Row>
          <Chip appearance="tinted" tone="info" icon={<BotIcon />}>
            Agente
          </Chip>
        </Row>
      </Story>

      <Story title="Italian-length labels">
        <Row>
          <Chip tone="warning">In attesa di approvazione</Chip>
          <Chip tone="ok">Sincronizzato con il workspace</Chip>
          <Chip appearance="tinted" tone="attention">
            Pagamento non riuscito
          </Chip>
          <Chip appearance="tinted" tone="warning">
            Verifica documenti richiesta
          </Chip>
        </Row>
      </Story>

      <Story title="In a row" note="name · chip · badge · mono count, under both appearances">
        <div className="grid max-w-[720px] gap-6">
          {(["outline", "tinted"] as const).map((appearance) => (
            <div key={appearance} className="divide-y divide-border rounded-md border border-border bg-card">
              {[
                { name: "Acme S.p.A.", tone: "ok" as const, state: "Attivo", badge: "Enterprise", n: "1.240" },
                { name: "Bianchi Impianti", tone: "warning" as const, state: "In scadenza", badge: "Pro", n: "86" },
                { name: "Rossi Installazioni", tone: "attention" as const, state: "Sospeso", badge: "Trial", n: "4" },
                { name: "Verdi Energia", tone: "quiet" as const, state: "Archiviato", badge: "Inferred", dashed: true, n: "0" },
              ].map((r) => (
                <div key={r.name} className="flex items-center gap-3 px-4 py-2.5 text-13">
                  <span className="min-w-0 flex-1 truncate font-medium">{r.name}</span>
                  <Chip appearance={appearance} tone={r.tone}>
                    {r.state}
                  </Chip>
                  <Badge variant={r.dashed ? "dashed" : "outline"}>{r.badge}</Badge>
                  <span className="num w-12 text-right text-xs text-muted-foreground">{r.n}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Story>
    </div>
  );
}
