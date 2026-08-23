import { Button } from "@/registry/grana/ui/button";
import { Input } from "@/registry/grana/ui/input";
import { Label, Row, Story } from "@/playground/lib/story";

export default function InputStories() {
  return (
    <div className="max-w-3xl">
      <Story title="States" note="34px · hairline border-input · bg-card · 13px · placeholder text-faint">
        <div className="grid max-w-sm gap-3">
          <Input placeholder="Nome del processo" aria-label="Nome del processo" />
          <Input defaultValue="Aggiornamento settimanale del team commerciale" aria-label="Con valore" />
          <Input
            defaultValue="non-un-indirizzo"
            aria-invalid
            aria-label="Non valido"
          />
          <Input placeholder="Disabilitato" disabled aria-label="Disabilitato" />
          <Input defaultValue="Valore non modificabile" disabled aria-label="Disabilitato con valore" />
          <Input defaultValue="Sola lettura, ma selezionabile" readOnly aria-label="Sola lettura" />
        </div>
      </Story>

      <Story title="mono" note="keys, ids, times — the mono face, same shell">
        <div className="grid max-w-sm gap-3">
          <Input mono defaultValue="sk-live-7f3a9c2e4b1d8e6f" aria-label="Chiave API" />
          <Input mono defaultValue="proc_01J5Q7ZK3M9X" aria-label="Identificativo" />
          <Input mono placeholder="hh:mm" defaultValue="09:30" className="w-24" aria-label="Orario" />
          <Input mono type="number" defaultValue="1234" className="w-32" aria-label="Numero" />
          <Input mono defaultValue="sk-…" disabled aria-label="Chiave disabilitata" />
        </div>
      </Story>

      <Story title="variant=search" note="RF .search — the sunken stone-50 fill; the icon + kbd form lives in input-group">
        <div className="grid max-w-sm gap-3">
          <Input variant="search" type="search" placeholder="Cerca processi, esecuzioni, persone…" aria-label="Cerca" />
        </div>
      </Story>

      <Story title="Types" note="native types keep the shell">
        <div className="grid max-w-sm gap-3">
          <Input type="email" placeholder="nome.cognome@azienda.it" aria-label="Email" />
          <Input type="password" defaultValue="una-password-lunga" aria-label="Password" />
          <Input type="date" defaultValue="2026-08-23" className="w-44" aria-label="Data" />
          <Input type="file" aria-label="Allegato" />
        </div>
      </Story>

      <Story title="On a row with buttons" note="the 34px shell aligns with Button md">
        <Row>
          <Input placeholder="Invita per email" className="w-64" aria-label="Invita per email" />
          <Button variant="primary">Invia l'invito</Button>
          <Button variant="quiet">Annulla</Button>
        </Row>
        <Row>
          <Label>md quiet (34) · input (34)</Label>
        </Row>
      </Story>

      <Story title="Long content" note="Italian-length placeholders and values truncate inside the shell">
        <div className="grid max-w-xs gap-3">
          <Input placeholder="Descrizione sintetica dell'attività ricorrente da monitorare ogni settimana" aria-label="Lungo" />
          <Input defaultValue="Preparazione della relazione trimestrale per il consiglio di amministrazione" aria-label="Lungo con valore" />
        </div>
      </Story>
    </div>
  );
}
