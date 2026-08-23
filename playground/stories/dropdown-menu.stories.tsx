import { useState } from "react";
import { CopyIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/grana/ui/dropdown-menu";
import { Label, Row, Story } from "@/playground/lib/story";

export default function DropdownMenuStories() {
  const [showArchived, setShowArchived] = useState(true);
  const [sort, setSort] = useState("recent");
  return (
    <div>
      <Story title="Open by default" note="the Luminars Menu: 184px min, 4px padding, hairline, 10px radius, panel shadow; items 13px / 7px 10px / 6px radius; mono shortcuts; destructive in critical">
        <div className="flex h-72 items-start gap-3">
          <DropdownMenu defaultOpen modal={false}>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" aria-label="Altro" />}>
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Processo</DropdownMenuLabel>
                <DropdownMenuItem>
                  <PencilIcon />
                  Rinomina
                  <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon />
                  Duplica
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Esporta (presto)</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Sposta in</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Amministrazione</DropdownMenuItem>
                  <DropdownMenuItem>Vendite</DropdownMenuItem>
                  <DropdownMenuItem>Archivio</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Elimina
                <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Label>trigger: Button ghost icon-xs (26×26)</Label>
        </div>
      </Story>

      <Story title="Checkbox · radio items" note="selection marks sit at the right edge">
        <Row>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" />}>Vista</DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Mostra</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
                  Archiviati
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(String(v))}>
                <DropdownMenuLabel>Ordina per</DropdownMenuLabel>
                <DropdownMenuRadioItem value="recent">Più recenti</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Nome</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="runs">Esecuzioni</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" variant="ghost" />}>Lungo</DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Invia il riepilogo settimanale al responsabile di unità</DropdownMenuItem>
              <DropdownMenuItem>Chiudi</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Story>
    </div>
  );
}
