import { Card, CardHeader } from "@/registry/grana/ui/card";
import { Feed, FeedItem } from "@/registry/grana/ui/feed";
import { Story } from "@/playground/lib/story";

export default function FeedStories() {
  return (
    <>
      <Story title="Feed" note="actor + sentence + mono time; humans round, machines dashed square + a dashed badge after the sentence">
        <Card padded={false} className="max-w-[560px]">
          <CardHeader title="Attività" context="oggi · 6" />
          <Feed>
            <FeedItem kind="human" actor="Giulia Ferrante" time="14:32" dateTime="2026-08-23T14:32:00+02:00">
              <strong>Giulia Ferrante</strong> ha spostato <strong>Rossi S.p.A.</strong> in Proposta inviata.
            </FeedItem>
            <FeedItem kind="ai" actor="Assistente" time="14:10" dateTime="2026-08-23T14:10:00+02:00" label="Azione AI">
              Ha scritto il riepilogo della chiamata con <strong>Bianchi & Figli</strong> e lo ha allegato alla trattativa.
            </FeedItem>
            <FeedItem kind="system" actor="Sistema" time="13:58" dateTime="2026-08-23T13:58:00+02:00" label="Automatico">
              Trattativa <strong>Verdi Impianti</strong> segnata come persa dopo 45 giorni senza risposta.
            </FeedItem>
            <FeedItem kind="human" actor="Marco De Luca" time="ieri" dateTime="2026-08-22T18:05:00+02:00">
              <strong>Marco De Luca</strong> ha aggiunto una nota a <strong>Tecnoedil</strong>.
            </FeedItem>
            <FeedItem kind="ai" actor="Assistente" time="ieri" dateTime="2026-08-22T09:00:00+02:00">
              Promemoria inviato a <strong>Giulia Ferrante</strong>: la proposta per Rossi S.p.A. scade tra 3 giorni.
            </FeedItem>
          </Feed>
        </Card>
      </Story>

      <Story title="Luminars avatar fill" note="variant=outline: the canvas-deep hairline avatar from the Luminars shell">
        <Card padded={false} className="max-w-[560px]">
          <Feed>
            <FeedItem kind="human" actor="Matteo Giardino" variant="outline" time="10:08" dateTime="2026-08-23T10:08:00+02:00">
              <strong>Matteo Giardino</strong> ha approvato la procedura <strong>Aggiornamento settimanale</strong>.
            </FeedItem>
            <FeedItem kind="ai" actor="Agente" variant="outline" time="10:02" dateTime="2026-08-23T10:02:00+02:00" label="Agente">
              Ha chiesto una decisione al passo 3 e ha ripreso dopo la risposta.
            </FeedItem>
          </Feed>
        </Card>
      </Story>

      <Story title="Italian-length sentence" note="the text wraps under itself; the time stays under the text, never beside it">
        <Card padded={false} className="max-w-[420px]">
          <Feed>
            <FeedItem kind="system" actor="Sistema" time="03:00" dateTime="2026-08-23T03:00:00+02:00" label="Automatico">
              Pulizia notturna completata: 1.204 contatti verificati, 17 duplicati uniti, 3 indirizzi e-mail segnati come non
              validi dopo il terzo rimbalzo consecutivo.
            </FeedItem>
          </Feed>
        </Card>
      </Story>
    </>
  );
}
