import type { ReactNode } from "react";

import { Canvas } from "@/registry/grana/ui/canvas";
import { FloatPanel } from "@/registry/grana/ui/float-panel";
import {
  SnippetAlert,
  SnippetCall,
  SnippetCompare,
  SnippetForm,
  SnippetPipeline,
  SnippetResult,
  SnippetScore,
  SnippetSplit,
  SnippetStats,
  SnippetTimeline,
  SnippetVariants,
} from "@/registry/grana/ui/shots";
import { Story } from "@/playground/lib/story";

/* One module artefact per field: the panel centred on a canvas, the card's own padding. */
function Field({ img, children }: { img: string; children: ReactNode }) {
  return (
    <Canvas
      img={img}
      className="grid min-h-[clamp(200px,24vw,300px)] place-items-center rounded-xs p-[clamp(1rem,2.5vw,1.75rem)]"
    >
      {children}
    </Canvas>
  );
}

export default function ShotsStories() {
  return (
    <>
      <Story
        title="SnippetPipeline · the deals board"
        note="three columns at min(0,1fr), 7px cards; `moving` tilts the dragged card −1.4° and firms its hairline"
      >
        <div className="max-w-[560px]">
          <Field img="/img/cobalt-foam.jpg">
            <FloatPanel wide>
              <SnippetPipeline
                columns={[
                  {
                    title: "Da contattare",
                    count: "6",
                    cards: [
                      { name: "Meccanica Fardelli", meta: "Brescia · 85 kWp", value: "€ 93.500" },
                      { name: "Salumificio Brera", meta: "Bergamo · 48 kWp", value: "€ 55.200" },
                    ],
                  },
                  {
                    title: "Sopralluogo",
                    count: "11",
                    cards: [
                      {
                        name: "Logistica TrePi",
                        meta: "Piacenza · 145 kWp",
                        value: "€ 152.000",
                        moving: true,
                      },
                      { name: "Cascina Berti", meta: "Lodi · 32 kWp", value: "€ 54.900" },
                    ],
                  },
                  {
                    title: "Preventivo",
                    count: "9",
                    cards: [
                      { name: "Fonderia Valsecchi", meta: "Milano · 198 kWp", value: "€ 205.000" },
                      { name: "Caseificio Molteni", meta: "Lecco · 60 kWp", value: "€ 68.400" },
                    ],
                  },
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetTimeline · all four states"
        note="done (good) · current (ink) · todo (empty ring) · late (warning, and the tag warms with it)"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/warm-stones.jpg">
            <FloatPanel title="Pratiche · Logistica TrePi, 145 kWp">
              <SnippetTimeline
                steps={[
                  { label: "Domanda di connessione", meta: "16/07 · e-distribuzione", state: "done" },
                  { label: "Preventivo di connessione", meta: "accettato il 24/07", state: "done" },
                  { label: "Firma del cliente", meta: "in attesa da 6 giorni", state: "late" },
                  { label: "Regolamento di esercizio", meta: "dopo la firma", state: "todo" },
                  { label: "Registrazione GSE", meta: "dopo l'attivazione", state: "todo" },
                ]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/olive-wax-2.jpg">
            <FloatPanel title="Cantiere · Via Prati 12, Treviglio">
              <SnippetTimeline
                title="Posa e collaudo"
                steps={[
                  { label: "Sopralluogo tecnico", meta: "14/07 · Luca F.", state: "done" },
                  { label: "Materiale ordinato", meta: "18/07 · 6 kWp + inverter", state: "done" },
                  { label: "Installazione", meta: "29/07 · squadra 2", state: "current" },
                  { label: "Collaudo e consegna", meta: "31/07", state: "todo" },
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetScore · the AI's work, made auditable"
        note="42px ink tile, 88/1fr/46 factor grid on chart-1 bars · the strength word is derived unless `note` overrides it"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/dune-3.jpg">
            <FloatPanel>
              <SnippetScore
                value={87}
                subject="Studio Sereni · Monza"
                meta="Modulo sito · 2 minuti fa"
                factors={[
                  { label: "Decisore", value: 92 },
                  { label: "Immobile", value: 88 },
                  { label: "Consumo", value: 81 },
                  { label: "Tetto", value: 74 },
                  { label: "Budget", value: 52, note: "Medio" },
                ]}
                verdict="Priorità alta. Valuta anche il noleggio operativo: il consumo regge un 15 kWp, il budget dichiarato copre il base."
              />
            </FloatPanel>
          </Field>
          <Field img="/img/plum-rope-2.jpg">
            <FloatPanel>
              <SnippetScore
                value={68}
                subject="Chiamata · Meccanica Fardelli"
                meta="Marco B. · 12/08 · 14 min"
                factors={[
                  { label: "Domande di qualifica", value: 80 },
                  { label: "Prossimo passo", value: 85 },
                  { label: "Ascolto", value: 58, note: "Da allenare" },
                  { label: "Linea sconti", value: 40, note: "Non seguita" },
                ]}
                verdict="Il cliente ha chiesto due volte i tempi di posa, la risposta è arrivata a fine chiamata. Sconto offerto prima che fosse richiesto: da rivedere insieme."
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetCompare · two paths, one recommended"
        note="`primary` firms the hairline and sinks the column · the panel is its own container: below 330px the columns stack, whatever the viewport does"
      >
        <div className="grid max-w-[820px] gap-4">
          <Field img="/img/teal-paper-2.jpg">
            <FloatPanel wide>
              <SnippetCompare
                heading="Impianto 32 kWp · Cascina Berti (LO)"
                columns={[
                  {
                    title: "Acquisto",
                    rows: [
                      ["Prezzo impianto", "€ 54.900"],
                      ["Bolletta oggi", "€ 890/mese"],
                      ["Trattamento", "Ammortamento"],
                    ],
                    footer: ["Esborso iniziale", "€ 54.900"],
                  },
                  {
                    title: "Noleggio operativo",
                    primary: true,
                    rows: [
                      ["Canone", "€ 620/mese"],
                      ["Bolletta dopo", "€ 210/mese"],
                      ["Trattamento", "Costo deducibile"],
                    ],
                    footer: ["Esborso iniziale", "€ 0"],
                  },
                ]}
              />
            </FloatPanel>
          </Field>
          {/* Half the width: the panel's own container query stacks the columns. */}
          <div className="max-w-[400px]">
            <Field img="/img/oil-impasto.jpg">
              <FloatPanel wide>
                <SnippetCompare
                  heading="Moduli 590 W · 246 pezzi · Logistica TrePi"
                  columns={[
                    {
                      title: "Elettroforniture Nord",
                      rows: [
                        ["Al pezzo", "€ 118"],
                        ["Consegna", "5 giorni"],
                        ["Listino", "Il tuo"],
                      ],
                      footer: ["Totale", "€ 29.028"],
                    },
                    {
                      title: "FV Distribuzione",
                      primary: true,
                      rows: [
                        ["Al pezzo", "€ 109"],
                        ["Consegna", "8 giorni"],
                        ["Listino", "Piattaforma"],
                      ],
                      footer: ["Totale", "€ 26.814"],
                    },
                  ]}
                />
              </FloatPanel>
            </Field>
          </div>
        </div>
      </Story>

      <Story
        title="SnippetForm · the embedded form and what it produces"
        note="`active` marks the field being answered (stone-500 hairline, stone-100 ground); the pill is drawn, not a Button"
      >
        <div className="max-w-[420px]">
          <Field img="/img/soft-shapes-2.jpg">
            <FloatPanel>
              <SnippetForm
                title="Richiedi un preventivo · elettrorossi.it"
                fields={[
                  { label: "Immobile", value: "Di proprietà" },
                  { label: "Spesa elettrica annua", value: "€ 2.400" },
                  { label: "Tetto", value: "Falda esposta a sud" },
                  { label: "Comune", value: "Treviglio (BG)", active: true },
                ]}
                action="Richiedi il preventivo"
                result="Lead creato in Deals · fonte: modulo sito · 4 campi già qualificati"
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetCall · the transcript and its outcome"
        note="a live good dot, mono head with the duration pushed right; `machine` puts the speaker in mono caps"
      >
        <div className="max-w-[420px]">
          <Field img="/img/amber-glass-2.jpg">
            <FloatPanel>
              <SnippetCall
                title="Chiamata in uscita · 20:14"
                duration="1m 42s"
                lines={[
                  {
                    who: "Assistente",
                    text: "Buonasera, la richiamo per la richiesta lasciata sul sito di Elettro Rossi. Parlo con un sistema automatico, le va di rispondere a due domande?",
                    machine: true,
                  },
                  { who: "Cliente", text: "Sì, certo." },
                  { who: "Assistente", text: "L'abitazione è di sua proprietà?", machine: true },
                  { who: "Cliente", text: "Sì, casa mia." },
                ]}
                outcome="Sopralluogo proposto per giovedì 30/07 · confermato"
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetAlert · warn and note"
        note="the default warns in amber (8% of the status fill); tone=note drops to stone — same shape, quieter register"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/rust-fabric.jpg">
            <FloatPanel>
              <SnippetAlert
                title="Produzione sotto l'attesa · Condominio Verdi 12"
                body="22 kWp, 14 giorni consecutivi a −23% rispetto alla stima per luglio. Compatibile con una stringa fuori servizio."
                meta="Rilevato il 28/07/2026 alle 06:15 · il cliente non ha ancora chiamato"
                action="Apri intervento"
              />
            </FloatPanel>
          </Field>
          <Field img="/img/clay-coils.jpg">
            <FloatPanel>
              <SnippetAlert
                tone="note"
                title="Listino aggiornato · FV Distribuzione"
                body="I moduli 590 W scendono da € 118 a € 109 al pezzo. Nove preventivi aperti usano ancora il prezzo vecchio."
                meta="Aggiornato il 02/08/2026 alle 09:30"
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetStats · the KPI strip"
        note="auto-fit at minmax(96px, 1fr), 17px mono values · the arrow is a direction, the base line says the period"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/dune-2.jpg">
            <FloatPanel title="Cantiere · consuntivo">
              <SnippetStats
                items={[
                  { label: "Ore a preventivo", value: "48" },
                  { label: "Ore consuntivo", value: "51", trend: "down", base: "+3 ore" },
                  { label: "Margine", value: "21,4%", base: "atteso 23%" },
                ]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/teal-paper-3.jpg">
            <FloatPanel title="Reputazione · ultimi 30 giorni">
              <SnippetStats
                items={[
                  { label: "Valutazione", value: "4,8", base: "su 63 recensioni" },
                  { label: "Richieste inviate", value: "18", base: "ultimi 30 giorni" },
                  { label: "Tasso di risposta", value: "61%", trend: "up", base: "era 38%" },
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetSplit · a pool divided"
        note="1fr / 64 / 56 grid, chart-2 bars clamped to 4–100%, the share right-aligned and mono"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/cobalt-foam.jpg">
            <FloatPanel>
              <SnippetSplit
                title="CER Bassa Bergamasca · luglio"
                total="€ 1.284"
                rows={[
                  {
                    name: "Cascina Berti",
                    meta: "produttore · 32 kWp",
                    share: "€ 512",
                    weight: 100,
                  },
                  {
                    name: "Condominio Verdi 12",
                    meta: "consumatore · 18 unità",
                    share: "€ 386",
                    weight: 75,
                  },
                  { name: "Panificio Sironi", meta: "consumatore", share: "€ 241", weight: 47 },
                  { name: "Altri 9 membri", meta: "consumatori", share: "€ 145", weight: 28 },
                ]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/plum-rope-2.jpg">
            <FloatPanel>
              <SnippetSplit
                title="Segnalazioni · ultimi 90 giorni"
                total="7 impianti"
                rows={[
                  {
                    name: "Paolo Neri",
                    meta: "3 segnalazioni · 2 chiuse",
                    share: "€ 34.100",
                    weight: 100,
                  },
                  {
                    name: "Giulia Conti",
                    meta: "2 segnalazioni · 2 chiuse",
                    share: "€ 21.800",
                    weight: 64,
                  },
                  {
                    name: "Studio Sereni",
                    meta: "1 segnalazione · 1 chiusa",
                    share: "€ 9.400",
                    weight: 28,
                  },
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetResult · never gated, always dated"
        note="three mono readouts under a mono head; `children` slots extra proof above the stamp"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/olive-wax-2.jpg">
            <FloatPanel>
              <SnippetResult
                title="Il tuo impianto · 145 kWp · Piacenza"
                rows={[
                  {
                    label: "Iperammortamento 180%",
                    value: "€ 65.700",
                    sub: "beneficio fiscale sull'ammortamento",
                  },
                  { label: "Risparmio in bolletta", value: "€ 24.600", sub: "stima annua" },
                  { label: "Rientro", value: "3,5 anni", sub: "senza finanziamento" },
                ]}
                stamp="Regole verificate al 30/07/2026 · legge di bilancio 2026, tetto 2,5 milioni €"
              />
            </FloatPanel>
          </Field>
          <Field img="/img/warm-stones.jpg">
            <FloatPanel>
              <SnippetResult
                title="Il tuo impianto · 6 kWp · Bergamo"
                rows={[
                  { label: "Costo chiavi in mano", value: "€ 11.400" },
                  { label: "Risparmio annuo", value: "€ 1.820", sub: "stima su 2.400 € di spesa" },
                  { label: "Rientro", value: "6,3 anni" },
                ]}
              >
                <p className="mt-2 text-[10px] text-faint">
                  Nessun dato richiesto per vedere il risultato.
                </p>
              </SnippetResult>
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetVariants · from “se” to “quale”"
        note="three cards at min(0,1fr); `primary` is the recommended option · below 560px they stack"
      >
        <div className="max-w-[420px]">
          <Field img="/img/dune-3.jpg">
            <FloatPanel>
              <SnippetVariants
                heading="Preventivo #2026-0184 · Fonderia Valsecchi"
                meta="22/07/2026"
                variants={[
                  { title: "Base", price: "€ 172.000", meta: "160 kWp" },
                  { title: "Taglia piena", price: "€ 205.000", meta: "198 kWp", primary: true },
                  { title: "Con accumulo", price: "€ 274.000", meta: "198 kWp + 115 kWh" },
                ]}
                note="Tre varianti dallo stesso sopralluogo, generate in 4 minuti. Il cliente sceglie quale, non se."
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>
    </>
  );
}
