import { useState } from "react";

import { Button } from "@/registry/grana/ui/button";
import { FirstVisit } from "@/registry/grana/ui/first-visit";
import { Row, Story } from "@/playground/lib/story";

const IDS = ["playground.processes", "playground.timeline", "playground.long"];

export default function FirstVisitStories() {
  const [epoch, setEpoch] = useState(0);
  return (
    <>
      <Story title="Reset" note="dismissals persist in localStorage under grana.guide.<id>; this forgets them">
        <Row>
          <Button
            variant="quiet"
            size="xs"
            onClick={() => {
              IDS.forEach((id) => localStorage.removeItem(`grana.guide.${id}`));
              setEpoch((e) => e + 1);
            }}
          >
            Mostra di nuovo tutti i pannelli
          </Button>
        </Row>
      </Story>

      <Story title="First visit" note="inline, never modal — the surface stays usable while it teaches">
        <FirstVisit key={epoch} id={IDS[0]} title="Cosa vedi in questa lista" dismissLabel="Ho capito">
          Ogni riga è un processo che Luminars ha imparato da una tua sessione. Il punto colorato dice se l'ultima esecuzione
          è andata a buon fine; il numero a destra è quante volte è stato eseguito.
        </FirstVisit>
        <div className="h-20 rounded-md border border-border bg-card" />
      </Story>

      <Story title="Short">
        <FirstVisit key={epoch} id={IDS[1]} title="La cronologia è in ordine inverso" dismissLabel="Ok">
          Le esecuzioni più recenti stanno in alto.
        </FirstVisit>
      </Story>

      <Story title="Italian-length, with a link" note="the body holds 68ch and the dismiss never wraps">
        <FirstVisit
          key={epoch}
          id={IDS[2]}
          title="Questi dati non lasciano il dispositivo senza il tuo consenso"
          dismissLabel="Chiudi questo avviso"
        >
          Le registrazioni restano qui. Quello che viene sincronizzato con lo spazio di lavoro è solo la procedura scritta,
          mai il video né l'audio. Puoi cambiare idea in qualsiasi momento da{" "}
          <a href="#first-visit" className="underline underline-offset-4">
            Impostazioni › Sincronizzazione
          </a>
          .
        </FirstVisit>
      </Story>
    </>
  );
}
