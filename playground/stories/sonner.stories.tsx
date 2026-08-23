import { Button } from "@/registry/grana/ui/button";
import { notify, toast, Toaster } from "@/registry/grana/ui/sonner";
import { Row, Story } from "@/playground/lib/story";

export default function SonnerStories() {
  return (
    <div>
      <Toaster position="bottom-right" />

      <Story title="notify(title, { tone })" note="the product's toast: a chip-tone dot, a title, a mono timestamp">
        <Row>
          <Button variant="quiet" size="sm" onClick={() => notify("Bozza salvata", { tone: "ok" })}>
            ok
          </Button>
          <Button variant="quiet" size="sm" onClick={() => notify("Esportazione non riuscita", { tone: "attention", description: "Il file supera i 25 MB." })}>
            attention
          </Button>
          <Button variant="quiet" size="sm" onClick={() => notify("Motore degradato", { tone: "serious", description: "Trascrizione in ritardo di 2 minuti." })}>
            serious
          </Button>
          <Button variant="quiet" size="sm" onClick={() => notify("Token Asana in scadenza", { tone: "warning" })}>
            warning
          </Button>
          <Button variant="quiet" size="sm" onClick={() => notify("3 run in attesa di risposta", { tone: "info" })}>
            info
          </Button>
          <Button variant="quiet" size="sm" onClick={() => notify("Impostazioni aggiornate")}>
            quiet
          </Button>
        </Row>
      </Story>

      <Story title="With an action">
        <Row>
          <Button
            variant="quiet"
            size="sm"
            onClick={() =>
              notify("Registrazione terminata", {
                tone: "ok",
                description: "Weekly team update · 41 min",
                action: { label: "Apri", onClick: () => {} },
              })
            }
          >
            action
          </Button>
          <Button
            variant="quiet"
            size="sm"
            onClick={() =>
              notify("Connettore Notion disconnesso", {
                tone: "attention",
                cancel: { label: "Ignora", onClick: () => {} },
                action: { label: "Riconnetti", onClick: () => {} },
              })
            }
          >
            action + cancel
          </Button>
          <Button variant="quiet" size="sm" onClick={() => notify("Senza orario", { tone: "info", at: false })}>
            no timestamp
          </Button>
        </Row>
      </Story>

      <Story title="sonner's own toast" note="the re-exported toast: type icons come from the Toaster's icon map">
        <Row>
          <Button variant="quiet" size="sm" onClick={() => toast.success("Salvato")}>
            toast.success
          </Button>
          <Button variant="quiet" size="sm" onClick={() => toast.error("Errore di rete")}>
            toast.error
          </Button>
          <Button variant="quiet" size="sm" onClick={() => toast.warning("Spazio quasi esaurito")}>
            toast.warning
          </Button>
          <Button variant="quiet" size="sm" onClick={() => toast.info("Aggiornamento disponibile")}>
            toast.info
          </Button>
          <Button
            variant="quiet"
            size="sm"
            onClick={() =>
              toast.promise(new Promise((r) => setTimeout(r, 1800)), {
                loading: "Esportazione in corso…",
                success: "Esportazione completata",
                error: "Esportazione non riuscita",
              })
            }
          >
            toast.promise
          </Button>
        </Row>
      </Story>

      <Story title="Italian-length">
        <Row>
          <Button
            variant="quiet"
            size="sm"
            onClick={() =>
              notify("Le impostazioni di sincronizzazione sono state aggiornate per tutti i dispositivi collegati", {
                tone: "ok",
                description: "La modifica sarà visibile al prossimo battito del motore, entro un minuto.",
              })
            }
          >
            long
          </Button>
        </Row>
      </Story>
    </div>
  );
}
