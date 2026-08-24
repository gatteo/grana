import { Button } from "@/registry/grana/ui/button";
import { Chip } from "@/registry/grana/ui/chip";
import { TeachingEmpty } from "@/registry/grana/ui/teaching-empty";
import { Story } from "@/playground/lib/story";

/* The illustration a product would pass in: a miniature of the real card, drawn from the same
 * tokens, positioned so the card runs off the frame's right edge and fades at the top. */
function MiniRun() {
  return (
    <div className="absolute top-6 right-[-52px] left-[30px] flex flex-col gap-2.5 rounded-[10px] border border-border bg-card px-[15px] py-[13px] shadow-card">
      <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-linear-to-b from-card from-[2%] to-transparent to-[46%]" />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12.5px] font-medium whitespace-nowrap">Weekly client recap</span>
        <Chip appearance="status" tone="ok">
          Completed
        </Chip>
      </div>
      <div className="flex flex-col gap-[7px]">
        {["Read the week's runs", "Draft the recap", "Send it to the client"].map((step) => (
          <div key={step} className="flex items-center gap-2 text-[11.5px] whitespace-nowrap text-muted-foreground">
            <span className="grid size-[13px] flex-none place-items-center rounded-full bg-[color-mix(in_srgb,var(--status-good)_16%,transparent)]">
              <svg viewBox="0 0 12 12" className="size-2 fill-none stroke-status-good-ink stroke-2">
                <path d="M2.5 6.5l2.5 2.5 4.5-5" />
              </svg>
            </span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeachingEmptyStories() {
  return (
    <>
      <Story title="The teaching empty state" note="what this screen will show, and the ONE action that gets you there (DSN-3)">
        <TeachingEmpty
          title="Qui vedrai i tuoi processi"
          body="Un processo è un pezzo di lavoro che sai fare a occhi chiusi e che nessuno ha mai scritto. Registra una sessione: Luminars la guarda, ti fa tre domande, e scrive la procedura."
          action="Registra la prima sessione"
          onAction={() => {}}
        />
      </Story>

      <Story title="With an eyebrow" note="the object kind above the title">
        <TeachingEmpty
          eyebrow="Decisioni"
          title="Nessuna decisione in attesa"
          body="Quando un'esecuzione non è sicura di un passo, si ferma e te lo chiede qui. Finché la lista è vuota, i processi stanno andando avanti da soli."
        />
      </Story>

      <Story title="Action as a node" note="the caller owns the Button (and its onClick); it must still be the single primary">
        <TeachingEmpty
          title="Nessun connettore collegato"
          body="Collega Asana, Linear o Notion e i processi potranno leggere e scrivere dove lavori già. Un clic, nessun server."
          action={<Button variant="primary">Collega uno strumento</Button>}
        />
      </Story>

      <Story
        title="With a cropped illustration"
        note="the copy centres against the picture; the picture bleeds past the card's right and bottom edges so it reads as cropped. What sits on the dotted ground is the caller's node — a miniature drawn from the same tokens as the real thing, never a screenshot"
      >
        <TeachingEmpty
          title="Nothing has run yet"
          body="Your first process becomes your first run."
          action={<Button size="sm">Go to Processes</Button>}
          media={<MiniRun />}
        />
      </Story>

      <Story
        title="Dimmed — a ghost, not a specimen"
        note="day zero, and a read that FAILED: a bright illustration beside 'this could not be checked' reads as a healthy example of something the app cannot actually see"
      >
        <TeachingEmpty
          title="The run ledger could not be read"
          body="Nothing here is a claim until it can be read again. Retrying every few seconds."
          media={<MiniRun />}
          dim
        />
      </Story>

      <Story title="Inside a narrow column" note="the body keeps 62ch; the title balances">
        <div className="max-w-[420px]">
          <TeachingEmpty
            title="Le esecuzioni compariranno in questa cronologia"
            body="Ogni volta che un processo viene eseguito, qui resta la trascrizione: cosa ha fatto, cosa ha chiesto, cosa hai risposto."
            action="Esegui un processo"
          />
        </div>
      </Story>
    </>
  );
}
