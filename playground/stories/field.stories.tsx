import { Button } from "@/registry/grana/ui/button";
import { Checkbox } from "@/registry/grana/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/grana/ui/field";
import { Input } from "@/registry/grana/ui/input";
import { Label as LabelEl } from "@/registry/grana/ui/label";
import { NativeSelect, NativeSelectOption } from "@/registry/grana/ui/native-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/grana/ui/select";
import { Switch } from "@/registry/grana/ui/switch";
import { Textarea } from "@/registry/grana/ui/textarea";
import { Row, Story } from "@/playground/lib/story";

const fusi = {
  "Europe/Rome": "Europa / Roma (CET)",
  "Europe/London": "Europa / Londra (GMT)",
  "America/New_York": "America / New York (EST)",
};

export default function FieldStories() {
  return (
    <div className="max-w-3xl">
      <Story title="Label" note="sans 500 · 13px">
        <Row className="gap-6">
          <LabelEl htmlFor="l1">Nome del processo</LabelEl>
          <LabelEl htmlFor="l2">
            Indirizzo email di lavoro <span className="font-normal text-faint">(facoltativo)</span>
          </LabelEl>
        </Row>
      </Story>

      <Story title="Field anatomy" note="RF .field: label + control + 6px gap · description text-muted-foreground · error = .form-error (13px, status-critical)">
        <div className="grid max-w-sm gap-6">
          <Field>
            <FieldLabel htmlFor="f-name">Nome del processo</FieldLabel>
            <Input id="f-name" placeholder="Es. Aggiornamento settimanale" />
            <FieldDescription>Come apparirà nella lista e nelle notifiche.</FieldDescription>
          </Field>

          <Field data-invalid>
            <FieldLabel htmlFor="f-email">Indirizzo email di lavoro</FieldLabel>
            <Input id="f-email" type="email" defaultValue="mario.rossi@" aria-invalid />
            <FieldError>Inserisci un indirizzo email completo, ad esempio nome@azienda.it.</FieldError>
          </Field>

          <Field data-invalid>
            <FieldLabel htmlFor="f-key">Chiave API del fornitore</FieldLabel>
            <Input id="f-key" mono defaultValue="sk-" aria-invalid />
            <FieldDescription>La trovi nelle impostazioni del tuo account.</FieldDescription>
            <FieldError
              errors={[
                { message: "La chiave è troppo corta." },
                { message: "La chiave deve iniziare con «sk-live-» oppure «sk-test-»." },
                { message: "La chiave è troppo corta." },
              ]}
            />
          </Field>

          <Field data-disabled="true">
            <FieldLabel htmlFor="f-ws">Workspace</FieldLabel>
            <Input id="f-ws" defaultValue="Personale" disabled />
            <FieldDescription>Si sceglie al primo accesso e non cambia.</FieldDescription>
          </Field>
        </div>
      </Story>

      <Story title="Horizontal" note="orientation=horizontal — a checkbox or switch with its label and description">
        <div className="grid max-w-md gap-4">
          <Field orientation="horizontal">
            <Checkbox id="h-1" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="h-1">Includi le esecuzioni interrotte</FieldLabel>
              <FieldDescription>Anche quelle fermate manualmente con «Interrompi».</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="h-2">Notifiche sullo stato delle esecuzioni</FieldLabel>
              <FieldDescription>Un avviso di sistema quando un'esecuzione termina o si ferma.</FieldDescription>
            </FieldContent>
            <Switch id="h-2" defaultChecked />
          </Field>
        </div>
      </Story>

      <Story title="Choice cards" note="a FieldLabel wrapping a Field: hairline card, bg-muted when checked">
        <FieldGroup className="max-w-md">
          {[
            ["Solo io", "Le esecuzioni restano sul tuo computer; niente viene condiviso.", true],
            ["Il mio team", "Esecuzioni e riepiloghi visibili a chi fa parte del workspace.", false],
          ].map(([t, d, on]) => (
            <FieldLabel key={String(t)}>
              <Field orientation="horizontal">
                <Checkbox defaultChecked={Boolean(on)} />
                <FieldContent>
                  <FieldTitle>{t}</FieldTitle>
                  <FieldDescription>{d}</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </FieldGroup>
      </Story>

      <Story title="Settings form" note="the composed example: Field + Label + Input + Description + Error · a Select · a Textarea · a Switch row · a Checkbox list · primary/quiet pair">
        <form
          className="max-w-lg rounded-md border border-border bg-card p-5 shadow-card"
          onSubmit={(e) => e.preventDefault()}
        >
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Profilo</FieldLegend>
              <FieldDescription>Come ti presenti al team e dove ti raggiungiamo.</FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="s-name">Nome visualizzato</FieldLabel>
                  <Input id="s-name" defaultValue="Matteo Giardino" />
                </Field>
                <Field data-invalid>
                  <FieldLabel htmlFor="s-email">Indirizzo email di lavoro</FieldLabel>
                  <Input id="s-email" type="email" defaultValue="matteo@" aria-invalid />
                  <FieldDescription>Riceverai qui il codice di accesso a sei cifre.</FieldDescription>
                  <FieldError>Inserisci un indirizzo email completo.</FieldError>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="s-tz">Fuso orario</FieldLabel>
                    <Select items={fusi} defaultValue="Europe/Rome">
                      <SelectTrigger id="s-tz">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(fusi).map(([v, l]) => (
                          <SelectItem key={v} value={v}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="s-lang">Lingua dei riepiloghi</FieldLabel>
                    <NativeSelect id="s-lang" defaultValue="it">
                      <NativeSelectOption value="it">Italiano</NativeSelectOption>
                      <NativeSelectOption value="en">Inglese</NativeSelectOption>
                    </NativeSelect>
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Integrazioni</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="s-key">Chiave API del fornitore</FieldLabel>
                  <Input id="s-key" mono defaultValue="sk-live-7f3a9c2e4b1d8e6f" />
                  <FieldDescription>Resta sul tuo computer; non viene mai inviata al workspace.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="s-notes">Istruzioni per l'assistente</FieldLabel>
                  <Textarea
                    id="s-notes"
                    placeholder="Cosa deve sapere prima di proporre un riepilogo…"
                    defaultValue="Scrivi sempre in italiano. Quando un'esecuzione si ferma, chiedi prima di riprovare."
                  />
                </Field>
                <FieldSet>
                  <FieldLegend variant="label">Connettori da sincronizzare</FieldLegend>
                  <FieldGroup data-slot="checkbox-group">
                    {[
                      ["Asana — attività e progetti", true],
                      ["Linear — segnalazioni di prodotto", true],
                      ["Notion — pagine di aggiornamento settimanale", false],
                    ].map(([t, on], i) => (
                      <Field key={String(t)} orientation="horizontal">
                        <Checkbox id={`s-c${i}`} defaultChecked={Boolean(on)} />
                        <FieldLabel htmlFor={`s-c${i}`} className="font-normal">
                          {t}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="s-notify">Notifiche sullo stato delle esecuzioni</FieldLabel>
                <FieldDescription>Un avviso di sistema quando un'esecuzione termina o si ferma.</FieldDescription>
              </FieldContent>
              <Switch id="s-notify" defaultChecked />
            </Field>

            <Field orientation="horizontal" className="justify-end gap-2">
              <Button type="button" variant="quiet">
                Annulla
              </Button>
              <Button type="submit" variant="primary">
                Salva le modifiche
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </Story>
    </div>
  );
}
