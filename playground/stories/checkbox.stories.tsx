import { Checkbox } from "@/registry/grana/ui/checkbox";
import { Label as FieldLabelEl } from "@/registry/grana/ui/label";
import { Label, Row, Story } from "@/playground/lib/story";

export default function CheckboxStories() {
  return (
    <div className="max-w-3xl">
      <Story title="States" note="16px · rounded-xs · hairline off · ink on · no brand hue">
        <Row className="gap-6">
          <div className="grid justify-items-center gap-2">
            <Checkbox aria-label="Spenta" />
            <Label>off</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Checkbox defaultChecked aria-label="Accesa" />
            <Label>on</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Checkbox indeterminate aria-label="Parziale" />
            <Label>indeterminate</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Checkbox aria-invalid aria-label="Non valida" />
            <Label>invalid</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Checkbox disabled aria-label="Disabilitata" />
            <Label>disabled</Label>
          </div>
          <div className="grid justify-items-center gap-2">
            <Checkbox disabled defaultChecked aria-label="Disabilitata accesa" />
            <Label>disabled on</Label>
          </div>
        </Row>
      </Story>

      <Story title="With a label" note="Label 13/500; the after: box widens the hit area to the row">
        <div className="grid gap-3">
          <FieldLabelEl>
            <Checkbox defaultChecked />
            Invia una notifica quando un'esecuzione termina
          </FieldLabelEl>
          <FieldLabelEl>
            <Checkbox />
            Includi le esecuzioni interrotte manualmente
          </FieldLabelEl>
          <FieldLabelEl>
            <Checkbox disabled />
            Condividi il riepilogo con il team (richiede un workspace)
          </FieldLabelEl>
        </div>
      </Story>

      <Story title="A checkbox list" note="the connectors to sync — Italian-length rows">
        <div className="grid max-w-md gap-2 rounded-md border border-border bg-card p-3">
          {[
            ["asana", "Asana — attività e progetti del team commerciale", true],
            ["linear", "Linear — segnalazioni e ticket di prodotto", true],
            ["notion", "Notion — pagine di aggiornamento settimanale e verbali", false],
            ["gmail", "Gmail — solo i messaggi etichettati «Luminars»", false],
          ].map(([id, text, on]) => (
            <FieldLabelEl key={String(id)} className="py-1">
              <Checkbox defaultChecked={Boolean(on)} name={String(id)} />
              <span className="font-normal">{text}</span>
            </FieldLabelEl>
          ))}
        </div>
      </Story>
    </div>
  );
}
