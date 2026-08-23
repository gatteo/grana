import { PostCard } from "@/registry/grana/ui/post-card";
import { Story } from "@/playground/lib/story";

/* The `.posts` grid is the page's: three columns, one under 860. */
function Posts({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-5 max-[860px]:grid-cols-1">{children}</div>;
}

export default function PostCardStories() {
  return (
    <>
      <Story
        title="Risorse · le tre più recenti"
        note="21/9 header, mono category, the verified stamp pinned to the bottom edge · hover lifts 4px onto shadow-card"
      >
        <Posts>
          <PostCard
            href="#post-card"
            image="/img/olive-wax-2.jpg"
            imagePos="center 30%"
            category="Guida"
            title="Detrazione 50% e 36%: cosa cambia davvero per chi vende impianti nel 2026"
            verified="Verificato il 12/07/2026"
          />
          <PostCard
            href="#post-card"
            image="/img/soft-shapes-2.jpg"
            imagePos="center 20%"
            category="Guida"
            title="Vendere l’impianto a rate dopo la fine dello sconto in fattura"
            verified="Verificato il 03/07/2026"
            delay={0.08}
          />
          <PostCard
            href="#post-card"
            image="/img/teal-paper-2.jpg"
            imagePos="center 15%"
            category="Aggiornamento normativo"
            title="Comunità energetiche rinnovabili: chi può entrarci e con quali tempi"
            verified="Verificato il 28/06/2026"
            delay={0.16}
          />
        </Posts>
      </Story>

      <Story
        title="Senza stamp · e con il titolo come link"
        note="no verifiedOn ⇒ no stamp and no bottom padding block; the card is an <article> and the title carries the routing"
      >
        <Posts>
          <PostCard
            image="/img/warm-stones.jpg"
            imagePos="center 40%"
            category="Articolo"
            title={
              <a className="link" href="#post-card">
                Quanto costa davvero un lead fotovoltaico in Italia
              </a>
            }
          />
          <PostCard
            image="/img/clay-coils.jpg"
            imagePos="center 50%"
            category="Template"
            title={
              <a className="link" href="#post-card">
                Il preventivo che chiude: struttura e testi pronti
              </a>
            }
            delay={0.08}
          />
          <PostCard
            image="/img/rust-fabric.jpg"
            imagePos="center 35%"
            category="News"
            title="Revenue Farm apre l’elenco pubblico degli installatori certificati"
            verified="Verificato il 09/08/2026"
            delay={0.16}
          />
        </Posts>
      </Story>

      <Story
        title="Categorie lunghe · titoli corti e lunghi"
        note="the mono eyebrow wraps rather than truncating; a one-line title still leaves the stamp on the bottom edge"
      >
        <Posts>
          <PostCard
            href="#post-card"
            image="/img/dune-3.jpg"
            imagePos="center 60%"
            category="Comunicato stampa"
            title="Bilancio 2026"
            verified="Verificato il 14/08/2026"
          />
          <PostCard
            href="#post-card"
            image="/img/amber-glass-2.jpg"
            imagePos="center 25%"
            category="Intervista"
            title="«Abbiamo smesso di comprare liste»: come una PMI bresciana ha ricostruito il proprio processo commerciale in quattro mesi"
            verified="Verificato il 02/08/2026"
            delay={0.08}
          />
          <PostCard
            href="#post-card"
            image="/img/cobalt-foam.jpg"
            imagePos="center 45%"
            category="Guida"
            title="Accumulo, colonnina e pompa di calore: come si costruisce il preventivo completo"
            verified="Verificato il 21/07/2026"
            delay={0.16}
          />
        </Posts>
      </Story>
    </>
  );
}
