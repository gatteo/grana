import type { ReactNode } from "react";

import { Button } from "@/registry/grana/ui/button";
import { SectionHead } from "@/registry/grana/ui/eyebrow";
import { Section, Wrap } from "@/registry/grana/ui/section";
import { Story } from "@/playground/lib/story";

/* The measure and the rhythm are both invisible until something is in them. */
function Cell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-img border border-border bg-card p-6">
      <h3 className="h3">{children}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Ogni modulo porta scritto il suo stato: sai cosa puoi usare oggi e cosa sta arrivando.
      </p>
    </div>
  );
}

export default function SectionStories() {
  return (
    <>
      <Story
        title="Il ritmo: due bande impilate"
        note="py-section (clamp 5.5rem→9rem on paper, 24px in the product) above and below every band — the same for all of them, so the page reads as a document"
      >
        <div className="-mx-8 bg-background">
          <Section>
            <Wrap>
              <SectionHead
                index="03"
                eyebrow="Moduli"
                title="Una piattaforma sola. Attivi i moduli che ti servono, quando ti servono."
                lead="Ogni modulo porta scritto il suo stato: sai cosa puoi usare oggi e cosa sta arrivando."
              />
              <div className="grid grid-cols-3 gap-4">
                <Cell>Acquisizione</Cell>
                <Cell>Vendita</Cell>
                <Cell>Presenza online</Cell>
              </div>
            </Wrap>
          </Section>

          <Section variant="sunken">
            <Wrap>
              <SectionHead
                index="04"
                eyebrow="Tre modi di lavorare con noi"
                title="Tre modalità di lavoro, un solo obiettivo: la tua crescita."
                lead="Ogni strada funziona da sola e si combina con le altre: scegli da dove partire in base a dove sei oggi."
              />
              <div className="grid grid-cols-3 gap-4">
                <Cell>Servizi</Cell>
                <Cell>Laboratorio</Cell>
                <Cell>Prodotti</Cell>
              </div>
            </Wrap>
          </Section>

          <Section>
            <Wrap>
              <SectionHead
                align="center"
                index="05"
                eyebrow="Parla con noi"
                title="Questi numeri sono ripetibili dove lavori tu?"
                lead="Trenta minuti online, sui tuoi numeri: zona, spesa in campagne e tipo di impianto. Ti diciamo anche quando la risposta è no."
              />
              <div className="flex justify-center gap-3">
                <Button variant="primary">Prenota una demo</Button>
                <Button variant="glass">Vedi la piattaforma</Button>
              </div>
            </Wrap>
          </Section>
        </div>
      </Story>

      <Story
        title="sunken: cambiare registro senza cambiare colore"
        note="the deeper ecru between two hairlines — the band is a different register of the same paper, never a new colour"
      >
        <div className="-mx-8">
          <Section variant="sunken" className="py-12">
            <Wrap>
              <p className="lead">
                Le trattative arrivavano, poi si fermavano dove si fermano ancora oggi: processi
                improvvisati, la vendita sulle spalle del titolare, strumenti che non si parlano.
              </p>
            </Wrap>
          </Section>
        </div>
      </Story>

      <Story
        title="La misura: Wrap"
        note="1280 centred with the fluid gutter (clamp 1.25rem→3rem). The band paints edge to edge; the content stays inside."
      >
        <div className="-mx-8 bg-muted py-6">
          <Wrap>
            <div className="rounded-img border border-dashed border-border-strong bg-card p-6">
              <span className="eyebrow">max-w-measure · px-gutter</span>
              <p className="mt-2 max-w-text">
                La misura del testo è 62ch: oltre, l&apos;occhio perde la riga di ritorno. Il campo
                è 1280 e il contenuto ci sta dentro; è la banda a bordare la pagina, non il testo.
              </p>
            </div>
          </Wrap>
        </div>
      </Story>

      <Story
        title="Le misure interne"
        note="max-w-measure 1280 · max-w-head max(38rem,70%) · max-w-lead max(32rem,62%) · max-w-text 62ch"
      >
        <div className="grid gap-2">
          {(
            [
              ["max-w-measure", "max-w-measure"],
              ["max-w-head", "max-w-head"],
              ["max-w-lead", "max-w-lead"],
              ["max-w-text", "max-w-text"],
            ] as const
          ).map(([name, cls]) => (
            <div key={name} className={`${cls} rounded-xs bg-muted px-3 py-2`}>
              <span className="eyebrow">{name}</span>
            </div>
          ))}
        </div>
      </Story>
    </>
  );
}
