import type { ReactNode } from "react";

import { Canvas } from "@/registry/grana/ui/canvas";
import { FloatPanel } from "@/registry/grana/ui/float-panel";
import { SnippetCompare, SnippetTimeline } from "@/registry/grana/ui/shots";
import { SnippetChat, SnippetRows } from "@/registry/grana/ui/snippets";
import { Story } from "@/playground/lib/story";

/* The field a marketing card puts a panel on: the panel centred, the card's own padding. */
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

export default function FloatPanelStories() {
  return (
    <>
      <Story
        title="FloatPanel · the default register"
        note="min(340px, 92%) · white, rgba(14,13,10,.12) hairline, shadow-panel, 16/18px padding, 13px text"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/dune-2.jpg">
            <FloatPanel title="Preventivo · #2026-0184">
              <SnippetRows
                rows={[
                  ["Fonderia Valsecchi", "€ 205.000"],
                  ["Impianto", "198 kWp"],
                  ["Sopralluogo", "gio 13/08 · 15:00"],
                ]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/olive-wax-2.jpg">
            <FloatPanel>
              <SnippetChat
                time="21:47"
                messages={[
                  { text: "Buonasera, quanto costa un impianto da 6 kWp?" },
                  {
                    text: "Dipende da tetto e consumi. Le faccio tre domande veloci, poi le lascio una stima.",
                    out: true,
                  },
                  { text: "Va bene." },
                  { text: "L'immobile è di sua proprietà?", out: true },
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="FloatPanel · wide"
        note="RF `.float-panel--wide` → `wide` · min(430px, 96%); the register the comparison block asks for"
      >
        <div className="max-w-[560px]">
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
        </div>
      </Story>

      <Story
        title="FloatPanel · the title slot, long"
        note="mono 11px, .08em, uppercase, stone-500 · Italian titles wrap and the panel keeps its measure"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/warm-stones.jpg">
            <FloatPanel title="Pratiche di connessione · Logistica TrePi, 145 kWp, Piacenza">
              <SnippetTimeline
                steps={[
                  { label: "Domanda di connessione", meta: "16/07 · e-distribuzione", state: "done" },
                  { label: "Preventivo di connessione", meta: "accettato il 24/07", state: "done" },
                  { label: "Firma del cliente", meta: "in attesa da 6 giorni", state: "late" },
                  { label: "Regolamento di esercizio", meta: "dopo la firma", state: "todo" },
                ]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/rust-fabric.jpg">
            <FloatPanel title="Cantiere · Via Prati 12, Treviglio">
              <SnippetRows
                rows={[
                  ["Ore a preventivo", "48"],
                  ["Ore consuntivo", "51"],
                  ["Margine", "21,4%"],
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="FloatPanel · on paper, no canvas"
        note="the shadow and the hairline are the panel's own — it does not need a field to read"
      >
        <FloatPanel title="Segnalazioni · ultimi 90 giorni">
          <SnippetRows
            rows={[
              ["Paolo Neri", "€ 34.100"],
              ["Giulia Conti", "€ 21.800"],
              ["Studio Sereni", "€ 9.400"],
            ]}
          />
        </FloatPanel>
      </Story>
    </>
  );
}
