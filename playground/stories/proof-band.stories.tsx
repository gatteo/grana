import { ProofBand, ProofStat } from "@/registry/grana/ui/proof-band";
import { Story } from "@/playground/lib/story";

export default function ProofBandStories() {
  return (
    <>
      <Story
        title="La banda della home"
        note="four columns between hairlines on dotted paper, staggered 0.08s apart · folds to 2×2 under 820px"
      >
        <div className="-mx-8">
          <ProofBand>
            <ProofStat value={5000} prefix="+" label="trattative qualificate gestite nel 2025" />
            <ProofStat value={90} prefix="+" label="aziende sulla piattaforma" delay={0.08} />
            <ProofStat
              value={5}
              prefix="+"
              suffix=" MW"
              label="di impianti installati nel 2025"
              delay={0.16}
            />
            <ProofStat
              value={3.7}
              decimals={1}
              prefix="€ "
              suffix=" mln"
              label="di impianti chiusi nei casi studio pubblicati"
              delay={0.24}
            />
          </ProofBand>
        </div>
      </Story>

      <Story
        title="Etichette lunghe"
        note="the label is held to 22ch: four terms of very different lengths still stack into the same shape"
      >
        <div className="-mx-8">
          <ProofBand>
            <ProofStat
              value={1650000}
              prefix="€ "
              label="di fatturato chiuso da un'azienda nata a metà 2025, in meno di un anno"
            />
            <ProofStat
              value={67.3}
              decimals={1}
              suffix="×"
              label="di ritorno per ogni euro investito con noi, dato aggiornato ad agosto 2026"
              delay={0.08}
            />
            <ProofStat value={24500} prefix="€ " label="investiti" delay={0.16} />
            <ProofStat
              value={312}
              label="trattative qualificate consegnate in piattaforma sui cinque standard"
              delay={0.24}
            />
          </ProofBand>
        </div>
      </Story>

      <Story
        title="Senza stagger"
        note="delay is optional: without it the four columns enter together (no --d on the item)"
      >
        <div className="-mx-8">
          <ProofBand>
            <ProofStat value={600000} prefix="€ " label="fatturato chiuso in Abruzzo" />
            <ProofStat value={11800} prefix="€ " label="investiti con noi" />
            <ProofStat value={50.8} decimals={1} suffix="×" label="ritorno sull'investimento" />
            <ProofStat value={1} suffix="° trim." label="al primo impianto chiuso" />
          </ProofBand>
        </div>
      </Story>

      <Story
        title="Dentro il campo, non a tutta pagina"
        note="the band paints edge to edge and the Wrap holds the content on the 1280 measure — here the story is the page"
      >
        <ProofBand>
          <ProofStat value={5000} prefix="+" label="trattative qualificate gestite nel 2025" />
          <ProofStat value={90} prefix="+" label="aziende sulla piattaforma" delay={0.08} />
          <ProofStat
            value={5}
            prefix="+"
            suffix=" MW"
            label="di impianti installati nel 2025"
            delay={0.16}
          />
          <ProofStat
            value={3.7}
            decimals={1}
            prefix="€ "
            suffix=" mln"
            label="di impianti chiusi nei casi studio pubblicati"
            delay={0.24}
          />
        </ProofBand>
      </Story>
    </>
  );
}
