import { IllustrationCard } from "@/registry/grana/ui/illustration-card";
import { Story } from "@/playground/lib/story";

/* The cards ride the page's `.posts` grid: three columns, one under 860. */
function Cards({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-5 max-[860px]:grid-cols-1">{children}</div>;
}

/* Stand-in for the sibling `FloatPanel` (`@/registry/grana/ui/float-panel`), kept local so this
 * item's story stays green on its own. It carries `data-slot="float-panel"` — the hook the card's
 * hover lift reaches for, and the slot the real component emits — so the lift is exercised for
 * real here. Swapping in `<FloatPanel title=…><SnippetRows rows=… /></FloatPanel>` is a one-line
 * change once the lead wants the story coupled. */
function FloatPanelStub({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div
      data-slot="float-panel"
      className="w-[min(340px,92%)] min-w-0 rounded-sm border border-[rgba(14,13,10,0.12)] bg-stone-0 px-[1.125rem] py-4 text-left text-[13px] shadow-panel transition-[translate] duration-400 ease-brand-out"
    >
      {title ? (
        <h5 className="mb-[0.625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-stone-500 uppercase">
          {title}
        </h5>
      ) : null}
      {children}
    </div>
  );
}

function StubRows({ rows }: { rows: [string, string][] }) {
  return (
    <>
      {rows.map(([left, right]) => (
        <div
          key={left}
          className="flex items-center justify-between gap-3 border-t border-t-stone-100 py-[0.4375rem] first-of-type:border-t-0"
        >
          <span className="min-w-0 truncate font-medium">{left}</span>
          <span className="num flex-none whitespace-nowrap">{right}</span>
        </div>
      ))}
    </>
  );
}

export default function IllustrationCardStories() {
  return (
    <>
      <Story
        title="Dentro il prodotto · tre aree di lavoro"
        note="16/10 field, the artefact drawn in code, then eyebrow + title + copy + a bottom-pinned link · hover lifts the card 4px and the panel another 4px"
      >
        <Cards>
          <IllustrationCard
            image="/img/teal-paper-2.jpg"
            imagePos="center 22%"
            tint="piattaforma"
            eyebrow="Vendita"
            title="Il valore aperto è un numero, non una sensazione"
            copy="Ogni trattativa ha un valore, una fase e la prossima attività. Apri la pagina e sai chi richiamare oggi."
            link={
              <a className="link" href="#illustration-card">
                Scopri tutti i moduli
              </a>
            }
            art={
              <FloatPanelStub title="Pipeline · Luglio 2026">
                <StubRows
                  rows={[
                    ["Fonderia Bresciana", "€ 198.000"],
                    ["Logistica Padana", "€ 132.500"],
                    ["Caseificio Val Seriana", "€ 91.400"],
                  ]}
                />
              </FloatPanelStub>
            }
          />
          <IllustrationCard
            image="/img/dune-2.jpg"
            imagePos="center 60%"
            tint="piattaforma"
            eyebrow="Presenza online"
            title="Le recensioni arrivano da sole"
            copy="A impianto consegnato parte la richiesta di recensione, e il sito mostra i lavori fatti. I clienti futuri trovano un’azienda che si presenta da sola."
            delay={0.08}
            link={
              <a className="link" href="#illustration-card">
                Scopri tutti i moduli
              </a>
            }
            art={
              <FloatPanelStub>
                <p className="font-serif text-sm leading-[1.5]">
                  «Impianto da 145 kWp consegnato nei tempi. Squadra precisa, cantiere pulito,
                  numeri come da preventivo.»
                </p>
                <p className="mt-2 text-[0.6875rem] text-faint">
                  Titolare, azienda logistica · Verona
                </p>
              </FloatPanelStub>
            }
          />
          <IllustrationCard
            image="/img/teal-paper-3.jpg"
            imagePos="center 78%"
            tint="piattaforma"
            eyebrow="Operations"
            title="La commessa ha una data e uno stato"
            copy="Materiali ordinati, squadra assegnata, pratiche in corso: ogni passaggio ha uno stato che tutta l’azienda vede, senza telefonate in ufficio."
            delay={0.16}
            link={
              <a className="link" href="#illustration-card">
                Scopri tutti i moduli
              </a>
            }
            art={
              <FloatPanelStub title="Commessa · 145 kWp">
                <StubRows
                  rows={[
                    ["Materiali ordinati", "05/08"],
                    ["Squadra assegnata", "12/08"],
                    ["Posa e collaudo", "18/08"],
                  ]}
                />
              </FloatPanelStub>
            }
          />
        </Cards>
      </Story>

      <Story
        title="Le quattro tinte · e il duotone"
        note="the eyebrow takes the unit tint; Demand's texture runs through the cobalt filter chain"
      >
        <Cards>
          <IllustrationCard
            image="/img/dune-3.jpg"
            imagePos="center 40%"
            duotone
            tint="demand"
            eyebrow="Demand"
            title="Trattative qualificate, non liste comprate"
            copy="Ogni trattativa arriva con la bolletta, il tipo di immobile e la disponibilità dichiarata a voce."
            art={
              <FloatPanelStub title="Lead · provincia di Bergamo">
                <StubRows
                  rows={[
                    ["Marco Bianchi", "€ 210/mese"],
                    ["Sara Colombo", "€ 178/mese"],
                    ["Consegnati", "31"],
                  ]}
                />
              </FloatPanelStub>
            }
          />
          <IllustrationCard
            image="/img/amber-glass-2.jpg"
            imagePos="center 35%"
            tint="academy"
            eyebrow="Academy"
            title="Il percorso, il club e la certificazione"
            copy="La formazione commerciale per chi vende impianti, con la certificazione che finisce sull’elenco pubblico."
            delay={0.08}
            art={
              <FloatPanelStub title="Percorso · Vendita impianti">
                <StubRows
                  rows={[
                    ["Modulo 1 · Chiamata", "42 min"],
                    ["Modulo 2 · Sopralluogo", "38 min"],
                    ["Modulo 3 · Preventivo", "51 min"],
                  ]}
                />
              </FloatPanelStub>
            }
          />
          <IllustrationCard
            image="/img/plum-rope-2.jpg"
            imagePos="center 45%"
            tint="installatori"
            eyebrow="Installatori"
            title="Una scheda che si può controllare"
            copy="Partita IVA, impianti consegnati, recensioni verificate e la data dell’ultimo aggiornamento."
            delay={0.16}
            art={
              <FloatPanelStub title="Scheda · Solare Bergamasca srl">
                <StubRows
                  rows={[
                    ["Impianti consegnati", "148"],
                    ["Recensioni", "62"],
                    ["Aggiornata", "14/08"],
                  ]}
                />
              </FloatPanelStub>
            }
          />
        </Cards>
      </Story>

      <Story
        title="Minimi · senza tinta, senza copy, senza link"
        note="tint omitted ⇒ the eyebrow falls back to text-faint; with no copy and no link the body is eyebrow + title alone"
      >
        <Cards>
          <IllustrationCard
            image="/img/warm-stones.jpg"
            imagePos="center 50%"
            eyebrow="Whitelabel"
            title="Il tuo marchio, non il nostro"
            art={
              <FloatPanelStub title="Configuratore · impianto">
                <StubRows
                  rows={[
                    ["Potenza", "8,4 kWp"],
                    ["Accumulo", "10 kWh"],
                    ["Rientro", "5,2 anni"],
                  ]}
                />
              </FloatPanelStub>
            }
          />
          <IllustrationCard
            image="/img/soft-shapes-2.jpg"
            imagePos="center 20%"
            title="Nessuna eyebrow, solo il titolo e una riga"
            copy="Il campo resta 16/10 anche quando il corpo è corto: la card non si accorcia sotto la griglia."
            delay={0.08}
          />
          <IllustrationCard
            image="/img/rust-fabric.jpg"
            imagePos="center 35%"
            tint="installatori"
            eyebrow="Elenco pubblico · provincia per provincia"
            title="Un titolo lungo abbastanza da mandare a capo la riga e spingere il link sul fondo della card"
            copy="Il link resta incollato al bordo inferiore grazie a margin-top:auto, qualunque sia la lunghezza del titolo."
            delay={0.16}
            link={
              <a className="link" href="#illustration-card">
                Vai all’elenco →
              </a>
            }
          />
        </Cards>
      </Story>
    </>
  );
}
