import { useState } from "react";

import { Button } from "@/registry/grana/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/grana/ui/dialog";
import { Label, Row, Story } from "@/playground/lib/story";

export default function DialogStories() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Story title="Open by default" note="card ground, strong hairline, 14px radius, panel shadow (nulled on RF), a warm-ink veil at 40% — close it to see the triggers">
        <Row>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>Apri dialogo</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eliminare il processo?</DialogTitle>
                <DialogDescription>
                  «Riconciliazione fatture» e le sue 128 esecuzioni verranno rimossi. L&apos;operazione non si può
                  annullare.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button />}>Annulla</DialogClose>
                <Button variant="danger">Elimina</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Label>destructive confirm: quiet cancel + danger commit</Label>
        </Row>
      </Story>

      <Story title="Form dialog · no close button" note="showCloseButton=false; the footer's showCloseButton renders a quiet Close">
        <Row>
          <Dialog>
            <DialogTrigger render={<Button variant="primary" />}>Nuovo processo</DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Nuovo processo</DialogTitle>
                <DialogDescription>Dai un nome al processo; potrai cambiarlo in qualsiasi momento.</DialogDescription>
              </DialogHeader>
              <label className="grid gap-1.5 text-13">
                <span className="text-muted-foreground">Nome</span>
                <input
                  className="h-8 rounded-sm border border-border bg-card px-2.5 text-sm"
                  defaultValue="Aggiornamento settimanale del team"
                />
              </label>
              <DialogFooter showCloseButton>
                <Button variant="primary">Crea</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Story>
    </div>
  );
}
