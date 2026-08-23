import { ChevronRightIcon, FileTextIcon, FolderIcon, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/registry/grana/ui/item";
import { Label, Row, Story } from "@/playground/lib/story";

const files = [
  { name: "Fatture_agosto.csv", meta: "312 righe · 48 KB", at: "09:41" },
  { name: "Estratto_conto.pdf", meta: "Conto principale, agosto", at: "09:38" },
  { name: "Differenze.xlsx", meta: "2 righe sotto soglia", at: "09:45" },
];

export default function ItemStories() {
  return (
    <div>
      <Story title="Group · hairline rows" note="rows divided by hairlines, no gaps; media · title/description · actions">
        <ItemGroup className="max-w-lg rounded-md border border-border bg-card">
          {files.map((f) => (
            <Item key={f.name}>
              <ItemMedia variant="icon">
                <FileTextIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{f.name}</ItemTitle>
                <ItemDescription>{f.meta}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="num text-xs text-faint">{f.at}</span>
                <Button variant="ghost" size="icon-xs" aria-label="Altro">
                  <MoreHorizontalIcon />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </Story>

      <Story title="Variants × sizes" note="outline frames one row; muted sinks it; sm / xs tighten">
        <div className="grid max-w-lg gap-2">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <FolderIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>outline</ItemTitle>
              <ItemDescription>A single framed row.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>muted · sm</ItemTitle>
              <ItemDescription>The sunken ground.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline" size="xs">
            <ItemContent>
              <ItemTitle>outline · xs</ItemTitle>
            </ItemContent>
            <ItemActions>
              <span className="num text-xs text-faint">3</span>
            </ItemActions>
          </Item>
        </div>
      </Story>

      <Story title="Interactive row (a link)" note="render=<a>: the accent fill under the pointer">
        <ItemGroup className="max-w-lg rounded-md border border-border bg-card">
          <Item render={<a href="#item" />}>
            <ItemContent>
              <ItemTitle>Riconciliazione fatture</ItemTitle>
              <ItemDescription>Ultima esecuzione 2 ore fa · 14 passi</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4 text-faint" />
            </ItemActions>
          </Item>
          <Item render={<a href="#item" />}>
            <ItemContent>
              <ItemTitle>Aggiornamento settimanale del team</ItemTitle>
              <ItemDescription>
                Una descrizione lunga come quelle che capitano davvero: raccoglie i progressi della settimana da
                Asana, Linear e Notion e li riassume in un messaggio per il team.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4 text-faint" />
            </ItemActions>
          </Item>
        </ItemGroup>
      </Story>

      <Story title="Header · footer" note="basis-full rows above and below the content">
        <Item variant="outline" className="max-w-lg">
          <ItemHeader>
            <span className="eyebrow">Esecuzione 128</span>
            <span className="num text-xs text-faint">2026-08-23</span>
          </ItemHeader>
          <ItemContent>
            <ItemTitle>Completata senza eccezioni</ItemTitle>
            <ItemDescription>14 passi in 4,2 minuti.</ItemDescription>
          </ItemContent>
          <ItemFooter>
            <Button size="xs">Apri</Button>
            <Button size="xs" variant="ghost">
              Riesegui
            </Button>
          </ItemFooter>
        </Item>
        <Row>
          <Label>Item · ItemMedia · ItemContent · ItemTitle · ItemDescription · ItemActions · ItemHeader · ItemFooter · ItemGroup</Label>
        </Row>
      </Story>
    </div>
  );
}
