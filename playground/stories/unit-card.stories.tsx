import { UnitCard } from "@/registry/grana/ui/unit-card";
import { Story } from "@/playground/lib/story";

/* The `.units` grid is the page's: four columns, two at 1000, one at 560. */
function Units({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-5 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1">
      {children}
    </div>
  );
}

export default function UnitCardStories() {
  return (
    <>
      <Story
        title="Il gruppo · quattro aree, quattro tinte"
        note="the whole identity system: one card four times, only the texture and one word change colour · Demand runs through the duotone · hover lifts 4px onto shadow-card"
      >
        <Units>
          <UnitCard
            href="#unit-card"
            image="/img/dune-2.jpg"
            imagePos="center 25%"
            duotone
            unit="Demand"
            tint="demand"
            copy="Lead generation e servizi commerciali a performance."
          />
          <UnitCard
            href="#unit-card"
            image="/img/teal-paper-2.jpg"
            imagePos="center 60%"
            unit="Piattaforma"
            tint="piattaforma"
            copy="Il software su cui l’azienda lavora ogni giorno."
            delay={0.08}
          />
          <UnitCard
            href="#unit-card"
            image="/img/amber-glass-2.jpg"
            imagePos="center 35%"
            unit="Academy"
            tint="academy"
            copy="Corsi, club e certificazione per chi vende impianti. Apre nel corso dell’anno."
            delay={0.16}
          />
          <UnitCard
            href="#unit-card"
            image="/img/plum-rope-2.jpg"
            imagePos="center 45%"
            unit="Installatori"
            tint="installatori"
            copy="L’elenco pubblico per chi cerca un installatore serio."
            delay={0.24}
          />
        </Units>
      </Story>

      <Story
        title="Senza href · <article>"
        note="no link, no lockup change: the tile is the same, it just does not navigate"
      >
        <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
          <UnitCard
            image="/img/cobalt-foam.jpg"
            imagePos="center 40%"
            duotone
            unit="Demand"
            tint="demand"
            copy="Generazione di domanda per provincia, a costo garantito per trattativa qualificata."
          />
          <UnitCard
            image="/img/olive-wax-2.jpg"
            imagePos="center 30%"
            unit="Piattaforma"
            tint="piattaforma"
            copy="Trattative, preventivi, pratiche e recensioni sullo stesso record: un solo accesso per tutta l’azienda."
          />
        </div>
      </Story>

      <Story
        title="Copy lunga · due righe e oltre"
        note="the lockup never wraps (white-space: nowrap); the copy under it does"
      >
        <Units>
          <UnitCard
            image="/img/warm-stones.jpg"
            imagePos="center 55%"
            unit="Academy"
            tint="academy"
            copy="Corsi, club mensile e certificazione pubblica per chi vende impianti fotovoltaici: il percorso completo, dalla prima chiamata alla firma del contratto."
          />
          <UnitCard
            image="/img/rust-fabric.jpg"
            imagePos="center 45%"
            unit="Installatori"
            tint="installatori"
            copy="L’elenco pubblico degli installatori verificati, provincia per provincia, con recensioni che portano la data."
          />
          <UnitCard
            image="/img/soft-shapes-2.jpg"
            imagePos="center 20%"
            unit="Piattaforma"
            tint="piattaforma"
            copy="Il software."
          />
          <UnitCard
            image="/img/clay-coils.jpg"
            imagePos="center 50%"
            duotone
            unit="Demand"
            tint="demand"
            copy="Trattative qualificate."
          />
        </Units>
      </Story>
    </>
  );
}
