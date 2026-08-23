import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/grana/ui/input-group";
import { Kbd } from "@/registry/grana/ui/kbd";
import { CopyIcon, EyeIcon, MailIcon, SearchIcon } from "lucide-react";
import { Label, Story } from "@/playground/lib/story";

export default function InputGroupStories() {
  return (
    <div className="max-w-3xl">
      <Story title="The ⌘K search" note="RF .search → variant=search: stone-50 fill, icon in text-faint, a kbd at the end">
        <div className="grid max-w-sm gap-3">
          <InputGroup variant="search">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput type="search" placeholder="Cerca processi, esecuzioni, persone…" aria-label="Cerca" />
            <InputGroupAddon align="inline-end">
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Story>

      <Story title="Addons" note="prefix / suffix / unit / button inside the shell">
        <div className="grid max-w-sm gap-3">
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput type="email" placeholder="nome.cognome@azienda.it" aria-label="Email" />
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput defaultValue="luminars-cloud.vercel.app" aria-label="Dominio" />
          </InputGroup>

          <InputGroup>
            <InputGroupInput mono defaultValue="1.250" aria-label="Importo" className="text-right" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>€ / mese</InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <InputGroup>
            <InputGroupInput mono type="password" defaultValue="sk-live-7f3a9c2e4b1d8e6f" aria-label="Chiave API" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Mostra">
                <EyeIcon />
              </InputGroupButton>
              <InputGroupButton size="icon-xs" aria-label="Copia">
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <InputGroup>
            <InputGroupInput placeholder="Invita per email" aria-label="Invita" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="primary" size="xs">
                Invia
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Story>

      <Story title="States" note="invalid · disabled — the group carries the state">
        <div className="grid max-w-sm gap-3">
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput defaultValue="mario.rossi@" aria-invalid aria-label="Non valido" />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput defaultValue="mario.rossi@azienda.it" disabled aria-label="Disabilitato" />
          </InputGroup>
        </div>
      </Story>

      <Story title="Block addons and a textarea" note="a counter under the field; a prompt with its send verb">
        <div className="grid max-w-md gap-3">
          <InputGroup>
            <InputGroupTextarea placeholder="Chiedi qualcosa sulle esecuzioni di questa settimana…" aria-label="Prompt" />
            <InputGroupAddon align="block-end" className="justify-between border-t border-border">
              <InputGroupText className="num text-xs">0 / 2.000</InputGroupText>
              <InputGroupButton variant="primary" size="xs">
                Invia
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Label>the shell grows with the textarea (h-auto)</Label>
        </div>
      </Story>
    </div>
  );
}
