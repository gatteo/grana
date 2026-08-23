import { BackLink } from "@/registry/grana/ui/back-link";
import { Label, Row, Story } from "@/playground/lib/story";

export default function BackLinkStories() {
  return (
    <div className="grid">
      <Story title="Variants" note="inline = the kit recipe above a detail page (faint 13px); nav = the shell recipe (a padded row with the nav hover fill)">
        <Row>
          <BackLink>Processi</BackLink>
          <Label>inline</Label>
          <BackLink variant="nav">Tutte le esecuzioni</BackLink>
          <Label>nav</Label>
        </Row>
      </Story>

      <Story title="As a link" note="`render={<a href/>}` hands it to a router">
        <Row>
          <BackLink render={<a href="#back-link" />}>Connessioni</BackLink>
          <BackLink variant="nav" render={<a href="#back-link" />}>
            Torna alla timeline
          </BackLink>
        </Row>
      </Story>

      <Story title="Disabled + long label">
        <Row>
          <BackLink disabled>Indietro</BackLink>
          <BackLink>Torna all'elenco dei processi registrati questa settimana</BackLink>
        </Row>
      </Story>

      <Story title="Composed: above a page head">
        <div className="grid gap-3.5 rounded-md border border-border bg-card px-5 py-4">
          <BackLink>Processi</BackLink>
          <div className="grid gap-0.5">
            <span className="eyebrow">Processo</span>
            <strong className="font-voice text-xl">Invio preventivo</strong>
          </div>
        </div>
      </Story>
    </div>
  );
}
