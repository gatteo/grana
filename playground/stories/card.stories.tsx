import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/grana/ui/card";
import { Eyebrow } from "@/registry/grana/ui/eyebrow";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/grana/ui/table";
import { Label, Row, Story } from "@/playground/lib/story";

const rows = [
  { name: "Riconciliazione fatture", steps: 14, last: "2h fa" },
  { name: "Aggiornamento settimanale del team", steps: 9, last: "ieri" },
  { name: "Onboarding nuovo cliente", steps: 22, last: "3g fa" },
];

export default function CardStories() {
  return (
    <div>
      <Story title="Padded (default)" note="white, 1px hairline, 10px radius, 18px 20px — the Luminars Card">
        <div className="grid max-w-2xl gap-3">
          <Card>
            <span className="eyebrow">Processo</span>
            <p className="text-sm">
              Una card porta un&apos;unità di contenuto. L&apos;eyebrow come primo figlio prende 10px d&apos;aria sotto.
            </p>
          </Card>
          <Card tone="sunken">
            <p className="text-sm text-muted-foreground">tone=&quot;sunken&quot; — the surface-2 ground, for a panel inside a panel.</p>
          </Card>
          <Card elevated>
            <p className="text-sm">elevated — carries shadow-card; the RF product surface nulls it through the token.</p>
          </Card>
          <Card render={<section />} aria-label="Sezione">
            <p className="text-sm text-muted-foreground">render=&lt;section /&gt; — the Luminars `as` prop.</p>
          </Card>
        </div>
      </Story>

      <Story title="Header · RF PanelHead" note="500 title left, mono context right, hairline below; `title context actions` props or CardTitle / CardDescription / CardAction children">
        <div className="grid max-w-2xl gap-3">
          <Card padded={false}>
            <CardHeader title="Pipeline" context="€ 1.240.000 · 12 opportunità" />
            <CardContent>
              <p className="text-sm text-muted-foreground">padded=false: the head pads itself 14px 16px; the content pads itself 16px.</p>
            </CardContent>
          </Card>
          <Card padded={false}>
            <CardHeader>
              <div className="flex min-w-0 flex-col gap-0.5">
                <CardTitle render={<h2 />}>Ultime attività</CardTitle>
                <CardDescription>Gli ultimi sette giorni, tutte le unità.</CardDescription>
              </div>
              <CardAction>
                <Button size="xs">Esporta</Button>
                <Button size="xs" variant="ghost" aria-label="Apri">
                  <ArrowRightIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Composed children: title + description stacked, actions at the right.</p>
            </CardContent>
            <CardFooter>
              <span className="num text-xs text-faint">aggiornato 14:02</span>
              <Button size="xs" variant="ghost" className="ml-auto">
                Mostra tutto
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader title="Dentro una card paddata" context="03" />
            <p className="text-sm text-muted-foreground">
              In a padded Card the head sits inside the padding and keeps only the hairline + 14px below it.
            </p>
          </Card>
        </div>
      </Story>

      <Story title="padded=false wrapping a Table" note="the card owns the border and clips the rows to its radius — a list panel">
        <Card padded={false} className="max-w-2xl">
          <CardHeader title="Processi" context="3 di 41" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead num>Passi</TableHead>
                <TableHead num>Ultima esecuzione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell num>{r.steps}</TableCell>
                  <TableCell num>{r.last}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Story>

      <Story
        title="layout — la direzione della card"
        note="`stack` (default) è l’unico che tocca un figlio: un eyebrow figlio diretto è l’etichetta della card e prende 10px d’aria sotto. `layout=row` non impone nulla: l’eyebrow resta del chiamante, allineato con il resto della riga"
      >
        <div className="grid max-w-2xl gap-3">
          <Card layout="row">
            <Eyebrow>In esecuzione</Eyebrow>
            <span className="text-13 text-muted-foreground">
              Riconciliazione fatture · passo 4 di 14
            </span>
            <Button size="xs" variant="ghost" className="ml-auto">
              Apri
            </Button>
          </Card>
          <Card layout="row" tone="sunken" className="gap-2">
            <Eyebrow tint="demand">Demand</Eyebrow>
            <Eyebrow className="text-muted-foreground">·</Eyebrow>
            <Eyebrow>12 campagne</Eyebrow>
            <span className="num ml-auto text-13">€ 412.300</span>
          </Card>
          <Card className="gap-2.5">
            <div className="flex items-center gap-2">
              <Eyebrow>Nota</Eyebrow>
              <span className="text-13 text-faint">
                una riga annidata dentro una card impilata: l’eyebrow resta inline-flex
              </span>
            </div>
            <p className="text-sm">
              La card impilata continua a dare i 10px d’aria solo all’eyebrow che è figlio diretto —
              tutto il resto lo dispone chi scrive la pagina.
            </p>
          </Card>
        </div>
      </Story>

      <Story title="Long content" note="Italian-length title and context; the title truncates only if the caller asks">
        <Card padded={false} className="max-w-md">
          <CardHeader
            title="Riconciliazione delle fatture passive del trimestre con i movimenti bancari"
            context="Q3 · 2026"
            actions={<Button size="xs">Apri</Button>}
          />
          <CardContent>
            <p className="text-sm">
              Il processo confronta ogni fattura registrata con il corrispondente movimento e segnala le differenze
              superiori a un euro; le eccezioni finiscono nella coda di revisione.
            </p>
          </CardContent>
        </Card>
        <Row>
          <Label>Card · CardHeader · CardTitle · CardDescription · CardAction · CardContent · CardFooter</Label>
        </Row>
      </Story>
    </div>
  );
}
