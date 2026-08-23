import { Progress, ProgressLabel, ProgressValue } from "@/registry/grana/ui/progress";
import { Label, Row, Story } from "@/playground/lib/story";

export default function ProgressStories() {
  return (
    <div className="max-w-[420px]">
      <Story title="Values" note="a 2px stone-200 track, an ink bar; never a brand hue">
        <div className="grid gap-4">
          {[0, 25, 50, 75, 100].map((v) => (
            <Row key={v} className="flex-nowrap gap-4">
              <Label>{String(v).padStart(3, "0")}</Label>
              <Progress value={v} className="flex-1" />
            </Row>
          ))}
        </div>
      </Story>

      <Story title="With label and value" note="the readout is num">
        <Progress value={62}>
          <ProgressLabel>Indicizzazione</ProgressLabel>
          <ProgressValue />
        </Progress>
      </Story>

      <Story title="Custom readout">
        <Progress value={148} max={320}>
          <ProgressLabel>Contatti importati</ProgressLabel>
          <ProgressValue>{(_formatted, value) => `${value} / 320`}</ProgressValue>
        </Progress>
      </Story>

      <Story title="Indeterminate" note="value={null}: the bar withdraws; pair with a Spinner + word if it lasts">
        <Progress value={null}>
          <ProgressLabel>Preparazione dell&apos;esportazione…</ProgressLabel>
        </Progress>
      </Story>

      <Story title="Italian-length label">
        <Progress value={33}>
          <ProgressLabel>Riconciliazione delle fatture del terzo trimestre</ProgressLabel>
          <ProgressValue />
        </Progress>
      </Story>
    </div>
  );
}
