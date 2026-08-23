import { WayCard } from "@/registry/grana/ui/way-card";
import { Story } from "@/playground/lib/story";

/* The `.ways` grid is the page's, not the card's: two columns, one under 880. */
function Ways({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-6 max-[880px]:grid-cols-1">{children}</div>;
}

/* A status pill inside a snippet row — the fragment kit's `.pill`, drawn inline here so the
 * story shows a ReactNode row next to the plain string rows. */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[0.3125rem] text-[0.6875rem] whitespace-nowrap before:size-1.5 before:rounded-full before:bg-status-good before:content-['']">
      {children}
    </span>
  );
}

export default function WayCardStories() {
  return (
    <>
      <Story
        title="Due modi di lavorare con noi"
        note="the home pair: teal field + piattaforma tint, cobalt duotone + demand tint; hover lifts the snippet 4px, never the card"
      >
        <Ways>
          <WayCard
            image="/img/teal-paper-2.jpg"
            tint="piattaforma"
            eyebrow="Piattaforma"
            title="Il posto dove il lavoro succede"
            copy="Un solo accesso al posto di WhatsApp, Excel e un CRM che nessuno apre. I moduli si attivano quando servono."
            items={[
              "Trattative, preventivi e pratiche sullo stesso record",
              "Calcolatore incentivi da mettere sul tuo sito",
              "Timeline che distingue la persona dall’AI",
            ]}
            link={
              <a className="link" href="#way-card">
                Vedi la piattaforma →
              </a>
            }
            snippet={{
              title: "Trattativa · Condominio Via Verdi 12",
              rows: [
                [
                  <span key="a">
                    <span className="who">Preventivo 22,0 kWp</span>
                    <span className="sub">inviato da Luca · 2 ore fa</span>
                  </span>,
                  "€ 41.200",
                ],
                [
                  <span key="b">
                    <span className="who">Qualifica AI</span>
                    <span className="sub">chiamata trascritta · 27/07, 09:12</span>
                  </span>,
                  <Pill key="p">Idoneo</Pill>,
                ],
                [
                  <span key="c">
                    <span className="who">Sopralluogo</span>
                    <span className="sub">fissato con l’amministratore</span>
                  </span>,
                  "04/08",
                ],
              ],
            }}
          />
          <WayCard
            image="/img/dune-2.jpg"
            imagePos="center 70%"
            duotone
            tint="demand"
            eyebrow="Servizi"
            title="Il lavoro che facciamo noi"
            copy="Generazione di domanda, migrazione dal gestionale attuale, setup. È il lavoro che paga il resto dell’azienda da quattro anni."
            items={[
              "Lead generation a performance, per provincia",
              "Migrazione da GoHighLevel con i dati storici",
              "Un referente, non un ticket",
            ]}
            delay={0.08}
            link={
              <a className="link" href="#way-card">
                Vedi i servizi →
              </a>
            }
            snippet={{
              title: "Lead · provincia di Bergamo",
              rows: [
                [
                  <span key="a">
                    <span className="who">Marco Bianchi</span>
                    <span className="sub">villetta, bolletta € 210/mese</span>
                  </span>,
                  <Pill key="p1">Qualificato</Pill>,
                ],
                [
                  <span key="b">
                    <span className="who">Sara Colombo</span>
                    <span className="sub">richiesta accumulo + colonnina</span>
                  </span>,
                  <Pill key="p2">Qualificato</Pill>,
                ],
                [
                  <span key="c">
                    <span className="who">Consegnati questo mese</span>
                  </span>,
                  "31",
                ],
              ],
            }}
          />
        </Ways>
      </Story>

      <Story
        title="Tre modalità di lavoro · tintTitle, no snippet"
        note="the live home triad: the phrase rides the tinted eyebrow, the family name is the title in plain ink"
      >
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))]">
          <WayCard
            image="/img/cobalt-foam.jpg"
            imagePos="center 35%"
            tint="demand"
            eyebrow="Il nostro team al tuo servizio"
            tintTitle
            title="Servizi"
            copy="Il risultato senza costruire la competenza in casa: trattative qualificate, processi di vendita e persone che sanno usarli."
            items={[
              "Generazione trattative a costo garantito per trattativa",
              "Consulenza commerciale sul tuo processo di vendita",
              "Inserimento venditori dalla nostra rete",
            ]}
            link={
              <a className="link" href="#way-card">
                Vedi i servizi →
              </a>
            }
          />
          <WayCard
            image="/img/olive-wax-2.jpg"
            imagePos="center 50%"
            tint="academy"
            eyebrow="Soluzioni costruite su misura"
            tintTitle
            title="Laboratorio"
            copy="Ci porti un’esigenza, torniamo con la soluzione costruita su misura: dentro la piattaforma o direttamente nel tuo spazio."
            items={[
              "Software e moduli ad hoc",
              "Agenti AI addestrati sul tuo flusso",
              "Automazioni sugli strumenti che già usi",
            ]}
            delay={0.08}
            link={
              <a className="link" href="#way-card">
                Scopri il Laboratorio →
              </a>
            }
          />
          <WayCard
            image="/img/teal-paper-3.jpg"
            imagePos="center 40%"
            tint="piattaforma"
            eyebrow="Software pronti all’uso"
            tintTitle
            title="Prodotti"
            copy="Cinque soluzioni standard che compri da sole e attivi senza progetto: a sé stanti, integrate con i tuoi strumenti o dentro la piattaforma."
            items={[
              "Preventivatore e simulatore incentivi",
              "Sito web e gestione recensioni",
              "Configuratore impianto col tuo marchio",
            ]}
            delay={0.16}
            link={
              <a className="link" href="#way-card">
                Vedi i prodotti →
              </a>
            }
          />
        </div>
      </Story>

      <Story
        title="Le quattro tinte · titolo lungo"
        note="academy and installatori tints, and a title long enough to wrap at clamp(1.75rem, 2.6vw, 2.125rem)"
      >
        <Ways>
          <WayCard
            image="/img/amber-glass-2.jpg"
            imagePos="center 35%"
            tint="academy"
            eyebrow="Academy · corsi e certificazione"
            title="Corsi, club e certificazione per chi vende impianti fotovoltaici in Italia"
            copy="La formazione commerciale che manca a chi vende impianti: il percorso, il club dei venditori e la certificazione che il cliente finale riconosce."
            items={[
              "Percorso base e avanzato sulla vendita di impianti",
              "Club mensile con i venditori delle aziende clienti",
              "Certificazione pubblica sull’elenco installatori",
            ]}
            link={
              <a className="link" href="#way-card">
                Scopri l’Academy →
              </a>
            }
          />
          <WayCard
            image="/img/plum-rope-2.jpg"
            imagePos="center 45%"
            tint="installatori"
            eyebrow="Installatori"
            title="L’elenco pubblico per chi cerca un installatore serio"
            copy="Un elenco che si può controllare: partita IVA, impianti consegnati, recensioni verificate e la data dell’ultimo aggiornamento."
            items={["Scheda azienda verificata", "Recensioni con data", "Contatto diretto, senza intermediari"]}
            delay={0.08}
            link={
              <a className="link" href="#way-card">
                Vai all’elenco →
              </a>
            }
          />
        </Ways>
      </Story>
    </>
  );
}
