import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/grana/ui/collapsible";
import { Label, Row, Story } from "@/playground/lib/story";

function Block({ defaultOpen, label }: { defaultOpen?: boolean; label: string }) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible max-w-md rounded-md border border-border bg-card">
      <CollapsibleTrigger
        render={<Button variant="ghost" size="sm" className="w-full justify-start rounded-b-none px-3 text-foreground" />}
      >
        <ChevronRightIcon className="transition-transform group-data-open/collapsible:rotate-90" />
        {label}
        <span className="num ml-auto text-xs text-faint">3</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border">
        <ul className="grid gap-1 px-3 py-2.5 text-13 text-muted-foreground">
          <li>Apri il gestionale</li>
          <li>Filtra le fatture del mese</li>
          <li>Esporta il CSV</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function CollapsibleStories() {
  return (
    <div>
      <Story title="Open · closed" note="unstyled Base UI primitive; the caller composes the trigger (a ghost Button) and the panel — the chevron turns on data-open">
        <Row className="items-start">
          <Block defaultOpen label="Passi del processo" />
          <Block label="Passi del processo" />
          <Label>defaultOpen · closed</Label>
        </Row>
      </Story>
    </div>
  );
}
