import { useState } from "react";

import { Button } from "@/registry/grana/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/grana/ui/sheet";
import { Label, Row, Story } from "@/playground/lib/story";

const sides = ["right", "left", "top", "bottom"] as const;

export default function SheetStories() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Story title="Right · open by default" note="card ground, strong hairline on the attached edge, panel shadow, warm-ink veil; header and footer on hairlines">
        <Row>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button />}>Apri pannello</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Dettaglio esecuzione</SheetTitle>
                <SheetDescription>Riconciliazione fatture · 2026-08-23 09:41</SheetDescription>
              </SheetHeader>
              <div className="grid gap-3 px-5 py-4 text-sm">
                <p>
                  14 passi completati in <span className="num">4,2 min</span>. Nessuna eccezione aperta.
                </p>
                <p className="text-muted-foreground">
                  Il processo ha confrontato 312 fatture con i movimenti del conto principale e ha registrato due
                  differenze sotto soglia.
                </p>
              </div>
              <SheetFooter>
                <SheetClose render={<Button />}>Chiudi</SheetClose>
                <Button variant="primary">Apri il processo</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Row>
      </Story>

      <Story title="Every side">
        <Row>
          {sides.map((side) => (
            <Sheet key={side}>
              <SheetTrigger render={<Button size="sm" />}>{side}</SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Da {side}</SheetTitle>
                  <SheetDescription>Lo stesso pannello, ancorato a un altro bordo.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          ))}
          <Label>side</Label>
        </Row>
      </Story>
    </div>
  );
}
