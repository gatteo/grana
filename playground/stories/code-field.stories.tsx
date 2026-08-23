import { useState } from "react";
import { CodeField } from "@/registry/grana/ui/code-field";
import { Label, Row, Story } from "@/playground/lib/story";

function Live({
  length = 6,
  size,
  invalid,
  disabled,
  initial = "",
}: {
  length?: number;
  size?: "lg" | "md";
  invalid?: boolean;
  disabled?: boolean;
  initial?: string;
}) {
  const [value, setValue] = useState(initial);
  const [note, setNote] = useState<string | null>(null);
  return (
    <div className="grid gap-2">
      <CodeField
        length={length}
        size={size}
        value={value}
        onValueChange={setValue}
        onComplete={(code) => setNote(`completo: ${code}`)}
        onPasteOther={(text) => {
          setNote(`incollato altro: ${text.slice(0, 42)}…`);
          return true;
        }}
        invalid={invalid}
        disabled={disabled}
        label="Codice di accesso"
        boxLabel={(index, total) => `Cifra ${index + 1} di ${total}`}
      />
      {note ? <Label>{note}</Label> : null}
    </div>
  );
}

export default function CodeFieldStories() {
  return (
    <div className="max-w-3xl">
      <Story
        title="Empty, partial, full"
        note="44×52 · mono 20px · filled boxes take the strong hairline"
      >
        <Row className="items-start gap-8">
          <div className="grid gap-2">
            <Live />
            <Label>empty</Label>
          </div>
          <div className="grid gap-2">
            <Live initial="4821" />
            <Label>partial</Label>
          </div>
          <div className="grid gap-2">
            <Live initial="482139" />
            <Label>full</Label>
          </div>
        </Row>
      </Story>

      <Story title="Refused" note="aria-invalid: destructive hairline and glyphs">
        <Live initial="482139" invalid />
      </Story>

      <Story title="Disabled" note="sunken, .6">
        <Live initial="4821" disabled />
      </Story>

      <Story title="size=md" note="36×42, for a card or a settings row">
        <Row className="items-start gap-8">
          <Live size="md" />
          <Live size="md" initial="482139" />
          <Live size="md" initial="482139" invalid />
        </Row>
      </Story>

      <Story
        title="Four and eight boxes"
        note="length is free; six is the near-universal one-time-code length"
      >
        <Row className="items-start gap-8">
          <Live length={4} initial="48" />
          <Live length={8} initial="48213" />
        </Row>
      </Story>

      <Story
        title="Paste"
        note="paste 482139 to fill every box; paste a URL to see onPasteOther take it"
      >
        <Live />
      </Story>
    </div>
  );
}
