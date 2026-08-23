import { Button } from "@/registry/grana/ui/button";
import { PageHero } from "@/registry/grana/ui/page-hero";
import { Story } from "@/playground/lib/story";

export default function PageHeroStories() {
  return (
    <>
      <Story
        title="PageHero · tall, the section hub"
        note="revenuefarm.it/piattaforma — more air above and below the same type; actions + fact chips"
      >
        <PageHero
          tall
          image="/img/teal-paper-2.jpg"
          imagePos="center 40%"
          eyebrow="Piattaforma"
          title="Il gestionale per chi installa impianti."
          lead="Trattative, preventivi, incentivi e recensioni in un unico posto. I clienti entrano come richieste, escono come impianti realizzati."
          facts={["In italiano", "Migrazione inclusa", "Dati in Europa"]}
          actions={
            <>
              <Button variant="on-dark">Prenota una demo</Button>
              <Button variant="glass-dark">Vedi i prezzi</Button>
            </>
          }
        />
      </Story>

      <Story
        title="PageHero · default height"
        note="revenuefarm.it/demo — eyebrow, title, lead, facts; no actions"
      >
        <PageHero
          image="/img/amber-glass-2.jpg"
          imagePos="center 40%"
          eyebrow="Demo"
          title="Trenta minuti sui tuoi numeri."
          lead="Trenta minuti, online. Porti i tuoi numeri, ti mostriamo come piattaforma e servizi lavorano sul tuo caso."
          facts={["30 minuti", "Coi tuoi numeri", "Senza impegno"]}
        />
      </Story>

      <Story
        title="PageHero · title only"
        note="no lead, no actions, no facts — the two required children still stagger from position 1"
      >
        <PageHero
          image="/img/dune-3.jpg"
          imagePos="center 30%"
          eyebrow="Azienda"
          title="Chi siamo"
        />
      </Story>

      <Story
        title="PageHero · duotone"
        note="the cobalt filter chain on the image layer (Demand pages, case studies) — any texture, brought to one tint"
      >
        <PageHero
          duotone
          image="/img/clay-coils.jpg"
          imagePos="center 35%"
          eyebrow="Caso studio · Fotovoltaico industriale"
          title="Da 40 a 180 trattative al mese senza aumentare la rete commerciale."
          lead="Sei mesi di lavoro sul processo di vendita di un installatore lombardo: stesso team, stessa provincia, un flusso che finalmente si misura."
          facts={[
            "Trattative/mese: da 40 a 180",
            "Tasso di chiusura: 23,4%",
            "Valore medio: € 48.500",
          ]}
        />
      </Story>

      <Story
        title="PageHero · long Italian title, long facts, tall"
        note="the head is held to `max-w-head` (max(38rem, 70%)), the lead to `max-w-lead`; chips never wrap inside themselves"
      >
        <PageHero
          tall
          image="/img/rust-fabric.jpg"
          imagePos="center 45%"
          eyebrow="Ecosistema · Installatori, distributori e partner industriali"
          title="Una piattaforma sola per trattative, preventivi, pratiche di incentivo e recensioni dei clienti."
          lead="Generiamo le trattative e costruiamo quello che serve per chiuderle: processi commerciali, team di vendita e la piattaforma dove trattative, preventivi, pratiche e recensioni vivono in un posto solo, sotto il marchio di ogni installatore."
          facts={[
            "+5.000 trattative qualificate gestite nel 2025",
            "+90 aziende sulla piattaforma",
            "+5 MW di impianti installati nel 2025",
            "Dati ospitati in Europa",
          ]}
          actions={
            <>
              <Button variant="on-dark">Prenota una demo</Button>
              <Button variant="glass-dark">Scopri tutti i moduli</Button>
            </>
          }
        />
      </Story>

      <Story
        title="PageHero · custom wash"
        note="the wash is the legibility contract, not decoration — override it when the picture falls the other way"
        >
        <PageHero
          image="/img/cobalt-foam.jpg"
          imagePos="center 50%"
          wash="linear-gradient(180deg, rgba(12,11,9,0.20) 0%, rgba(12,11,9,0.62) 55%, rgba(12,11,9,0.88) 100%)"
          eyebrow="Manifesto"
          title="Misuriamo prima di promettere."
          lead="Se non lo abbiamo misurato, non lo scriviamo. Vale per i numeri di questo sito e per quelli che consegniamo ai clienti."
          actions={<Button variant="on-dark">Leggi il manifesto</Button>}
        />
      </Story>
    </>
  );
}
