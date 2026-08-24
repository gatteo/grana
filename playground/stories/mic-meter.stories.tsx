import { useEffect, useState } from "react";

import { MicMeter } from "@/registry/grana/ui/mic-meter";
import { StatusDot } from "@/registry/grana/ui/status-dot";
import { Button } from "@/registry/grana/ui/button";
import { Label, Row, Story } from "@/playground/lib/story";

/** A plausible voice envelope, so the meter can be seen doing its job. */
function useFakeLevel(running: boolean) {
  const [level, setLevel] = useState(0.5);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLevel((prev) => Math.min(1, Math.max(0.05, prev + (Math.random() - 0.5) * 0.5)));
    }, 140);
    return () => clearInterval(id);
  }, [running]);
  return level;
}

export default function MicMeterStories() {
  const live = useFakeLevel(true);

  return (
    <div>
      <Story title="Levels" note="ten fixed weights — the same level always draws the same picture">
        <Row className="gap-8">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((level) => (
            <span key={level} className="grid justify-items-center gap-2">
              <MicMeter level={level} muted={false} label={`Microphone level ${level}`} />
              <Label>{level.toFixed(1)}</Label>
            </span>
          ))}
        </Row>
      </Story>

      <Story title="Muted" note="the bars go flat and take the quiet ramp, so a mute is visible">
        <Row className="gap-8">
          <span className="grid justify-items-center gap-2">
            <MicMeter level={0.75} muted={false} label="Microphone level" />
            <Label>live</Label>
          </span>
          <span className="grid justify-items-center gap-2">
            <MicMeter level={0.75} muted label="Narration muted" />
            <Label>muted</Label>
          </span>
        </Row>
      </Story>

      <Story title="Live" note="a fake envelope at 140ms; the 70ms height transition does the smoothing">
        <Row className="gap-8">
          <MicMeter level={live} muted={false} label="Microphone level" />
          <MicMeter level={live} muted label="Narration muted" />
        </Row>
      </Story>

      <Story
        title="The recording bar"
        note="the composition: dot + word carry the state, the meter carries the sound"
      >
        <Row>
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-3.5 py-2 shadow-panel">
            <span className="inline-flex items-center gap-[7px] text-[12.5px] text-muted-foreground">
              <StatusDot tone="attention" live />
              Registrazione
            </span>
            <span className="num text-[12.5px] text-muted-foreground">06:41</span>
            <span className="flex items-center gap-2 border-l border-border pl-[11px]">
              <MicMeter level={live} muted={false} label="Livello del microfono" />
            </span>
            <span className="flex items-center gap-1.5">
              <Button size="sm">Pausa</Button>
              <Button size="sm" variant="primary">
                Stop
              </Button>
            </span>
          </div>
        </Row>
      </Story>

      <Story title="Paused and muted" note="the same bar with the sound switched off">
        <Row>
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-3.5 py-2 shadow-panel">
            <span className="inline-flex items-center gap-[7px] text-[12.5px] text-muted-foreground">
              <StatusDot tone="warning" />
              In pausa
            </span>
            <span className="num text-[12.5px] text-muted-foreground">06:41</span>
            <span className="flex items-center gap-2 border-l border-border pl-[11px]">
              <MicMeter level={0.8} muted label="Narrazione disattivata" />
            </span>
            <Button size="sm" variant="primary">
              Riprendi
            </Button>
          </div>
        </Row>
      </Story>
    </div>
  );
}
