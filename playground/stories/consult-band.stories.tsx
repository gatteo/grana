import type { ReactNode } from "react";

import { Button } from "@/registry/grana/ui/button";
import { ConsultBand } from "@/registry/grana/ui/consult-band";
import { Story } from "@/playground/lib/story";

/** The band is full-bleed even though its canvas stays in the measure. */
function Bleed({ children }: { children: ReactNode }) {
  return <div className="-mx-8">{children}</div>;
}

export default function ConsultBandStories() {
  return (
    <div>
      <Story
        title="Risorse · parla con noi"
        note="the live band: the wash falls sideways (96°) so the verbs on the right keep the picture under them"
      >
        <Bleed>
          <ConsultBand
            image="/img/olive-wax-2.jpg"
            imagePos="center 45%"
            eyebrow="Installatori"
            title="Il modo più rapido per conoscerci è la demo."
            line="Trenta minuti online, sul tuo caso. Senza impegno."
            actions={<Button variant="on-dark">Prenota una demo</Button>}
          />
        </Bleed>
      </Story>

      <Story
        title="Two verbs"
        note="on-dark + glass-dark; the row wraps under the copy when the field gets narrow"
      >
        <Bleed>
          <ConsultBand
            image="/img/teal-paper-3.jpg"
            imagePos="center 55%"
            eyebrow="Parla con noi"
            title="Parliamo della tua provincia."
            line="Ci dici dove lavori e come arrivano le richieste oggi. Ti mostriamo la piattaforma sul tuo caso e, se serve, il servizio di lead generation."
            actions={
              <>
                <Button variant="on-dark">Prenota una demo</Button>
                <Button variant="glass-dark">
                  Scopri la lead generation
                </Button>
              </>
            }
          />
        </Bleed>
      </Story>

      <Story
        title="No eyebrow, no line"
        note="the compact form — one claim and one verb, nothing else"
      >
        <Bleed>
          <ConsultBand
            image="/img/rust-fabric.jpg"
            title="Il manifesto si giudica dal prodotto."
            actions={<Button variant="on-dark">Prenota una demo</Button>}
          />
        </Bleed>
      </Story>

      <Story
        title="Duotone"
        note="duotone brings any texture to the unit tint — the filter chain on the image layer, no blend mode"
      >
        <Bleed>
          <ConsultBand
            image="/img/clay-coils.jpg"
            imagePos="center 40%"
            duotone
            eyebrow="Piattaforma"
            title="Vuoi un parere sul tuo caso?"
            line="Trenta minuti online: ci racconti come lavori e ti diciamo quale delle due strade ha senso per te."
            actions={
              <>
                <Button variant="on-dark">Prenota una demo</Button>
                <Button variant="glass-dark">Vedi i moduli</Button>
              </>
            }
          />
        </Bleed>
      </Story>

      <Story
        title="Long, everything on"
        note="Italian at full length against the 24ch title measure and the 48ch line measure"
      >
        <Bleed>
          <ConsultBand
            image="/img/cobalt-foam.jpg"
            imagePos="center 30%"
            eyebrow="Laboratorio · parla con noi"
            title="Non sai da dove partire con i moduli che ti servono davvero?"
            line="Ci racconti come arrivano le richieste oggi, chi le segue e dove si fermano. Ti diciamo da dove conviene partire, quali moduli accendere subito e cosa invece ha senso rimandare al trimestre dopo, senza vendere niente in quella mezz'ora."
            actions={
              <>
                <Button variant="on-dark">Prenota una demo</Button>
                <Button variant="glass-dark">Raccontaci cosa ti serve</Button>
                <Button variant="glass-dark">Scrivici su WhatsApp</Button>
              </>
            }
          />
        </Bleed>
      </Story>
    </div>
  );
}
