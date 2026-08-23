import { InfoIcon, TriangleAlertIcon } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/grana/ui/alert";
import { Button } from "@/registry/grana/ui/button";
import { StatusDot } from "@/registry/grana/ui/status-dot";
import { Story } from "@/playground/lib/story";

export default function AlertStories() {
  return (
    <div className="max-w-[560px]">
      <Story title="Default" note="role=alert — a message about something that just happened; hairline on the card ground">
        <Alert>
          <AlertTitle>Bozza salvata</AlertTitle>
          <AlertDescription>La bozza del 23 agosto è pronta per la revisione.</AlertDescription>
        </Alert>
      </Story>

      <Story title="With a lucide icon">
        <Alert>
          <InfoIcon />
          <AlertTitle>Nuova versione disponibile</AlertTitle>
          <AlertDescription>
            Luminars 0.2.0 si installa al prossimo riavvio. <a href="#alert">Note di rilascio</a>
          </AlertDescription>
        </Alert>
      </Story>

      <Story title="With a StatusDot" note="the grana mark: a dot + word, no icon library">
        <Alert>
          <StatusDot tone="warning" />
          <AlertTitle>Token Asana in scadenza</AlertTitle>
          <AlertDescription>Scade tra 3 giorni. Rinnovalo dalle connessioni per non perdere le sincronizzazioni.</AlertDescription>
        </Alert>
      </Story>

      <Story title="Destructive" note="the one permitted coloured border; the mark and the title take the hue, never a fill">
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>Esportazione non riuscita</AlertTitle>
          <AlertDescription>Il file supera i 25 MB consentiti dal piano corrente.</AlertDescription>
        </Alert>
      </Story>

      <Story title="With an action">
        <Alert>
          <StatusDot tone="info" />
          <AlertTitle>3 run in attesa di risposta</AlertTitle>
          <AlertDescription>L&apos;agente ha bisogno di te per continuare.</AlertDescription>
          <AlertAction>
            <Button variant="quiet" size="xs">
              Apri
            </Button>
          </AlertAction>
        </Alert>
      </Story>

      <Story title="Italian-length, title only">
        <Alert>
          <AlertTitle>Le impostazioni di sincronizzazione sono state aggiornate per tutti i dispositivi collegati</AlertTitle>
        </Alert>
      </Story>
    </div>
  );
}
