import { useState } from "react";
import { BoldIcon, ItalicIcon, LayoutGridIcon, ListIcon, UnderlineIcon } from "lucide-react";

import { Toggle } from "@/registry/grana/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/registry/grana/ui/toggle-group";
import { Label, Row, Story } from "@/playground/lib/story";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function ToggleStories() {
  const [view, setView] = useState<string[]>(["list"]);
  const [marks, setMarks] = useState<string[]>(["bold"]);
  return (
    <div className="grid">
      <Story title="Toggle · variants × sizes" note="pills; pressed = the deeper canvas tint, ink text, a firmer hairline (the ground a pressed Button takes)">
        {sizes.map((size) => (
          <Row key={size}>
            <Label>{size}</Label>
            <Toggle size={size}>Default</Toggle>
            <Toggle size={size} defaultPressed>
              Default on
            </Toggle>
            <Toggle size={size} variant="outline">
              Outline
            </Toggle>
            <Toggle size={size} variant="outline" defaultPressed>
              Outline on
            </Toggle>
            <Toggle size={size} aria-label="Grassetto">
              <BoldIcon />
            </Toggle>
            <Toggle size={size} variant="outline" defaultPressed aria-label="Corsivo">
              <ItalicIcon />
            </Toggle>
          </Row>
        ))}
      </Story>

      <Story title="Toggle · disabled">
        <Row>
          <Toggle disabled>Disabilitato</Toggle>
          <Toggle disabled defaultPressed>
            Disabilitato, on
          </Toggle>
          <Toggle variant="outline" disabled>
            Outline
          </Toggle>
          <Toggle variant="outline" disabled defaultPressed>
            Outline, on
          </Toggle>
        </Row>
      </Story>

      <Story title="ToggleGroup · spaced" note="multiple: a formatting bar">
        <Row>
          <ToggleGroup multiple value={marks} onValueChange={setMarks} aria-label="Formattazione">
            <ToggleGroupItem value="bold" aria-label="Grassetto">
              <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Corsivo">
              <ItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Sottolineato">
              <UnderlineIcon />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup multiple variant="outline" size="sm" defaultValue={["italic"]} aria-label="Formattazione">
            <ToggleGroupItem value="bold">Grassetto</ToggleGroupItem>
            <ToggleGroupItem value="italic">Corsivo</ToggleGroupItem>
            <ToggleGroupItem value="underline">Sottolineato</ToggleGroupItem>
          </ToggleGroup>
        </Row>
      </Story>

      <Story title="ToggleGroup · joined (spacing 0)" note="one pill track with hairline separators; for a one-of-N filter prefer Segmented">
        <Row>
          <ToggleGroup variant="outline" spacing={0} value={view} onValueChange={(v) => v.length && setView(v)} aria-label="Vista">
            <ToggleGroupItem value="list" aria-label="Elenco">
              <ListIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Griglia">
              <LayoutGridIcon />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup variant="outline" size="sm" spacing={0} defaultValue={["week"]} aria-label="Periodo">
            <ToggleGroupItem value="day">Giorno</ToggleGroupItem>
            <ToggleGroupItem value="week">Settimana</ToggleGroupItem>
            <ToggleGroupItem value="month">Mese</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup variant="outline" size="sm" spacing={0} orientation="vertical" defaultValue={["b"]} aria-label="Verticale">
            <ToggleGroupItem value="a">Uno</ToggleGroupItem>
            <ToggleGroupItem value="b">Due</ToggleGroupItem>
            <ToggleGroupItem value="c">Tre</ToggleGroupItem>
          </ToggleGroup>
        </Row>
      </Story>
    </div>
  );
}
