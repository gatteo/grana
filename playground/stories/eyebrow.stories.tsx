import { Eyebrow, SectionHead } from "@/registry/grana/ui/eyebrow";
import { Label, Row, Story } from "@/playground/lib/story";

export default function EyebrowStories() {
  return (
    <>
      <Story title="Sizes" note="xs 9.5 · sm 10 · md 10.5 (default, the `eyebrow` utility) · lg 12 / .14em (marketing)">
        <div className="grid gap-2">
          {(["xs", "sm", "md", "lg"] as const).map((s) => (
            <Row key={s}>
              <span className="w-8 text-xs text-faint">{s}</span>
              <Eyebrow size={s}>Trattative aperte</Eyebrow>
            </Row>
          ))}
        </div>
      </Story>

      <Story
        title="The nav register"
        note="a sidebar group label at the mono recipe reads as heavy as the rows it labels. register='nav' drops to the text face at 10px/400 — measured on the Luminars shell 2026-08-24"
      >
        <div className="grid w-[252px] gap-5 rounded-md bg-canvas p-3.5">
          {(["mono", "nav"] as const).map((register) => (
            <div key={register} className="flex flex-col gap-0.5">
              <Eyebrow register={register} className="block px-2 pb-1.5">
                Work
              </Eyebrow>
              {["Home", "Processes", "Runs"].map((row) => (
                <span
                  key={row}
                  className="rounded-sm px-2 py-[5px] text-13 text-muted-foreground"
                >
                  {row}
                </span>
              ))}
            </div>
          ))}
        </div>
      </Story>

      <Story title="Numbered index" note="the RF survey-document eyebrow: the index in the warm accent before the label">
        <Row>
          <Eyebrow size="lg" index="01">
            Il problema
          </Eyebrow>
          <Eyebrow size="lg" index="02">
            Come funziona
          </Eyebrow>
          <Eyebrow index="03">Risultati</Eyebrow>
        </Row>
      </Story>

      <Story title="Unit tints" note="RF only: the label takes the unit's ink; on Luminars the tints resolve to stone-700">
        <Row>
          <Eyebrow tint="demand">Demand</Eyebrow>
          <Eyebrow tint="piattaforma">Piattaforma</Eyebrow>
          <Eyebrow tint="academy">Academy</Eyebrow>
          <Eyebrow tint="installatori">Installatori</Eyebrow>
        </Row>
      </Story>

      <Story title="As a heading element" note="render={<h2 />} keeps the outline honest">
        <Row>
          <Eyebrow render={<h2 />}>Ultime esecuzioni</Eyebrow>
          <Label>h2</Label>
        </Row>
      </Story>

      <Story title="SectionHead · start" note="marketing: eyebrow + display h2 + lead with the measure rules">
        <div className="rounded-lg border border-border bg-background p-8">
          <SectionHead
            index="02"
            eyebrow="Come funziona"
            title="Il tuo lavoro, raccontato mentre lo fai."
            lead="Registra una sessione, rispondi a tre domande, e la procedura è scritta. Niente moduli, niente wiki da aggiornare: la conoscenza tacita diventa un documento che il team può eseguire."
          />
          <div className="h-12 rounded-md border border-dashed border-border-strong" />
        </div>
      </Story>

      <Story title="SectionHead · center, serif lead">
        <div className="rounded-lg border border-border bg-background p-8">
          <SectionHead
            align="center"
            index="04"
            eyebrow="Risultati"
            title="Meno riunioni. Più decisioni."
            lead="Nelle ultime trenta trattative perse, undici si sono fermate allo stesso passo. Ora lo sappiamo."
            serifLead
          />
        </div>
      </Story>
    </>
  );
}
