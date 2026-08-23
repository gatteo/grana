import { Button } from "@/registry/grana/ui/button";
import { Hero } from "@/registry/grana/ui/hero";
import { Story } from "@/playground/lib/story";

/* Real copy from revenuefarm.it/ (messages/it/home.json). */
const EYEBROW = "Piattaforma e servizi";
const TITLE = "La piattaforma che fa crescere chi installa impianti industriali.";
const LEAD =
  "Generiamo le trattative e costruiamo quello che serve per chiuderle: processi commerciali, team di vendita e la piattaforma dove trattative, preventivi, pratiche e recensioni vivono in un posto solo.";

const STAKES = [
  { label: "+5.000 trattative gestite nel 2025", x: "60%", y: "22%" },
  { label: "+5 MW installati nel 2025", x: "79%", y: "38%" },
  { label: "+90 aziende sulla piattaforma", x: "66%", y: "55%" },
];

export default function HeroStories() {
  return (
    <>
      <Story
        title="Hero · the home field"
        note="102° wash over the text column, grain at 15%, marks at 18px, three stakes planted on the ridges (gone below 940px)"
      >
        <Hero
          image="/img/dune-2.jpg"
          eyebrow={EYEBROW}
          title={TITLE}
          lead={LEAD}
          primary={<Button variant="on-dark">Prenota una demo</Button>}
          secondary={<Button variant="glass-dark">Vedi la piattaforma</Button>}
          note="Migrazione dei dati inclusa."
          stakes={STAKES}
        />
      </Story>

      <Story
        title="Hero · one verb, no stakes, no note"
        note="the minimum: eyebrow, title, lead, one action — the four required children still stagger in order"
      >
        <Hero
          image="/img/warm-stones.jpg"
          imagePos="center 60%"
          eyebrow="Servizi"
          title="Le trattative arrivano. Il resto lo costruiamo insieme."
          lead="Un team commerciale che conosce il settore, un processo che regge il volume e i numeri di ogni settimana sul tavolo."
          primary={<Button variant="on-dark">Parliamone</Button>}
        />
      </Story>

      <Story
        title="Hero · long Italian title and a long stake label"
        note="13ch on the display line, 54ch on the serif lead, `whitespace-nowrap` on the chip — the stake never wraps, it overflows the field"
      >
        <Hero
          image="/img/olive-wax-2.jpg"
          imagePos="center 35%"
          eyebrow="Ecosistema installatori e partner industriali"
          title="Il gestionale per chi installa impianti fotovoltaici, accumuli e colonnine di ricarica."
          lead="Trattative, preventivi, incentivi, pratiche GSE e recensioni in un unico posto: i clienti entrano come richieste e escono come impianti realizzati, con la stessa scheda per tutta la squadra dal primo contatto al collaudo."
          primary={<Button variant="on-dark">Prenota una demo</Button>}
          secondary={<Button variant="glass-dark">Scarica il listino completo</Button>}
          note="Migrazione dei dati inclusa, senza costi di attivazione e senza vincoli di durata."
          stakes={[
            { label: "+5.000 trattative qualificate gestite nel 2025", x: "58%", y: "20%" },
            { label: "+90 aziende", x: "84%", y: "44%" },
          ]}
        />
      </Story>

      <Story
        title="Hero · stakes at the edges"
        note="the coordinates are the caller's measurement, not a layout: x/y are `left`/`top` on the field"
      >
        <Hero
          image="/img/dune-3.jpg"
          imagePos="center 20%"
          eyebrow="Laboratorio"
          title="Misuriamo prima di promettere."
          lead="Ogni numero pubblicato su questo sito è verificato: se non lo abbiamo misurato, non lo scriviamo."
          primary={<Button variant="on-dark">Vedi il metodo</Button>}
          stakes={[
            { label: "01 · rilievo", x: "52%", y: "12%" },
            { label: "02 · campionamento", x: "70%", y: "30%" },
            { label: "03 · verifica", x: "58%", y: "48%" },
            { label: "04 · pubblicazione", x: "76%", y: "66%" },
          ]}
        />
      </Story>
    </>
  );
}
