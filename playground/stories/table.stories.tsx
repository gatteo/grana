import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import { Card, CardHeader } from "@/registry/grana/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/grana/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/grana/ui/table";
import { Label, Row, Story } from "@/playground/lib/story";

type Tone = "ok" | "attention" | "warning" | "quiet";

const processes: { name: string; owner: string; state: string; tone: Tone; runs: number; minutes: number; last: string }[] = [
  { name: "Riconciliazione fatture", owner: "Amministrazione", state: "Pronto", tone: "ok", runs: 128, minutes: 4.2, last: "2026-08-23 09:41" },
  { name: "Aggiornamento settimanale del team", owner: "Direzione", state: "In attesa", tone: "warning", runs: 31, minutes: 11.8, last: "2026-08-22 18:05" },
  { name: "Onboarding nuovo cliente", owner: "Customer success", state: "Bloccato", tone: "attention", runs: 9, minutes: 26.0, last: "2026-08-20 10:12" },
  { name: "Report incassi mensile", owner: "Finanza", state: "Pronto", tone: "ok", runs: 12, minutes: 2.7, last: "2026-08-01 07:30" },
  { name: "Richiesta preventivo installatori", owner: "Vendite", state: "Pronto", tone: "ok", runs: 412, minutes: 0.9, last: "2026-08-23 11:58" },
  { name: "Archiviazione contratti scaduti", owner: "Legale", state: "Archiviato", tone: "quiet", runs: 3, minutes: 7.5, last: "2026-06-30 16:00" },
];

/* A stand-in for the status Chip (dot + word) so this story does not depend on the status group. */
function ChipPlaceholder({ tone, children }: { tone: Tone; children: string }) {
  const dot =
    tone === "ok" ? "bg-status-good" : tone === "attention" ? "bg-status-critical" : tone === "warning" ? "bg-status-warning" : "bg-stone-400";
  return (
    <span className="inline-flex h-5 items-center gap-1.5 rounded-full border border-border px-2 text-xs text-muted-foreground">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

function OverflowMenu({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" aria-label={`Azioni per ${name}`} />}>
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Apri</DropdownMenuItem>
        <DropdownMenuItem>Duplica</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Elimina</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Rows({ menu = true }: { menu?: boolean }) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Processo</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead num>Esecuzioni</TableHead>
          <TableHead num>Durata media</TableHead>
          <TableHead num>Ultima</TableHead>
          {menu ? <TableHead aria-label="Azioni" /> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {processes.map((p) => (
          <TableRow key={p.name}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>
              <ChipPlaceholder tone={p.tone}>{p.state}</ChipPlaceholder>
            </TableCell>
            <TableCell className="text-muted-foreground">{p.owner}</TableCell>
            <TableCell num>{p.runs}</TableCell>
            <TableCell num>{p.minutes.toFixed(1)} min</TableCell>
            <TableCell num className="text-muted-foreground">
              {p.last}
            </TableCell>
            {menu ? (
              <TableCell className="w-0 py-1 pr-2">
                <OverflowMenu name={p.name} />
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default function TableStories() {
  return (
    <div>
      <Story title="Luminars defaults" note="13.5px, hairline rows, mono-caps head with 14px top air, no fill, no hover — inside a Card padded=false">
        <Card padded={false}>
          <CardHeader title="Processi" context="6 di 41" />
          <Table>
            <Rows />
          </Table>
        </Card>
      </Story>

      <Story title="RF headerFill hover minWidth" note="the `.data` recipe: sunken head band, rows tint under the pointer, 720px minimum and sideways scroll inside the card">
        <Card padded={false}>
          <CardHeader title="Opportunità" context="€ 1.240.000" />
          <Table headerFill hover minWidth={720}>
            <Rows />
          </Table>
        </Card>
      </Story>

      <Story title="bleed inside a padded Card" note="the rules reach 12px past the card's content edge on both sides; cell text stays on the content edge">
        <Card className="max-w-2xl">
          <span className="eyebrow">Ultime esecuzioni</span>
          <Table bleed>
            <Rows menu={false} />
          </Table>
        </Card>
      </Story>

      <Story title="rowHeight · align=top · footer · caption" note="a fixed 44px row; top-aligned cells for multi-line content; a tfoot total">
        <Card padded={false} className="max-w-2xl">
          <Table rowHeight={44} align="top">
            <TableCaption>Totali del trimestre, aggiornati ogni notte.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Unità</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead num>Importo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Demand</TableCell>
                <TableCell className="max-w-[28ch] whitespace-normal text-muted-foreground">
                  Comprende le campagne chiuse entro il trimestre e le estensioni contrattuali.
                </TableCell>
                <TableCell num>412.300</TableCell>
              </TableRow>
              <TableRow data-state="selected">
                <TableCell className="font-medium">Piattaforma</TableCell>
                <TableCell className="text-muted-foreground">selected row</TableCell>
                <TableCell num>188.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Academy</TableCell>
                <TableCell className="text-muted-foreground">—</TableCell>
                <TableCell num>96.450</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Totale</TableCell>
                <TableCell num>696.750</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
        <Row>
          <Label>th/td `num` prop or a bare `data-num` attribute → right-aligned mono</Label>
        </Row>
      </Story>
    </div>
  );
}
