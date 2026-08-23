import { useEffect, useState } from "react";
import { Button } from "@/registry/grana/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/grana/ui/command";
import { Kbd } from "@/registry/grana/ui/kbd";
import {
  CalendarIcon,
  FileTextIcon,
  FolderIcon,
  KeyRoundIcon,
  PlugIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Row, Story } from "@/playground/lib/story";

function Palette() {
  return (
    <>
      <CommandInput placeholder="Cerca un processo, un'esecuzione o un comando…" />
      <CommandList>
        <CommandEmpty>Nessun risultato per questa ricerca.</CommandEmpty>
        <CommandGroup heading="Processi">
          <CommandItem>
            <FolderIcon />
            Aggiornamento settimanale del team commerciale
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FolderIcon />
            Preparazione della relazione trimestrale
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FileTextIcon />
            Riepilogo della riunione di lunedì
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Comandi">
          <CommandItem>
            <CalendarIcon />
            Registra una nuova sessione
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <PlugIcon />
            Collega un connettore (Asana, Linear, Notion)
          </CommandItem>
          <CommandItem disabled>
            <KeyRoundIcon />
            Ruota la chiave API (workspace richiesto)
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Impostazioni">
          <CommandItem>
            <UserIcon />
            Profilo
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            Preferenze dell'applicazione
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

export default function CommandStories() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="max-w-3xl">
      <Story title="Inline palette" note="bg-popover · hairline · rounded-md · shadow-panel · eyebrow headings · bg-accent highlight · num shortcuts">
        <div className="max-w-lg">
          <Command>
            <Palette />
          </Command>
        </div>
      </Story>

      <Story title="Empty" note="a query with no match">
        <div className="max-w-lg">
          <Command>
            <CommandInput placeholder="Cerca…" value="zzz-nessuna-corrispondenza" />
            <CommandList>
              <CommandEmpty>Nessun risultato per questa ricerca.</CommandEmpty>
              <CommandGroup heading="Processi">
                <CommandItem>Aggiornamento settimanale</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </Story>

      <Story title="CommandDialog" note="press ⌘K (or the button) — portalled, fixed, at a third of the viewport">
        <Row>
          <Button variant="quiet" onClick={() => setOpen(true)}>
            Apri la palette
          </Button>
          <Kbd>⌘K</Kbd>
        </Row>
        <CommandDialog open={open} onOpenChange={setOpen} title="Palette dei comandi" description="Cerca un processo o un comando">
          <Palette />
        </CommandDialog>
      </Story>
    </div>
  );
}
