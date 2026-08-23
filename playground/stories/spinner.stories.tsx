import { Button } from "@/registry/grana/ui/button";
import { Spinner } from "@/registry/grana/ui/spinner";
import { Label, Row, Story } from "@/playground/lib/story";

export default function SpinnerStories() {
  return (
    <div>
      <Story title="Sizes" note="inherits the text colour; 16px by default">
        <Row className="gap-6">
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-3" />
            <Label>12</Label>
          </span>
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-3.5" />
            <Label>14</Label>
          </span>
          <span className="inline-flex items-center gap-2">
            <Spinner />
            <Label>16</Label>
          </span>
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-6" />
            <Label>24</Label>
          </span>
        </Row>
      </Story>

      <Story title="Beside a word" note="work in progress reads as spinner + word, like a status reads as dot + word">
        <Row className="gap-6">
          <span className="inline-flex items-center gap-2 text-13 text-muted-foreground">
            <Spinner className="size-3.5" />
            Trascrizione in corso…
          </span>
          <span className="inline-flex items-center gap-2 text-13 text-muted-foreground">
            <Spinner className="size-3.5" />
            Sincronizzazione con il workspace
          </span>
        </Row>
      </Story>

      <Story title="Inside a button">
        <Row>
          <Button variant="primary" size="sm" disabled>
            <Spinner />
            Salvataggio…
          </Button>
          <Button variant="quiet" size="sm" disabled>
            <Spinner />
            Esportazione in corso
          </Button>
        </Row>
      </Story>
    </div>
  );
}
