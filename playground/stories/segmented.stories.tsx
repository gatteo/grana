import { useState } from "react";

import { Segmented } from "@/registry/grana/ui/segmented";
import { Label, Row, Story } from "@/playground/lib/story";

const runs = [
  { value: "all", label: "Tutte", count: 128 },
  { value: "open", label: "Aperte", count: 7 },
  { value: "done", label: "Concluse", count: 121 },
] as const;

const ranges = [
  { value: "7d", label: "7 giorni" },
  { value: "30d", label: "30 giorni" },
  { value: "90d", label: "Trimestre" },
  { value: "all", label: "Tutto" },
] as const;

type Run = (typeof runs)[number]["value"];
type Range = (typeof ranges)[number]["value"];

export default function SegmentedStories() {
  const [run, setRun] = useState<Run>("open");
  const [range, setRange] = useState<Range>("30d");
  return (
    <div className="grid">
      <Story title="pill (default)" note="the Luminars track: sunken ground, the active segment raised onto the surface with shadow-card (nulled on the RF app surface)">
        <Row>
          <Segmented label="Periodo" options={ranges} value={range} onChange={setRange} />
          <Label>md · track 36</Label>
          <Segmented label="Periodo" size="sm" options={ranges} value={range} onChange={setRange} />
          <Label>sm · track 32</Label>
        </Row>
      </Story>

      <Story title="boxed" note="the RF group: hairline separators, a sunken active segment">
        <Row>
          <Segmented label="Periodo" variant="boxed" options={ranges} value={range} onChange={setRange} />
          <Label>md · track 34</Label>
          <Segmented label="Periodo" variant="boxed" size="sm" options={ranges} value={range} onChange={setRange} />
          <Label>sm · track 32</Label>
        </Row>
      </Story>

      <Story title="With counts" note="counts are `num`; faint at rest, secondary on the active segment">
        <Row>
          <Segmented label="Esecuzioni" options={runs} value={run} onChange={setRun} />
          <Segmented label="Esecuzioni" variant="boxed" options={runs} value={run} onChange={setRun} />
        </Row>
      </Story>

      <Story title="Disabled" note="the whole group, or one option">
        <Row>
          <Segmented label="Periodo" options={ranges} value={range} onChange={setRange} disabled />
          <Segmented
            label="Esecuzioni"
            variant="boxed"
            options={[...runs.slice(0, 2), { ...runs[2], disabled: true }]}
            value={run}
            onChange={setRun}
          />
        </Row>
      </Story>

      <Story title="Italian-length labels">
        <Row>
          <Segmented
            label="Vista"
            options={[
              { value: "a", label: "Registrazioni recenti" },
              { value: "b", label: "In attesa di revisione" },
              { value: "c", label: "Archiviate" },
            ]}
            value="b"
            onChange={() => {}}
          />
        </Row>
      </Story>

      <Story title="Composed: a list head">
        <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-5 py-3">
          <strong className="text-13 font-medium">
            Esecuzioni <span className="num ml-1 text-faint">{runs.find((r) => r.value === run)?.count}</span>
          </strong>
          <Segmented label="Esecuzioni" size="sm" options={runs} value={run} onChange={setRun} />
        </div>
      </Story>
    </div>
  );
}
