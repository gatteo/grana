import { Panel, PanelScroll, Plot } from "@/registry/grana/ui/panel";
import { Label, Story } from "@/playground/lib/story";

const DEALS = [
  ["Comune di Rovigo", "Fotovoltaico 480 kWp", "Preventivo inviato", "€ 214.000", "12 gg"],
  ["Caseificio Val d'Enza", "Fotovoltaico 210 kWp + accumulo", "In trattativa", "€ 98.500", "4 gg"],
  ["Stampaggio Brianza S.r.l.", "Efficientamento illuminazione", "Sopralluogo fissato", "€ 41.200", "1 gg"],
  ["Logistica Adriatica", "Fotovoltaico 1,2 MWp", "Qualificata", "€ 640.000", "oggi"],
];

export default function PanelStories() {
  return (
    <>
      <Story
        title="Panel — il prodotto, incorniciato"
        note="white, a darker hairline than the page's (ink 12%), the deep panel shadow, corners clipped at 6px"
      >
        <Panel>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="eyebrow">Trattative</span>
            <span className="num ml-auto text-[13px] text-faint">4 aperte · € 993.700</span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {DEALS.map((row) => (
                <tr key={row[0]} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-medium">{row[0]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
                  <td className="num px-4 py-3 text-right">{row[3]}</td>
                  <td className="num px-4 py-3 text-right text-faint">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <p className="mt-3 max-w-text text-sm text-muted-foreground">
          È l&apos;unico posto dove la scala d&apos;ombra arriva a <span className="num">panel</span>:
          uno screenshot deve staccarsi dalla carta.
        </p>
      </Story>

      <Story
        title="PanelScroll — la via di fuga orizzontale"
        note="a wide table or diagram scrolls inside the frame instead of pushing the page sideways"
      >
        <Panel className="max-w-[520px]">
          <PanelScroll>
            <table className="w-max text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Azienda",
                    "Impianto",
                    "Stato",
                    "Valore",
                    "Ultimo contatto",
                    "Fonte",
                    "Venditore",
                    "Chiusura prevista",
                  ].map((h) => (
                    <th key={h} className="eyebrow px-4 py-3 text-left whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEALS.map((row) => (
                  <tr key={row[0]} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{row[0]}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{row[1]}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{row[2]}</td>
                    <td className="num px-4 py-3 text-right whitespace-nowrap">{row[3]}</td>
                    <td className="num px-4 py-3 text-right whitespace-nowrap text-faint">{row[4]}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">Campagna</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">M. Bertoli</td>
                    <td className="num px-4 py-3 whitespace-nowrap text-right">15/09/2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PanelScroll>
        </Panel>
      </Story>

      <Story
        title="Plot — la scheda neutra"
        note="raised paper, the page hairline, the image corner (8px), no shadow at rest — everything that is not the product"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            [
              "Generazione trattative",
              "Trattative qualificate a costo garantito per trattativa, consegnate in piattaforma.",
            ],
            [
              "Consulenza commerciale",
              "Il tuo processo di vendita, riscritto con chi lo esegue tutti i giorni.",
            ],
            [
              "Inserimento venditori",
              "Persone dalla nostra rete, già formate sul modo in cui si vende un impianto.",
            ],
          ].map(([title, copy]) => (
            <Plot key={title} className="p-5">
              <span className="eyebrow">Servizi</span>
              <h3 className="h3 mt-2">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
            </Plot>
          ))}
        </div>
      </Story>

      <Story
        title="I due, affiancati"
        note="the Panel lifts, the Plot does not — that difference is the whole point of having both"
      >
        <div className="grid grid-cols-2 items-start gap-6">
          <div>
            <Panel className="p-5">
              <span className="eyebrow">Panel</span>
              <p className="mt-2 text-sm text-muted-foreground">
                stone-0 · hairline ink 12% · rounded-sm · shadow-panel
              </p>
            </Panel>
            <Label>Panel</Label>
          </div>
          <div>
            <Plot className="p-5">
              <span className="eyebrow">Plot</span>
              <p className="mt-2 text-sm text-muted-foreground">
                bg-card · border-border · rounded-img · nessuna ombra
              </p>
            </Plot>
            <Label>Plot</Label>
          </div>
        </div>
      </Story>

      <Story
        title="Contenuto lungo, senza padding proprio"
        note="neither surface pads itself: a full-bleed screenshot must be able to touch the frame"
      >
        <div className="grid grid-cols-2 items-start gap-6">
          <Panel>
            <div className="h-[120px] bg-[image:var(--dots)] bg-[length:var(--dots-size)]" />
            <div className="border-t border-border p-4">
              <p className="text-sm text-muted-foreground">
                Dati di esempio, formato quello vero. Sotto il marchio di ogni installatore, la
                piattaforma è questa.
              </p>
            </div>
          </Panel>
          <Plot>
            <div className="h-[120px] rounded-t-img bg-muted" />
            <div className="border-t border-border p-4">
              <p className="text-sm text-muted-foreground">
                Ci porti un&apos;esigenza, torniamo con la soluzione costruita su misura: dentro la
                piattaforma o direttamente nel tuo spazio.
              </p>
            </div>
          </Plot>
        </div>
      </Story>
    </>
  );
}
