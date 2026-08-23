import { Separator } from "@/registry/grana/ui/separator";
import { Label, Row, Story } from "@/playground/lib/story";

export default function SeparatorStories() {
  return (
    <div>
      <Story title="Horizontal" note="the 1px hairline in border-border; role=separator">
        <div className="max-w-md text-sm">
          <p>Le esecuzioni recenti.</p>
          <Separator className="my-3" />
          <p className="text-muted-foreground">Quelle archiviate restano consultabili per 90 giorni.</p>
        </div>
      </Story>

      <Story title="Vertical" note="self-stretches in a flex row">
        <Row>
          <div className="flex h-5 items-center gap-3 text-13">
            <span>Tutti</span>
            <Separator orientation="vertical" />
            <span className="text-muted-foreground">Attivi</span>
            <Separator orientation="vertical" />
            <span className="text-muted-foreground">Archiviati</span>
          </div>
          <Label>orientation=vertical</Label>
        </Row>
      </Story>
    </div>
  );
}
