import type { ReactNode } from "react";

import { Canvas } from "@/registry/grana/ui/canvas";
import { FloatPanel } from "@/registry/grana/ui/float-panel";
import {
  SnippetBrowser,
  SnippetChart,
  SnippetChat,
  SnippetChecklist,
  SnippetQuote,
  SnippetReview,
  SnippetRows,
} from "@/registry/grana/ui/snippets";
import { Story } from "@/playground/lib/story";

/* The way the site uses them: a canvas field, the artefact centred, the card's own padding. */
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

export default function SnippetsStories() {
  return (
    <>
      <Story
        title="SnippetRows · the ledger register"
        note="hairline-separated rows, first has none; the value is mono, tabular and never wraps"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/dune-3.jpg">
            <FloatPanel title="Qualifica · WhatsApp">
              <SnippetRows
                rows={[
                  ["Punteggio", "82 / 100"],
                  ["Decisore", "Sì"],
                  ["Sopralluogo", "gio 13/08 · 15:00"],
                ]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/clay-coils.jpg">
            <FloatPanel title="Commessa · Fonderia Valsecchi, Milano">
              <SnippetRows
                rows={[
                  ["Impianto fotovoltaico in copertura", "€ 198.000"],
                  ["Adeguamento cabina e quadri", "€ 14.500"],
                  [
                    <span key="p">
                      Pratiche e connessione
                      <span className="block text-[11px] text-faint">
                        e-distribuzione · GSE · Terna
                      </span>
                    </span>,
                    "€ 6.200",
                  ],
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetChat · lead writes, the system answers"
        note="incoming stone-100 left, outgoing ink right, 9px bubbles at 88% max · mono timestamp last"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/olive-wax-2.jpg">
            <FloatPanel title="Sito · sabato 21:47">
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
          <Field img="/img/cobalt-foam.jpg">
            <FloatPanel title="Agente AI · Qualifica su WhatsApp">
              <SnippetChat
                time="21:12"
                messages={[
                  {
                    text: "Buonasera, vorrei un preventivo per il tetto del nostro capannone a Lodi.",
                  },
                  {
                    text: "Buonasera. Le faccio tre domande veloci: l'immobile è di proprietà dell'azienda?",
                    out: true,
                  },
                  { text: "Sì, nostro." },
                  { text: "Quanto spendete di energia in un mese, all'incirca?", out: true },
                  { text: "Sui 4.000 €." },
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetChart · one series and two"
        note="74px bars on a stone-300 rule, 4px gaps, chart-1 / chart-2 · mono 9px labels"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/soft-shapes-2.jpg">
            <FloatPanel title="Richieste dal sito · 2026">
              <SnippetChart
                bars={[28, 34, 41, 39, 52, 63, 71, 84]}
                labels={["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago"]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/amber-glass-2.jpg">
            <FloatPanel title="Preventivi inviati · vinti">
              <SnippetChart
                bars={[
                  [62, 24],
                  [70, 31],
                  [58, 26],
                  [83, 44],
                  [91, 52],
                  [76, 47],
                ]}
                labels={["mar", "apr", "mag", "giu", "lug", "ago"]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetChecklist · done and to do"
        note="12px drawn tick (two 1.5px borders rotated −45°); `todo` empties the box and greys the line"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/warm-stones.jpg">
            <FloatPanel title="Cantiere · Via Prati 12">
              <SnippetChecklist
                items={[
                  { label: "Sopralluogo tecnico" },
                  { label: "Materiale ordinato" },
                  { label: "Installazione pianificata" },
                  { label: "Collaudo e consegna", todo: true },
                ]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/plum-rope-2.jpg">
            <FloatPanel title="Onboarding · prime due settimane">
              <SnippetChecklist
                items={[
                  { label: "Importazione anagrafiche e listini dal gestionale" },
                  { label: "Modulo di richiesta pubblicato su elettrorossi.it" },
                  { label: "Prima squadra di posa a calendario" },
                  { label: "Collegamento del monitoraggio degli impianti", todo: true },
                  { label: "Formazione commerciale in Academy", todo: true },
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetBrowser · the websites we build, drawn"
        note="its own frame (no FloatPanel): min(360px, 94%), 8px corners, mono address bar · `tint` colours the hero block"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/teal-paper-3.jpg">
            <SnippetBrowser url="elettrorossi.it" tint="var(--chart-1)" />
          </Field>
          <Field img="/img/oil-impasto.jpg">
            <SnippetBrowser url="impiantifardelli.it/preventivo-fotovoltaico-industriale">
              <div className="h-[52px] rounded-xs bg-[var(--unit-demand)]" />
              <SnippetRows
                rows={[
                  ["Impianti consegnati", "63"],
                  ["Provincia", "Bergamo"],
                ]}
              />
            </SnippetBrowser>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetQuote · the document artefact"
        note="mono uppercase head, hairline line items, stone-300 rule above the total"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/dune-2.jpg">
            <FloatPanel>
              <SnippetQuote
                heading="Preventivo #2026-0184"
                meta="22/07/2026"
                rows={[
                  ["Impianto fotovoltaico 145 kWp", "€ 118.000"],
                  ["Adeguamento cabina e quadri", "€ 14.500"],
                  ["Pratiche e connessione", "€ 6.200"],
                ]}
                total={["Totale commessa", "€ 138.700"]}
              />
            </FloatPanel>
          </Field>
          <Field img="/img/rust-fabric.jpg">
            <FloatPanel title="Documento · in attesa di firma">
              <SnippetQuote
                heading="Preventivo #2026-0191"
                rows={[
                  ["Moduli 590 W · 246 pezzi", "€ 26.814"],
                  ["Inverter e ottimizzatori", "€ 19.400"],
                  ["Strutture di ancoraggio e posa", "€ 31.200"],
                  ["Accumulo 115 kWh", "€ 69.000"],
                ]}
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>

      <Story
        title="SnippetReview · the five-star card"
        note="the review gold #d99a06 at .14em · quote 12px/1.5, mono attribution · `stars` clamps to 1–5"
      >
        <div className="grid max-w-[820px] gap-4 sm:grid-cols-2">
          <Field img="/img/soft-shapes-2.jpg">
            <FloatPanel>
              <SnippetReview
                quote="Impianto sul capannone consegnato nei tempi, cantiere pulito. Ci hanno seguito anche dopo il collaudo."
                author="Recensione Google · 14/07/2026"
              />
            </FloatPanel>
          </Field>
          <Field img="/img/clay-coils.jpg">
            <FloatPanel title="Reputazione · ultimi 30 giorni">
              <SnippetReview
                stars={4}
                quote="Preventivo chiaro e senza sorprese in fattura. Un paio di giorni di ritardo sulla consegna dei moduli, per il resto tutto come promesso."
                author="Recensione Google · Salumificio Brera, Bergamo · 03/08/2026"
              />
            </FloatPanel>
          </Field>
        </div>
      </Story>
    </>
  );
}
