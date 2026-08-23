import { InfoIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/grana/ui/popover";
import { Label, Row, Story } from "@/playground/lib/story";

export default function PopoverStories() {
  return (
    <div>
      <Story title="Open by default" note="the Menu panel's skin with room for prose: popover ground, hairline, 10px radius, panel shadow, 13px text">
        <div className="flex h-56 items-start gap-3">
          <Popover defaultOpen>
            <PopoverTrigger render={<Button size="sm" />}>Dettagli</PopoverTrigger>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>Durata media</PopoverTitle>
                <PopoverDescription>
                  Media delle ultime 30 esecuzioni, esclusi i tentativi interrotti dall&apos;utente.
                </PopoverDescription>
              </PopoverHeader>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-13">
                <dt className="text-muted-foreground">Mediana</dt>
                <dd className="num text-right">3,9 min</dd>
                <dt className="text-muted-foreground">p95</dt>
                <dd className="num text-right">8,1 min</dd>
              </dl>
            </PopoverContent>
          </Popover>
          <Label>align=start</Label>
        </div>
      </Story>

      <Story title="Icon trigger · side=right">
        <Row>
          <Popover>
            <PopoverTrigger render={<Button variant="ghost" size="icon-xs" aria-label="Cos'è" />}>
              <InfoIcon />
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-56">
              <PopoverDescription>Un processo è una sequenza di passi che Luminars può ripetere per te.</PopoverDescription>
            </PopoverContent>
          </Popover>
        </Row>
      </Story>
    </div>
  );
}
