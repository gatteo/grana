import { InfoIcon, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import { Kbd, KbdGroup } from "@/registry/grana/ui/kbd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/grana/ui/tooltip";
import { Label, Row, Story } from "@/playground/lib/story";

export default function TooltipStories() {
  return (
    <TooltipProvider>
      <div className="grid">
        <Story title="Open (defaultOpen)" note="portalled, fixed; the popover ground + hairline + shadow-panel; 12px/1.45, max 260 wide; 7px above, 10px from any edge">
          <div className="flex flex-wrap items-end gap-10 pt-14">
            <Tooltip defaultOpen>
              <TooltipTrigger render={<Button />}>Ultima esecuzione</TooltipTrigger>
              <TooltipContent>Conclusa ieri alle 14:02, 3 passi su 3.</TooltipContent>
            </Tooltip>
            <Tooltip defaultOpen>
              <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Altro" />}>
                <MoreHorizontalIcon />
              </TooltipTrigger>
              <TooltipContent side="bottom">Altre azioni</TooltipContent>
            </Tooltip>
            <Tooltip defaultOpen>
              <TooltipTrigger render={<Button variant="quiet" size="sm" />}>Con scorciatoia</TooltipTrigger>
              <TooltipContent>
                <span className="flex items-center gap-2">
                  Cerca ovunque
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        </Story>

        <Story title="On hover / focus" note="180 ms to open, 120 ms grace to close (the popup is hoverable), focus opens at once, Escape dismisses, any scroll closes">
          <Row>
            <Tooltip>
              <TooltipTrigger render={<Button />}>Passa sopra</TooltipTrigger>
              <TooltipContent>Un suggerimento breve.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="primary" />}>Avvia</TooltipTrigger>
              <TooltipContent side="right">Registra questo processo una volta; Luminars imparerà i passi e li rieseguirà con te.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<span tabIndex={0} className="inline-flex items-center gap-1 text-13 text-muted-foreground" />}
              >
                Evidenza
                <InfoIcon className="size-3 stroke-[1.5] text-faint" />
              </TooltipTrigger>
              <TooltipContent>La riga della registrazione da cui è stato dedotto questo passo.</TooltipContent>
            </Tooltip>
            <Label>tab to the triggers</Label>
          </Row>
        </Story>

        <Story title="Italian-length content" note="wraps at 260">
          <div className="pt-20">
            <Tooltip defaultOpen>
              <TooltipTrigger render={<Button size="sm" />}>Perché questo passo?</TooltipTrigger>
              <TooltipContent>
                Questo passo è stato dedotto dalla registrazione del 12 agosto: hai aperto il preventivo, copiato il totale e
                lo hai incollato nel messaggio al cliente prima di inviarlo.
              </TooltipContent>
            </Tooltip>
          </div>
        </Story>
      </div>
    </TooltipProvider>
  );
}
