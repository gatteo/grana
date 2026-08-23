import { Textarea } from "@/registry/grana/ui/textarea";
import { Story } from "@/playground/lib/story";

export default function TextareaStories() {
  return (
    <div className="max-w-3xl">
      <Story title="States" note="same shell · resize-none · line-height 1.5 · grows with content from 72px">
        <div className="grid max-w-md gap-3">
          <Textarea placeholder="Descrivi il flusso di lavoro in poche righe…" aria-label="Vuota" />
          <Textarea
            defaultValue="Ogni lunedì mattina raccolgo gli aggiornamenti dai tre team, li riassumo in una pagina e la invio al direttore commerciale prima della riunione delle 11."
            aria-label="Con valore"
          />
          <Textarea defaultValue="Troppo corto." aria-invalid aria-label="Non valida" />
          <Textarea placeholder="Disabilitata" disabled aria-label="Disabilitata" />
          <Textarea defaultValue="Nota non modificabile, il processo è in esecuzione." disabled aria-label="Disabilitata con valore" />
        </div>
      </Story>

      <Story title="Grows with content" note="field-sizing: content — no resize handle, the surface decides the ceiling">
        <div className="grid max-w-md gap-3">
          <Textarea
            defaultValue={[
              "1. Apri il foglio delle opportunità e filtra per «questa settimana».",
              "2. Per ogni riga aggiornata copia lo stato nella pagina Notion «Aggiornamento settimanale».",
              "3. Segnala le trattative ferme da più di dieci giorni al responsabile di area.",
              "4. Invia il riepilogo nel canale #commerciale entro le 10:45.",
            ].join("\n")}
            aria-label="Lunga"
          />
          <Textarea className="max-h-32" defaultValue={"Con un tetto: max-h-32.\n".repeat(12)} aria-label="Con tetto" />
        </div>
      </Story>
    </div>
  );
}
