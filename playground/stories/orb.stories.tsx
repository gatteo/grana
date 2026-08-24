import { Orb, type OrbTone } from "@/registry/grana/ui/orb";
import { StatusDot } from "@/registry/grana/ui/status-dot";
import { Label, Row, Story } from "@/playground/lib/story";

const tones: { tone: OrbTone; word: string }[] = [
  { tone: "listening", word: "listening" },
  { tone: "thinking", word: "thinking" },
  { tone: "ready", word: "ready" },
  { tone: "stalled", word: "stalled" },
  { tone: "warning", word: "warning" },
];

export default function OrbStories() {
  return (
    <div>
      <Story
        title="Tones"
        note="colour says WHICH state — and never says it alone: every one is captioned"
      >
        <Row className="gap-8">
          {tones.map(({ tone, word }) => (
            <span key={tone} className="grid justify-items-center gap-3">
              <Orb tone={tone} size={96} label={`Assistant — ${word}`} />
              <Label>{word}</Label>
            </span>
          ))}
        </Row>
      </Story>

      <Story
        title="Level"
        note="one runtime input (--orb-level): breath amplitude, cloud opacity, shadow depth"
      >
        <Row className="gap-8">
          {[0, 0.25, 0.5, 0.75, 1].map((level) => (
            <span key={level} className="grid justify-items-center gap-3">
              <Orb tone="listening" level={level} size={96} label={`Listening, level ${level}`} />
              <Label>{level.toFixed(2)}</Label>
            </span>
          ))}
        </Row>
      </Story>

      <Story title="Size" note="140 in the recording sheet, 96 in a panel, 44 beside a word">
        <Row className="gap-8">
          {[44, 72, 96, 140].map((size) => (
            <span key={size} className="grid justify-items-center gap-3">
              <Orb tone="thinking" size={size} label="Assistant — thinking" />
              <Label>{size}px</Label>
            </span>
          ))}
        </Row>
      </Story>

      <Story
        title="still"
        note="a settled state holds still — nothing moves, and the sphere still reads"
      >
        <Row className="gap-8">
          <span className="grid justify-items-center gap-3">
            <Orb tone="ready" level={0.8} size={96} label="Draft ready" />
            <Label>running</Label>
          </span>
          <span className="grid justify-items-center gap-3">
            <Orb tone="ready" level={0.8} size={96} still label="Draft ready" />
            <Label>still</Label>
          </span>
          <span className="grid justify-items-center gap-3">
            <Orb tone="stalled" level={0.2} size={96} still label="Waiting for you" />
            <Label>still · stalled</Label>
          </span>
        </Row>
      </Story>

      <Story
        title="The clip, at 152 on a card"
        note="the WebKit regression case: a still orb must not leak a square past the circle"
      >
        <Row className="gap-8">
          {(["ready", "warning"] as const).map((tone) => (
            <div key={tone} className="grid justify-items-center gap-3 rounded-lg bg-card p-7">
              <Orb tone={tone} level={0.62} size={152} still label={`Settled — ${tone}`} />
              <Label>still · {tone}</Label>
            </div>
          ))}
          <div className="grid justify-items-center gap-3 rounded-lg bg-card p-7">
            <Orb tone="ready" level={0.62} size={152} label="Running — ready" />
            <Label>running</Label>
          </div>
        </Row>
      </Story>

      <Story
        title="The recording sheet"
        note="the composition that makes it safe under DSN-6: the state named in words twice"
      >
        <div className="max-w-[640px] overflow-hidden rounded-lg border border-border-strong bg-card">
          <div className="flex items-center gap-2.5 border-b border-border px-[22px] py-[13px]">
            <span className="text-[12.5px] font-medium">Luminars</span>
            <span className="num ml-auto text-[11px] text-faint">06:41</span>
          </div>
          <div className="flex flex-col items-center gap-4 px-[26px] pt-[30px] pb-[22px]">
            <Orb tone="listening" level={0.72} label="Recording — listening to you" />
            <h2 className="voice text-center text-[23px] leading-[1.2] tracking-[-0.014em]">
              Sto ascoltando. Racconta mentre lo fai.
            </h2>
            <p className="max-w-[60ch] text-center text-13 leading-[1.6] text-muted-foreground">
              Registrazione in corso: schermo e narrazione. Puoi mettere in pausa quando vuoi, e
              niente lascia questo computer finché non lo decidi tu.
            </p>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <StatusDot tone="attention" live />
              Recording
            </span>
          </div>
        </div>
      </Story>

      <Story title="On a deeper ground" note="the ball mixes toward --card, so it needs a card under it">
        <Row className="gap-8">
          <div className="rounded-lg bg-canvas-deep p-8">
            <Orb tone="warning" level={0.6} size={96} label="Attention needed" />
          </div>
          <div className="rounded-lg bg-card p-8">
            <Orb tone="warning" level={0.6} size={96} label="Attention needed" />
          </div>
        </Row>
      </Story>
    </div>
  );
}
