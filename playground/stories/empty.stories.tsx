import { InboxIcon, SearchIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import { Card } from "@/registry/grana/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/grana/ui/empty";
import { Story } from "@/playground/lib/story";

export default function EmptyStories() {
  return (
    <>
      <Story title="plain (RF `.empty`)" note="a centred faint line, no box — inside an unpadded Card">
        <Card padded={false}>
          <Empty>
            <EmptyHeader>
              <EmptyDescription>Nessuna attività negli ultimi sette giorni.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      </Story>

      <Story title="plain with title and media">
        <Card padded={false}>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchIcon />
              </EmptyMedia>
              <EmptyTitle>Nessun risultato per “fattura 2024”</EmptyTitle>
              <EmptyDescription>Prova con un nome cliente o un numero di trattativa.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="quiet" size="sm">
                Azzera la ricerca
              </Button>
            </EmptyContent>
          </Empty>
        </Card>
      </Story>

      <Story title="card (Luminars `Notice`)" note="a sunken hairline card for a condition the person did not cause; title in font-voice">
        <Empty variant="card">
          <EmptyHeader>
            <EmptyTitle>Il dispositivo non ha ancora inviato nulla</EmptyTitle>
            <EmptyDescription>
              La sincronizzazione è attiva ma la prima esecuzione non è ancora stata registrata. Non devi fare niente: il
              prossimo processo completato comparirà qui da solo.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Story>

      <Story title="card with an action">
        <Empty variant="card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>Accesso sospeso</EmptyTitle>
            <EmptyDescription>
              L'abbonamento dello spazio di lavoro è scaduto il 12 agosto. I dati restano al sicuro; le esecuzioni sono in
              pausa finché un amministratore non lo rinnova.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="items-start">
            <Button variant="quiet" size="sm">
              Contatta l'amministratore
            </Button>
          </EmptyContent>
        </Empty>
      </Story>
    </>
  );
}
