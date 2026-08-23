import type { ReactNode } from "react";

import { Button } from "@/registry/grana/ui/button";
import { DarkBand } from "@/registry/grana/ui/dark-band";
import { Story } from "@/playground/lib/story";

/** A band paints edge to edge; the playground's page padding would lie about that. */
function Bleed({ children }: { children: ReactNode }) {
  return <div className="-mx-8">{children}</div>;
}

/** The live home band's title: a second line that drops under the first. */
function Line({ children }: { children: ReactNode }) {
  return <span className="mt-[0.4em] block">{children}</span>;
}

export default function DarkBandStories() {
  return (
    <div>
      <Story
        title="Home · il manifesto"
        note="the live band: /img/dune-2.jpg at 0.55 under the vertical wash, numbered eyebrow, h2 at 26ch, serif body, one on-dark verb"
      >
        <Bleed>
          <DarkBand
            image="/img/dune-2.jpg"
            index="05"
            eyebrow="Manifesto"
            title={
              <>
                Per quattro anni abbiamo portato trattative agli installatori.
                <Line>
                  Ora siamo pronti a diventare la loro infrastruttura di
                  crescita.
                </Line>
              </>
            }
            body="Le trattative arrivavano, poi si fermavano dove si fermano ancora oggi: processi improvvisati, la vendita sulle spalle del titolare, strumenti che non si parlano. Così abbiamo allargato il nostro lavoro per coprire tutto quello che fa crescere un installatore."
            actions={<Button variant="on-dark">Leggi il manifesto</Button>}
          />
        </Bleed>
      </Story>

      <Story
        title="With the stat row"
        note="three columns over a hairline, mono values at 28px, labels at 14px in inverse-muted"
      >
        <Bleed>
          <DarkBand
            image="/img/warm-stones.jpg"
            index="02"
            eyebrow="Chi siamo"
            title="Nati fra i cantieri, non fra le slide."
            body="Abbiamo passato quattro anni dentro il lavoro degli installatori industriali: le richieste che arrivano di sabato, i preventivi rifatti tre volte, le pratiche che si perdono. La piattaforma è il riassunto di quello che abbiamo visto."
            actions={
              <>
                <Button variant="on-dark">Prenota una demo</Button>
                <Button variant="glass-dark">Vedi i casi studio</Button>
              </>
            }
            stats={[
              { value: "5.000", label: "trattative qualificate gestite nel 2025" },
              { value: "90", label: "aziende sulla piattaforma" },
              { value: "5 MW", label: "di impianti installati nel 2025" },
            ]}
          />
        </Bleed>
      </Story>

      <Story
        title="No index · image tuned"
        note="imagePos 'center 62%' and imageOpacity 0.38 — a darker band for a busier texture; no actions"
      >
        <Bleed>
          <DarkBand
            image="/img/oil-impasto.jpg"
            imagePos="center 62%"
            imageOpacity={0.38}
            eyebrow="La posizione"
            title="La transizione energetica italiana la fanno gli installatori, non i convegni."
            body="Ogni impianto industriale che entra in funzione è passato per un sopralluogo, un preventivo discusso al telefono e una pratica che qualcuno ha portato avanti. È lì che si decide se la transizione avviene o resta un obiettivo scritto in un documento: nel lavoro ordinario di aziende piccole, con un titolare che vende, un tecnico che progetta e nessuno che presidia il processo. Abbiamo costruito il motore interno di quelle aziende perché quel lavoro smetta di dipendere dalla memoria di una persona sola."
          />
        </Bleed>
      </Story>

      <Story
        title="Long, everything on"
        note="Italian at full length against the 26ch title measure and the lead measure on the body; stats wrap to one column under 760px"
      >
        <Bleed>
          <DarkBand
            image="/img/plum-rope-2.jpg"
            imagePos="center 40%"
            index="11"
            eyebrow="Perché esistiamo"
            title="Un installatore che cresce non ha bisogno di un altro gestionale: ha bisogno che il lavoro smetta di passare tutto dal titolare."
            body="Il collo di bottiglia non è mai il numero di richieste. È che la richiesta arriva su WhatsApp, il sopralluogo viene fissato a voce, il preventivo esce da un foglio di calcolo che conosce solo una persona e la pratica di allaccio vive in una cartella sul desktop di qualcun altro. Quando l'azienda raddoppia, quel modo di lavorare non raddoppia con lei: si rompe. La piattaforma tiene insieme trattative, preventivi, pratiche e recensioni in un posto solo, e i servizi coprono la parte che il software da solo non può fare."
            actions={
              <>
                <Button variant="on-dark">Prenota una demo</Button>
                <Button variant="glass-dark">Leggi il manifesto</Button>
                <Button variant="glass-dark">Parla con un consulente</Button>
              </>
            }
            stats={[
              { value: "2022", label: "l'anno in cui abbiamo iniziato a portare trattative" },
              { value: "14", label: "moduli attivi nella piattaforma" },
              { value: "48h", label: "tempo medio di risposta del laboratorio" },
            ]}
          />
        </Bleed>
      </Story>
    </div>
  );
}
