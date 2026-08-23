import { Label as FieldLabelEl } from "@/registry/grana/ui/label";
import { Switch } from "@/registry/grana/ui/switch";
import { Label, Row, Story } from "@/playground/lib/story";

export default function SwitchStories() {
  return (
    <div className="max-w-3xl">
      <Story title="States" note="30×18 · sunken hairline track off · ink on · no brand hue">
        <Row className="gap-6">
          <div className="grid justify-items-center gap-2">
            <Switch aria-label="Spento" />
            <Label>off</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Switch defaultChecked aria-label="Acceso" />
            <Label>on</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Switch aria-invalid aria-label="Non valido" />
            <Label>invalid</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Switch disabled aria-label="Disabilitato" />
            <Label>disabled</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Switch disabled defaultChecked aria-label="Disabilitato acceso" />
            <Label>disabled on</Label>
          </div>
        </Row>
      </Story>

      <Story title="size=sm" note="24×14, for dense rows">
        <Row className="gap-6">
          <Switch size="sm" aria-label="Piccolo spento" />
          <Switch size="sm" defaultChecked aria-label="Piccolo acceso" />
          <Switch size="sm" disabled aria-label="Piccolo disabilitato" />
        </Row>
      </Story>

      <Story title="A settings row" note="label on the left, the switch at the row's end">
        <div className="grid max-w-md divide-y divide-border rounded-md border border-border bg-card">
          {[
            ["Notifiche sullo stato delle esecuzioni", "Un avviso di sistema quando un'esecuzione termina o si ferma.", true],
            ["Avvio automatico all'accesso", "Luminars si apre con la sessione e riprende la registrazione.", false],
            ["Condividi gli aggiornamenti con il workspace", "Richiede un workspace collegato.", false],
          ].map(([title, desc, on], i) => (
            <FieldLabelEl key={String(title)} className="items-start justify-between gap-4 p-3">
              <span className="grid gap-0.5">
                <span>{title}</span>
                <span className="text-xs font-normal text-muted-foreground">{desc}</span>
              </span>
              <Switch defaultChecked={Boolean(on)} disabled={i === 2} className="mt-0.5" />
            </FieldLabelEl>
          ))}
        </div>
      </Story>
    </div>
  );
}
