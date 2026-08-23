import { useState } from "react";
import { ArrowRightIcon, DownloadIcon, MoreHorizontalIcon, PlayIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import { Label, Row, Story } from "@/playground/lib/story";

const productVariants = ["primary", "quiet", "danger", "ghost", "link"] as const;
const marketingVariants = ["primary", "glass", "on-dark", "glass-dark"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

export default function ButtonStories() {
  const [pressed, setPressed] = useState(true);
  return (
    <div className="grid">
      <Story title="Variants × sizes" note="every variant carries a 1px border (transparent on primary / ghost / link) so the heights match: xs 24 · sm 32 · md 34 · lg 40">
        {sizes.map((size) => (
          <Row key={size}>
            <Label>{size}</Label>
            {productVariants.map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant === "primary" ? "Avvia processo" : variant === "danger" ? "Elimina" : variant === "link" ? "Mostra tutto" : "Annulla"}
              </Button>
            ))}
          </Row>
        ))}
      </Story>

      <Story title="Icon sizes" note="ghost is the trigger face (menu trigger, sidebar toggle); quiet for a bordered one">
        <Row>
          {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
            <Button key={size} variant="ghost" size={size} aria-label="Altro">
              <MoreHorizontalIcon />
            </Button>
          ))}
          <Label>ghost</Label>
          {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
            <Button key={size} variant="quiet" size={size} aria-label="Aggiungi">
              <PlusIcon />
            </Button>
          ))}
          <Label>quiet</Label>
          <Button variant="primary" size="icon" aria-label="Avvia">
            <PlayIcon />
          </Button>
          <Label>primary</Label>
        </Row>
      </Story>

      <Story title="The destructive ladder" note="rung 1 `destructive`: quiet, warms to critical under the pointer · rung 2 `variant=danger`: critical at rest">
        <Row>
          <Button destructive>Rimuovi connessione</Button>
          <Button variant="ghost" destructive size="icon" aria-label="Elimina">
            <Trash2Icon />
          </Button>
          <Button variant="danger">Elimina definitivamente</Button>
          <Button variant="primary" destructive>
            ignored on primary
          </Button>
        </Row>
      </Story>

      <Story title="Pressed (a toggle that is on)" note="`pressed` renders aria-pressed; an ordinary verb never claims to be a toggle">
        <Row>
          <Button pressed={pressed} onClick={() => setPressed((p) => !p)}>
            Solo aperti
          </Button>
          <Button pressed={!pressed} onClick={() => setPressed((p) => !p)}>
            Tutti
          </Button>
          <Button variant="ghost" size="icon" pressed aria-label="Filtro attivo">
            <PlusIcon />
          </Button>
          <Label>click to flip</Label>
        </Row>
      </Story>

      <Story title="Disabled" note="opacity .5, cursor not-allowed, no hover">
        <Row>
          {productVariants.map((variant) => (
            <Button key={variant} variant={variant} disabled>
              {variant}
            </Button>
          ))}
        </Row>
      </Story>

      <Story title="With icon" note="16px at md/lg, 14px at xs/sm, stroke 1.5; leading or trailing">
        <Row>
          <Button variant="primary">
            <PlusIcon />
            Nuovo processo
          </Button>
          <Button>
            <DownloadIcon />
            Esporta
          </Button>
          <Button size="sm">
            Apri la timeline
            <ArrowRightIcon />
          </Button>
          <Button variant="ghost" size="xs">
            <PlusIcon />
            Aggiungi
          </Button>
        </Row>
      </Story>

      <Story title="As a link" note="`<Button render={<a href/>}>` replaces Luminars links-as-buttons and RF AppButtonLink / btnClass(href); Base UI is told it is not a native button">
        <Row>
          <Button variant="primary" render={<a href="#button" />}>
            Vai alla pagina
          </Button>
          <Button render={<a href="#button" />}>Documentazione</Button>
          <Button variant="link" render={<a href="#button" />}>
            Tutte le esecuzioni
          </Button>
        </Row>
      </Story>

      <Story title="Italian-length labels" note="nowrap; the pill stretches, the height holds">
        <Row>
          <Button variant="primary">Conferma e avvia la registrazione</Button>
          <Button>Annulla le modifiche non salvate</Button>
          <Button size="sm">Riprova la sincronizzazione</Button>
          <Button size="xs">Ignora</Button>
        </Row>
      </Story>

      <Story title="Composed: a page head" note="one ink primary per screen; everything else is quiet">
        <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-5 py-4">
          <div className="grid gap-0.5">
            <span className="eyebrow">Processi</span>
            <strong className="font-voice text-xl">Aggiornamento settimanale</strong>
          </div>
          <Row>
            <Button>Modifica</Button>
            <Button variant="primary">
              <PlayIcon />
              Avvia
            </Button>
          </Row>
        </div>
      </Story>

      <Story title="Composed: a table row" note="row verbs are quiet sm; the one ghost icon holds the menu">
        <div className="overflow-hidden rounded-md border border-border bg-card">
          {[
            ["Invio preventivo", "ieri, 14:02", 12],
            ["Riepilogo riunione", "3 giorni fa", 4],
          ].map(([name, when, n]) => (
            <div key={String(name)} className="flex items-center gap-4 border-b border-border px-4 py-2 last:border-b-0">
              <span className="flex-1 text-13 font-medium">{name}</span>
              <span className="text-xs text-muted-foreground">{when}</span>
              <span className="num text-xs text-faint">{n}</span>
              <Button size="sm">Apri</Button>
              <Button variant="ghost" size="icon-sm" aria-label="Altro">
                <MoreHorizontalIcon />
              </Button>
            </div>
          ))}
        </div>
      </Story>

      <Story title="Marketing" note="switch Surface → marketing: glass = RF .btn--quiet, on-dark / glass-dark sit on a dark band; xl = the RF hero size (50). Active nudges 1px down on the marketing surface only">
        <Row>
          {marketingVariants.slice(0, 2).map((variant) => (
            <Button key={variant} variant={variant} size="xl">
              {variant === "primary" ? "Prenota una demo" : "Scopri come funziona"}
            </Button>
          ))}
          {marketingVariants.slice(0, 2).map((variant) => (
            <Button key={variant} variant={variant} size="lg">
              {variant === "primary" ? "Prenota una demo" : "Scopri come funziona"}
            </Button>
          ))}
        </Row>
        <div className="flex flex-wrap items-center gap-3 rounded-md bg-inverse p-6">
          <Button variant="on-dark" size="xl">
            Inizia ora
          </Button>
          <Button variant="glass-dark" size="xl">
            Guarda il video
          </Button>
          <Button variant="on-dark" size="lg">
            Inizia ora
          </Button>
          <Button variant="glass-dark" size="lg">
            Guarda il video
          </Button>
        </div>
      </Story>
    </div>
  );
}
