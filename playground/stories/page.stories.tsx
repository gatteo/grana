import { Button } from "@/registry/grana/ui/button";
import { Page, PageHead } from "@/registry/grana/ui/page";
import { Label, Row, Story } from "@/playground/lib/story";

/* A dashed frame makes the page's own box visible; the page itself paints nothing. */
function Frame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed border-border-strong">{children}</div>;
}

export default function PageStories() {
  return (
    <>
      <Story title="Widths" note="narrow 760 · medium 860 · wide 1080 · full — three widths, no fourth">
        <div className="grid gap-3">
          {(["narrow", "medium", "wide", "full"] as const).map((w) => (
            <Frame key={w}>
              <Page width={w} pad="tight">
                <div className="rounded-xs border border-border bg-card px-3 py-2 text-13 text-muted-foreground">
                  <span className="eyebrow mr-2">width</span>
                  {w}
                </div>
              </Page>
            </Frame>
          ))}
        </div>
      </Story>

      <Story title="Padding steps" note="tight 22/28 · default 28/32 · roomy 32/40">
        <div className="grid gap-3">
          {(["tight", "default", "roomy"] as const).map((p) => (
            <Frame key={p}>
              <Page width="narrow" pad={p}>
                <div className="rounded-xs border border-border bg-card px-3 py-2 text-13 text-muted-foreground">
                  <span className="eyebrow mr-2">pad</span>
                  {p}
                </div>
              </Page>
            </Frame>
          ))}
        </div>
      </Story>

      <Story title="PageHead" note="title in font-voice (Cabinet on Luminars, General Sans on RF); subtitle tabular; one primary">
        <Frame>
          <Page width="medium">
            <PageHead
              title="Trattative"
              subtitle="128 trattative aperte · 14 in attesa di risposta · aggiornato alle 14:32"
              actions={
                <>
                  <Button variant="quiet">Esporta</Button>
                  <Button variant="primary">Nuova trattativa</Button>
                </>
              }
            />
            <p className="text-13 text-muted-foreground">Il contenuto della pagina inizia qui, venti pixel sotto l'intestazione.</p>
          </Page>
        </Frame>
      </Story>

      <Story title="PageHead · object size" note="the smaller display size of a detail screen; the eyebrow names the object kind">
        <Frame>
          <Page width="medium">
            <PageHead
              size="object"
              eyebrow="Processo · 0042"
              title="Aggiornamento settimanale del team"
              subtitle="Ultima esecuzione ieri alle 18:05 · 3 passi · 2 decisioni aperte"
              actions={<Button variant="quiet" size="sm">Esegui ora</Button>}
            />
          </Page>
        </Frame>
      </Story>

      <Story title="PageHead · Italian-length title, no actions" note="the title wraps and balances; the subtitle holds 62ch">
        <Frame>
          <Page width="narrow">
            <PageHead
              title="Impostazioni della sincronizzazione e dei consensi del dispositivo"
              subtitle="Qui decidi cosa lascia il dispositivo, quando, e chi nel tuo spazio di lavoro può vederlo. Ogni voce è reversibile."
            />
          </Page>
        </Frame>
      </Story>

      <Story title="PageHead with children" note="anything under the subtitle and above the content — a scheduler line, a filter row">
        <Frame>
          <Page width="medium" stack>
            <PageHead title="Esecuzioni" subtitle="42 nelle ultime 24 ore">
              <Row className="mt-3">
                <Label>filtro</Label>
                <Button variant="quiet" size="xs" pressed>
                  Tutte
                </Button>
                <Button variant="quiet" size="xs">
                  Fallite
                </Button>
                <Button variant="quiet" size="xs">
                  In attesa
                </Button>
              </Row>
            </PageHead>
            <div className="h-16 rounded-md border border-border bg-card" />
            <div className="h-16 rounded-md border border-border bg-card" />
          </Page>
        </Frame>
      </Story>
    </>
  );
}
