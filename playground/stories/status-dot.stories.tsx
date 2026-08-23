import { StatusDot, type StatusTone } from "@/registry/grana/ui/status-dot";
import { Label, Row, Story } from "@/playground/lib/story";

const tones: StatusTone[] = ["ok", "attention", "serious", "warning", "info", "quiet"];

export default function StatusDotStories() {
  return (
    <div>
      <Story title="Tones" note="7px; always beside a word the caller owns">
        <Row className="gap-6">
          {tones.map((t) => (
            <span key={t} className="inline-flex items-center gap-2 text-13">
              <StatusDot tone={t} />
              <Label>{t}</Label>
            </span>
          ))}
        </Row>
      </Story>

      <Story title="Live" note="only a dot reporting something LIVE breathes (1.4s)">
        <Row className="gap-6">
          <span className="inline-flex items-center gap-2 text-13 text-muted-foreground">
            <StatusDot tone="ok" live />
            Registrazione in corso
          </span>
          <span className="inline-flex items-center gap-2 text-13 text-muted-foreground">
            <StatusDot tone="info" live />
            Sincronizzazione
          </span>
        </Row>
      </Story>

      <Story title="Sizes" note="6px inside a Chip, 7px standalone, larger on request">
        <Row className="gap-6">
          <StatusDot tone="ok" size={6} />
          <StatusDot tone="ok" />
          <StatusDot tone="ok" size={9} />
        </Row>
      </Story>

      <Story title="Accessible label" note="a dot that must carry its own meaning gets role=img + label">
        <Row>
          <table className="text-13">
            <thead>
              <tr className="text-left">
                <th className="eyebrow pr-6 font-medium">Connettore</th>
                <th className="eyebrow font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Asana", "ok", "Connesso"],
                ["Linear", "warning", "Token in scadenza"],
                ["Notion", "attention", "Disconnesso"],
              ].map(([name, tone, label]) => (
                <tr key={name}>
                  <td className="py-1 pr-6">{name}</td>
                  <td className="py-1">
                    <StatusDot tone={tone as StatusTone} label={label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Row>
      </Story>

      <Story title="The sidebar status pill" note="the Luminars shell composition: pill · dot · word">
        <Row>
          <span className="inline-flex items-center gap-[7px] rounded-full border border-border bg-card px-3 py-1.5 text-[12.5px] text-muted-foreground">
            <StatusDot tone="ok" live />
            Motore attivo
          </span>
          <span className="inline-flex items-center gap-[7px] rounded-full border border-border bg-card px-3 py-1.5 text-[12.5px] text-muted-foreground">
            <StatusDot tone="serious" />
            Offline — ultimo sync 09:41
          </span>
        </Row>
      </Story>
    </div>
  );
}
