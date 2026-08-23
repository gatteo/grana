import type { ReactNode } from "react";

import { Button } from "@/registry/grana/ui/button";
import { TailorBand } from "@/registry/grana/ui/tailor-band";
import { Story } from "@/playground/lib/story";

/** The sunken band paints edge to edge between its two hairlines. */
function Bleed({ children }: { children: ReactNode }) {
  return <div className="-mx-8">{children}</div>;
}

const STEPS = [
  {
    index: "01",
    title: "Ce lo dici",
    copy: "Ci racconti cosa ti manca, con un esempio preso dal tuo lavoro di questa settimana.",
  },
  {
    index: "02",
    title: "Lo definiamo insieme",
    copy: "Stabiliamo cosa deve fare, quali dati tocca e come si incastra con i moduli che usi già.",
  },
  {
    index: "03",
    title: "Arriva nella tua piattaforma",
    copy: "Lo sviluppiamo e compare nel tuo spazio, aggiornato insieme a tutto il resto.",
  },
];

export default function TailorBandStories() {
  return (
    <div>
      <Story
        title="Piattaforma · il laboratorio"
        note="the live band: sunken paper between two hairlines, the three steps ruled under a strong hairline, note and verbs on one foot line"
      >
        <Bleed>
          <TailorBand
            index="02"
            eyebrow="Laboratorio"
            title="Ti manca un modulo? Lo costruiamo noi."
            lead="Se il tuo lavoro contiene dei processi che la piattaforma non copre, o se un modulo va adattato a come lavori tu, lo sviluppiamo e lo mettiamo dentro la tua piattaforma."
            steps={STEPS}
            note="È la differenza fra un software che compri e un software che diventa il tuo. Nessun preventivo per lo sviluppo, nessun listino di personalizzazioni."
            actions={
              <>
                <Button variant="primary">Raccontaci cosa ti serve</Button>
                <a className="link self-center text-[13px]" href="#tailor-band">
                  Scopri il Laboratorio →
                </a>
              </>
            }
          />
        </Bleed>
      </Story>

      <Story
        title="Steps only"
        note="no note, no actions — the foot line disappears entirely, the ledger stands on its own"
      >
        <Bleed>
          <TailorBand
            eyebrow="Come lavoriamo"
            title="Dalla richiesta al modulo in produzione."
            lead="Tre passaggi, sempre gli stessi, sempre con una data. Non è un impegno commerciale: è il modo in cui il laboratorio prende in carico il lavoro."
            steps={STEPS}
          />
        </Bleed>
      </Story>

      <Story
        title="Note without actions"
        note="the note takes the whole foot line at the lead measure"
      >
        <Bleed>
          <TailorBand
            index="04"
            eyebrow="Personalizzazioni"
            title="Quello che ti serve non è una eccezione."
            lead="Ogni installatore ha un pezzo di processo che non assomiglia a nessun altro: è lì che i gestionali generici si fermano."
            steps={STEPS}
            note="Nessun preventivo per lo sviluppo, nessun listino di personalizzazioni: il modulo entra nel tuo spazio e viene aggiornato insieme a tutto il resto."
          />
        </Bleed>
      </Story>

      <Story
        title="Actions without note"
        note="the two verbs sit at the end of the foot line; a primary and a quiet"
      >
        <Bleed>
          <TailorBand
            eyebrow="Laboratorio"
            title="Costruiamo il modulo che ti manca."
            lead="Ce lo dici, lo definiamo insieme, arriva nella tua piattaforma."
            steps={STEPS}
            actions={
              <>
                <Button variant="primary">Raccontaci cosa ti serve</Button>
                <Button variant="glass">Vedi i moduli attivi</Button>
              </>
            }
          />
        </Bleed>
      </Story>

      <Story
        title="Long copy"
        note="Italian at full length: the head measure, the lead measure, three steps of very uneven length, a note that fills the foot"
      >
        <Bleed>
          <TailorBand
            index="07"
            eyebrow="Il laboratorio · come funziona"
            title="Un modulo che non esiste ancora non è un problema tuo: è la parte del lavoro che facciamo noi."
            lead="La piattaforma copre trattative, preventivi, pratiche e recensioni. Quando il tuo modo di lavorare contiene un passaggio che nessuno di quei moduli descrive, il laboratorio lo prende in carico e lo consegna dentro il tuo spazio, senza che tu debba cambiare strumento o aspettare la prossima versione del prodotto."
            steps={[
              {
                index: "01",
                title: "Ce lo dici",
                copy: "Ci racconti cosa ti manca, con un esempio preso dal tuo lavoro di questa settimana: una richiesta arrivata di sabato, un preventivo rifatto tre volte, una pratica che nessuno sa dove sia finita.",
              },
              {
                index: "02",
                title: "Lo definiamo insieme",
                copy: "Stabiliamo cosa deve fare.",
              },
              {
                index: "03",
                title: "Arriva nella tua piattaforma, aggiornato con tutto il resto",
                copy: "Lo sviluppiamo e compare nel tuo spazio. Entra nel ciclo di rilascio come ogni altro modulo: correzioni, miglioramenti e nuove versioni arrivano insieme al resto della piattaforma, senza un contratto di manutenzione a parte.",
              },
            ]}
            note="È la differenza fra un software che compri e un software che diventa il tuo: nessun preventivo per lo sviluppo, nessun listino di personalizzazioni e nessuna versione della piattaforma che resta indietro perché è stata modificata per te."
            actions={
              <>
                <Button variant="primary">Raccontaci cosa ti serve</Button>
                <a className="link self-center text-[13px]" href="#tailor-band">
                  Scopri il Laboratorio →
                </a>
              </>
            }
          />
        </Bleed>
      </Story>
    </div>
  );
}
