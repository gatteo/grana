import { Button } from "@/registry/grana/ui/button";
import { Hero } from "@/registry/grana/ui/hero";
import { RisingPanel } from "@/registry/grana/ui/rising-panel";
import { Story } from "@/playground/lib/story";

/* A stand-in for `ProductShot`: the tenant dashboard drawn at 980px, so the panel has something
 * wide enough to prove the sideways scroll instead of reflowing. */
function ShotStub({ width = 980 }: { width?: number }) {
  const rows = [
    ["Bianchi Impianti Srl", "Preventivo inviato", "€ 48.500", "12 gen", "Marta R."],
    ["Cooperativa Agricola Verdi", "Sopralluogo fissato", "€ 126.000", "12 gen", "Luca P."],
    ["Metalfer SpA", "In trattativa", "€ 312.400", "11 gen", "Marta R."],
    ["Studio Tecnico Ferrari", "Primo contatto", "€ 21.900", "11 gen", "Giulia B."],
    ["Caseificio San Michele", "Contratto firmato", "€ 94.200", "10 gen", "Luca P."],
  ];
  return (
    <div style={{ minWidth: width }} className="grid grid-cols-[218px_minmax(0,1fr)] bg-ecru-deep">
      <div className="grid content-start gap-1 p-4">
        <span className="eyebrow mb-2">Revenue Farm</span>
        {["Trattative", "Preventivi", "Impianti", "Pratiche", "Recensioni"].map((item, i) => (
          <span
            key={item}
            className={
              i === 0
                ? "rounded-sm bg-stone-0 px-2.5 py-1.5 text-13 font-medium"
                : "px-2.5 py-1.5 text-13 text-muted-foreground"
            }
          >
            {item}
          </span>
        ))}
      </div>
      <div className="m-2 ml-0 rounded-md bg-stone-0 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <strong className="font-display text-lg">Trattative aperte</strong>
          <span className="num text-13 text-faint">128 · € 1.284.000</span>
        </div>
        <table className="w-full border-collapse text-13">
          <thead>
            <tr className="border-b border-border text-left">
              {["Azienda", "Stato", "Valore", "Aggiornata", "Responsabile"].map((head) => (
                <th key={head} className="eyebrow py-2 font-normal">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-border last:border-0">
                <td className="py-2.5 font-medium">{row[0]}</td>
                <td className="py-2.5 text-muted-foreground">{row[1]}</td>
                <td className="num py-2.5">{row[2]}</td>
                <td className="num py-2.5 text-faint">{row[3]}</td>
                <td className="py-2.5 text-muted-foreground">{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RisingPanelStories() {
  return (
    <>
      <Story
        title="RisingPanel · rising out of the hero"
        note="revenuefarm.it/ — the panel is pulled up into the field by clamp(6.5rem, 11.5vw, 10rem); the fold is the product, not a seam"
      >
        <div>
          <Hero
            image="/img/dune-2.jpg"
            eyebrow="Piattaforma e servizi"
            title="La piattaforma che fa crescere chi installa impianti industriali."
            lead="Generiamo le trattative e costruiamo quello che serve per chiuderle: processi commerciali, team di vendita e la piattaforma dove trattative, preventivi, pratiche e recensioni vivono in un posto solo."
            primary={<Button variant="on-dark">Prenota una demo</Button>}
            secondary={<Button variant="glass-dark">Vedi la piattaforma</Button>}
            note="Migrazione dei dati inclusa."
            stakes={[
              { label: "+5.000 trattative gestite nel 2025", x: "60%", y: "22%" },
              { label: "+5 MW installati nel 2025", x: "79%", y: "38%" },
            ]}
          />
          <RisingPanel
            caption="Dati di esempio, formato quello vero. Sotto il marchio di ogni installatore, la piattaforma è questa."
            captionLink={
              <a className="link" href="#rising-panel">
                Scopri la piattaforma →
              </a>
            }
          >
            <ShotStub />
          </RisingPanel>
        </div>
      </Story>

      <Story
        title="RisingPanel · no caption"
        note="caption and captionLink are both optional; without either the caption row is not rendered at all"
      >
        <RisingPanel className="mt-0">
          <ShotStub />
        </RisingPanel>
      </Story>

      <Story
        title="RisingPanel · caption only, and link only"
        note="one end of the row at a time — `justify-between` still puts the single child on the left"
      >
        <div className="grid gap-8">
          <RisingPanel className="mt-0 pb-0" caption="Dati di esempio, formato quello vero.">
            <ShotStub width={640} />
          </RisingPanel>
          <RisingPanel
            className="mt-0 pb-0"
            captionLink={
              <a className="link" href="#rising-panel">
                Scopri la piattaforma →
              </a>
            }
          >
            <ShotStub width={640} />
          </RisingPanel>
        </div>
      </Story>

      <Story
        title="RisingPanel · very wide content, long Italian caption"
        note="the shot scrolls sideways inside the panel instead of reflowing; the caption wraps onto two lines and keeps its two ends"
      >
        {/* `min-w-0` is the story harness, not the component: `Story` lays its children out in a
            grid, and a grid item is floored at its min-content size — 1600px here. On the site the
            band sits in block flow, where the 1600px shot only ever scrolls inside the panel. */}
        <RisingPanel
          className="mt-0 min-w-0"
          caption="Dati di esempio, formato quello vero. Sotto il marchio di ogni installatore la piattaforma è esattamente questa, con gli stessi campi, gli stessi stati e la stessa scheda cliente per tutta la squadra."
          captionLink={
            <a className="link" href="#rising-panel">
              Vedi la dashboard completa →
            </a>
          }
        >
          <ShotStub width={1600} />
        </RisingPanel>
      </Story>
    </>
  );
}
