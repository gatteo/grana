import type { ReactNode } from "react";

import { Button } from "@/registry/grana/ui/button";
import { CtaBand } from "@/registry/grana/ui/cta-band";
import { Story } from "@/playground/lib/story";

/** The dotted band paints edge to edge; the playground's page padding would lie about that. */
function Bleed({ children }: { children: ReactNode }) {
  return <div className="-mx-8">{children}</div>;
}

export default function CtaBandStories() {
  return (
    <div>
      <Story
        title="Home · la chiusura"
        note="the live band: dots behind, the canvas at clamp(5rem,10vw,8.5rem) of air, h2 at 22ch centred, light marks"
      >
        <Bleed>
          <CtaBand
            image="/img/amber-glass-2.jpg"
            imagePos="center 60%"
            title="Vuoi scoprire come possiamo aiutarti?"
            line="Trenta minuti online. Porti i tuoi numeri, apriamo la piattaforma sul tuo caso."
            actions={
              <>
                <Button variant="on-dark">Prenota una demo</Button>
                <Button variant="glass-dark">Vedi i casi studio</Button>
              </>
            }
          />
        </Bleed>
      </Story>

      <Story
        title="Title only"
        note="no line, no actions — the band still holds its air; the question carries it"
      >
        <Bleed>
          <CtaBand
            image="/img/dune-3.jpg"
            title="Ti facciamo vedere la piattaforma sui tuoi dati."
          />
        </Bleed>
      </Story>

      <Story
        title="One verb"
        note="the common inner-page ending: a single on-dark CTA under the serif line"
      >
        <Bleed>
          <CtaBand
            image="/img/teal-paper-2.jpg"
            imagePos="center 35%"
            title="Partiamo da come lavori oggi."
            line="Ci racconti come arrivano le richieste e chi le segue. Ti diciamo da dove conviene partire."
            actions={<Button variant="on-dark">Prenota una demo</Button>}
          />
        </Bleed>
      </Story>

      <Story
        title="Custom wash + grain"
        note="wash overridden for a light texture, grainOpacity raised to 0.22 — the two escape hatches"
      >
        <Bleed>
          <CtaBand
            image="/img/soft-shapes-2.jpg"
            wash="linear-gradient(180deg, rgba(12, 11, 9, 0.62), rgba(12, 11, 9, 0.78))"
            grainOpacity={0.22}
            title="Ogni modulo che ti manca lo costruiamo noi, dentro la tua piattaforma."
            line="Nessun preventivo per lo sviluppo, nessun listino di personalizzazioni: ci racconti cosa ti serve e lo mettiamo in lavorazione."
            actions={
              <>
                <Button variant="on-dark">Raccontaci cosa ti serve</Button>
                <Button variant="glass-dark">Scopri il Laboratorio</Button>
              </>
            }
          />
        </Bleed>
      </Story>

      <Story
        title="Long, three verbs"
        note="Italian at full length against the 22ch title measure and the 44ch line measure; the actions wrap centred"
      >
        <Bleed>
          <CtaBand
            image="/img/rust-fabric.jpg"
            imagePos="center 48%"
            title="Vuoi capire se la piattaforma regge il modo in cui lavora la tua azienda?"
            line="Portiamo i tuoi ultimi trenta preventivi, le richieste dell'ultimo mese e le pratiche aperte: apriamo la piattaforma su quelli, non su una demo finta."
            actions={
              <>
                <Button variant="on-dark">Prenota una demo</Button>
                <Button variant="glass-dark">Vedi i casi studio</Button>
                <Button variant="glass-dark">Scrivici su WhatsApp</Button>
              </>
            }
          />
        </Bleed>
      </Story>
    </div>
  );
}
