import { useState } from "react";

import { FilterChip } from "@/registry/grana/ui/filter-chip";
import { Label, Row, Story } from "@/playground/lib/story";

const categories = [
  ["crm", "CRM", 4],
  ["mail", "Email", 2],
  ["calendar", "Calendario", 1],
  ["docs", "Documenti", 6],
  ["chat", "Messaggistica", 3],
  ["project", "Gestione progetti", 5],
  ["finance", "Fatturazione e pagamenti", 2],
] as const;

export default function FilterChipStories() {
  const [picked, setPicked] = useState<Set<string>>(new Set(["crm", "docs"]));
  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <div className="grid">
      <Story title="States" note="height 30; selected = the deeper canvas tint + 500, the hairline stays">
        <Row>
          <FilterChip>Al riposo</FilterChip>
          <FilterChip selected>Selezionato</FilterChip>
          <FilterChip count={12}>Con conteggio</FilterChip>
          <FilterChip selected count={3}>
            Selezionato, con conteggio
          </FilterChip>
          <FilterChip disabled>Disabilitato</FilterChip>
          <FilterChip disabled selected>
            Disabilitato, selezionato
          </FilterChip>
        </Row>
      </Story>

      <Story title="A wrapping many-of-many set" note="the connector catalog: click to flip; aria-pressed reports the state">
        <div className="flex max-w-[520px] flex-wrap gap-2">
          {categories.map(([id, label, n]) => (
            <FilterChip key={id} selected={picked.has(id)} onSelectedChange={() => toggle(id)} count={n}>
              {label}
            </FilterChip>
          ))}
        </div>
        <Row>
          <Label>{picked.size} selected</Label>
        </Row>
      </Story>

      <Story title="Uncontrolled">
        <Row>
          <FilterChip defaultSelected>Parte selezionato</FilterChip>
          <FilterChip>Parte a riposo</FilterChip>
        </Row>
      </Story>
    </div>
  );
}
