import { SearchIcon } from "lucide-react";

import { Kbd, KbdGroup } from "@/registry/grana/ui/kbd";
import { Label, Row, Story } from "@/playground/lib/story";

export default function KbdStories() {
  return (
    <div className="grid">
      <Story title="Keys" note="mono 10px on the sunken fill inside a hairline, 4px radius, 20 tall">
        <Row>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>↵</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>⌥ Space</Kbd>
        </Row>
      </Story>

      <Story title="Groups">
        <Row>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span className="text-xs text-faint">+</span>
            <Kbd>⇧</Kbd>
            <span className="text-xs text-faint">+</span>
            <Kbd>P</Kbd>
          </KbdGroup>
        </Row>
      </Story>

      <Story title="Composed: the topbar search" note="the RF ⌘K affordance, inside a field">
        <div className="flex max-w-[380px] items-center gap-2 rounded-sm border border-border bg-muted px-3 py-[7px] text-13 text-faint">
          <SearchIcon className="size-3.5 stroke-[1.5]" />
          <span className="flex-1">Cerca lead, preventivi, contatti…</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
        <Row>
          <span className="text-13 text-muted-foreground">
            Premi <Kbd>?</Kbd> per le scorciatoie
          </span>
          <Label>inline in text</Label>
        </Row>
      </Story>
    </div>
  );
}
