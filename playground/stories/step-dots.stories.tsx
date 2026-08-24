import { useState } from "react";

import { StepDots } from "@/registry/grana/ui/step-dots";
import { Button } from "@/registry/grana/ui/button";
import { Label, Row, Story } from "@/playground/lib/story";

const STEPS = [
  {
    title: "Cosa viene registrato",
    body: "Lo schermo e la tua voce, su questo computer. Niente parte da qui finché non lo decidi tu.",
  },
  {
    title: "Racconta mentre lo fai",
    body: "Parla come se stessi spiegando a un collega: le ragioni non sono nello schermo.",
  },
  {
    title: "Tre modi di mostrarlo",
    body: "Fallo davvero, oppure descrivilo, oppure fai un misto dei due.",
  },
  {
    title: "Cosa stai per fare?",
    body: "Una riga basta. Serve a Luminars per sapere dove guardare.",
  },
];

export default function StepDotsStories() {
  const [at, setAt] = useState(1);
  const step = STEPS[at]!;

  return (
    <div>
      <Story title="Positions" note="5px dots; the one you are on stretches to a 17px bar in the ink">
        <div className="grid gap-3">
          {[0, 1, 2, 3].map((current) => (
            <Row key={current} className="gap-4">
              <StepDots count={4} current={current} label={`Passaggio ${current + 1} di 4`} />
              <Label>step {current + 1} of 4</Label>
            </Row>
          ))}
        </div>
      </Story>

      <Story title="Counts" note="two to seven; the group is the only thing that changes width">
        <div className="grid gap-3">
          {[2, 3, 5, 7].map((count) => (
            <Row key={count} className="gap-4">
              <StepDots count={count} current={1} label={`Passaggio 2 di ${count}`} />
              <Label>{count} steps</Label>
            </Row>
          ))}
        </div>
      </Story>

      <Story title="Fallback label" note="English, and only so a stepper is never unnamed">
        <Row>
          <StepDots count={4} current={2} />
        </Row>
      </Story>

      <Story
        title="The stepped modal"
        note="the stepper lives in the footer, left, so the one primary action stays alone on the right"
      >
        <div className="w-[600px] overflow-hidden rounded-lg border border-border-strong bg-card shadow-panel">
          <div className="grid gap-2 px-[26px] pt-[26px] pb-[22px]">
            <h2 className="voice text-[19px] tracking-[-0.012em]">{step.title}</h2>
            <p className="max-w-[52ch] text-13 leading-[1.6] text-muted-foreground">{step.body}</p>
          </div>
          <div className="flex items-center gap-2.5 border-t border-border bg-surface-2 px-5 py-[13px]">
            <StepDots count={STEPS.length} current={at} label={`Passaggio ${at + 1} di ${STEPS.length}`} />
            <span className="flex-1" />
            <Button size="sm" onClick={() => setAt((v) => Math.max(0, v - 1))}>
              Indietro
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setAt((v) => Math.min(STEPS.length - 1, v + 1))}
            >
              {at === STEPS.length - 1 ? "Inizia" : "Avanti"}
            </Button>
          </div>
        </div>
      </Story>
    </div>
  );
}
