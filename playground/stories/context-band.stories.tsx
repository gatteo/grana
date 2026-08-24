import { Button } from "@/registry/grana/ui/button";
import { ContextBand } from "@/registry/grana/ui/context-band";
import { StatusDot } from "@/registry/grana/ui/status-dot";
import { Story } from "@/playground/lib/story";

export default function ContextBandStories() {
  return (
    <>
      <Story
        title="One shape, every state"
        note="the mark, the state in words, what it means now, and the single lever — running, held, degraded, and a state with no lever at all"
      >
        <div className="grid max-w-[452px] gap-3">
          <ContextBand
            status={<StatusDot tone="ok" live />}
            title="Context Collection is on"
            description="Collected 4h 12m today from 7 apps"
            action={
              <Button variant="quiet" size="sm">
                Pause
              </Button>
            }
          />
          <ContextBand
            status={<StatusDot tone="quiet" />}
            title="Context Collection is paused"
            description="Nothing is being collected. Resuming at 18:44."
            action={
              <Button variant="quiet" size="sm">
                Resume
              </Button>
            }
          />
          <ContextBand
            status={<StatusDot tone="warning" />}
            title="Context Collection is degraded"
            description="Screen recording was revoked, so nothing is being seen. Audio and the text layer are still on."
            action={
              <Button variant="primary" size="sm">
                Grant screen recording
              </Button>
            }
          />
          <ContextBand
            status={<StatusDot tone="quiet" />}
            title="Context Collection state is unknown"
            description="The capture host did not answer. Retrying every few seconds."
          />
        </div>
      </Story>

      <Story
        title="A description that carries objects"
        note="the description is a wrapping flex row, so marks and chips sit inline with the words instead of below them"
      >
        <div className="max-w-[452px]">
          <ContextBand
            status={<StatusDot tone="ok" live />}
            title="Context Collection is on"
            description={
              <>
                Collected 4h 12m today from
                <span className="inline-flex items-center gap-1">
                  {["#2c2c2c", "#3b6fd4", "#1f8a4c", "#4a4a4a"].map((bg) => (
                    <span
                      key={bg}
                      className="size-4 rounded-[5px]"
                      style={{ background: bg }}
                    />
                  ))}
                  <span className="grid size-4 place-items-center rounded-[5px] bg-muted text-[8.5px] font-medium text-faint">
                    +3
                  </span>
                </span>
              </>
            }
            action={
              <Button variant="quiet" size="sm">
                Pause
              </Button>
            }
          />
        </div>
      </Story>

      <Story title="Full width" note="it stretches; the action stays pinned right">
        <ContextBand
          status={<StatusDot tone="ok" live />}
          title="Context Collection is on"
          description="Collected 12m today from 2 apps"
          action={
            <Button variant="quiet" size="sm">
              Pause
            </Button>
          }
        />
      </Story>
    </>
  );
}
