import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import { Card, CardDescription, CardTitle } from "@/registry/grana/ui/card";
import { Checkbox } from "@/registry/grana/ui/checkbox";
import { Input } from "@/registry/grana/ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/registry/grana/ui/item";
import { Switch } from "@/registry/grana/ui/switch";
import { Label, Row, Story } from "@/playground/lib/story";

/* The press (grana.css §6b) cannot be shown at rest: hold the pointer down on each example.
 * Four strengths, one per SIZE, so every edge travels about a pixel. */
export default function PressStories() {
  return (
    <div>
      <Story
        title="press-glyph · 0.94"
        note="icon-sized: an icon button, a checkbox, a switch, a code box, a row action. At 0.98 a 34px button's edge moved a third of a pixel"
      >
        <Row>
          <Button variant="ghost" size="icon" aria-label="Altro">
            <MoreHorizontalIcon />
          </Button>
          <Button variant="quiet" size="icon-sm" aria-label="Altro">
            <MoreHorizontalIcon />
          </Button>
          <Checkbox defaultChecked aria-label="Attivo" />
          <Switch defaultChecked aria-label="Cattura" />
          <Label>hold the pointer down</Label>
        </Row>
      </Story>

      <Story title="press · 0.98" note="compact controls: a verb, a chip, a tab, a toggle, a crumb (the button's feel since AGE-175)">
        <Row>
          <Button variant="primary">Avvia processo</Button>
          <Button>Esporta</Button>
          <Button disabled>Disattivato (non preme)</Button>
          <span className="press inline-flex h-8 items-center rounded-full border border-border-strong px-3.5 text-[12.5px] text-muted-foreground">
            className=&quot;press&quot;
          </span>
        </Row>
      </Story>

      <Story title="press-item · 0.99" note="a card, a tile, a menu or nav row: anything up to a column wide">
        <div className="grid max-w-2xl grid-cols-2 gap-3">
          <Card render={<a href="#press" />} className="no-underline">
            <CardTitle>Riconciliazione fatture</CardTitle>
            <CardDescription>A Card rendered as a link presses; a static one does not.</CardDescription>
          </Card>
          <Card>
            <CardTitle>Card statica</CardTitle>
            <CardDescription>No render, no press.</CardDescription>
          </Card>
        </div>
      </Story>

      <Story title="press-wide · 0.995" note="a field, a select, a full-width list row. At 0.98 a 600px field lurched 6px">
        <div className="grid max-w-2xl gap-3">
          <Input placeholder="Nome del processo" />
          <ItemGroup className="rounded-md border border-border">
            <Item render={<a href="#press" />}>
              <ItemContent>
                <ItemTitle>Una riga che apre il dettaglio</ItemTitle>
                <ItemDescription>An Item rendered as a link presses at the wide strength.</ItemDescription>
              </ItemContent>
              <ChevronRightIcon className="size-4 text-faint" />
            </Item>
            {/* A hand-rolled clickable row holding its own verb: the row presses, and while the
             * verb is the thing held down the row stays put (the nesting guard). */}
            <Item className="press-wide cursor-pointer hover:bg-accent">
              <ItemContent>
                <ItemTitle>Una riga con un verbo dentro</ItemTitle>
                <ItemDescription>Hold the row, then hold the button: only one of them gives.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm">Esegui</Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
      </Story>

      <Story title="press-none" note="switches the press off: the bare input inside an InputGroup (the group presses instead)">
        <Row>
          <Label>cn(&quot;press-wide&quot;, &quot;press-none&quot;) keeps only press-none</Label>
        </Row>
      </Story>
    </div>
  );
}
