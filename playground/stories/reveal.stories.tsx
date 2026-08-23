import { useEffect, useState, type CSSProperties } from "react";

import { Button } from "@/registry/grana/ui/button";
import { Plot } from "@/registry/grana/ui/panel";
import { RevealObserver } from "@/registry/grana/ui/reveal";
import { Label, Row, Story } from "@/playground/lib/story";

const STEPS = [
  [
    "1 · il cancello",
    "RevealObserver mette js su <html>. Ogni stato nascosto è appeso a quella classe: senza JavaScript non esiste, e la pagina servita è interamente leggibile.",
  ],
  [
    "2 · l'osservazione",
    "Osserva ogni [data-reveal] con rootMargin 0px 0px -10% 0px e threshold 0.15: l'elemento entra quando è davvero entrato, non quando sfiora il bordo.",
  ],
  [
    "3 · l'entrata",
    "All'ingresso aggiunge in-view: opacità 0→1 e translate 22px→0 in 0.75s sull'ease-out del brand, ritardati di --d.",
  ],
  [
    "4 · una volta sola",
    "Poi smette di osservare quell'elemento. Un MutationObserver raccoglie ciò che arriva dopo, per esempio da una navigazione client.",
  ],
];

const CARDS = [
  ["0s", undefined, "Generazione trattative"],
  ["0.12s", "0.12s", "Consulenza commerciale"],
  ["0.24s", "0.24s", "Inserimento venditori"],
] as const;

export default function RevealStories() {
  const [run, setRun] = useState(0);
  const [running, setRunning] = useState(false);

  /* The story owns the `js` class it turns on: RevealObserver never takes it off, and a leftover
   * `js` would hide the [data-reveal] elements of every other story in this playground. */
  useEffect(() => {
    if (running) return;
    document.documentElement.classList.remove("js");
  }, [running, run]);
  useEffect(() => () => document.documentElement.classList.remove("js"), []);

  return (
    <>
      <Story
        title="Il meccanismo"
        note="the entrance is invisible in a still — this is what it does, in four steps"
      >
        <div className="grid grid-cols-4 gap-4">
          {STEPS.map(([title, copy]) => (
            <Plot key={title} className="p-5">
              <span className="eyebrow">{title}</span>
              <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
            </Plot>
          ))}
        </div>
      </Story>

      <Story
        title="Lo stagger, dal vivo"
        note="RevealObserver is OFF by default here, so the cards show their served state — press Esegui to mount it and watch them enter"
      >
        <Row className="mb-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setRun((r) => r + 1);
              setRunning(true);
            }}
          >
            Esegui l&apos;entrata
          </Button>
          <Button size="sm" onClick={() => setRunning(false)} disabled={!running}>
            Reimposta
          </Button>
          <Label>
            {running ? `html.js attivo · esecuzione ${run}` : "html senza .js — stato servito"}
          </Label>
        </Row>
        {running ? <RevealObserver key={`observer-${run}`} /> : null}
        <div className="grid grid-cols-3 gap-4" key={`cards-${run}`}>
          {CARDS.map(([shown, d, title]) => (
            <Plot
              key={title}
              className="p-5"
              data-reveal=""
              style={d ? ({ "--d": d } as CSSProperties) : undefined}
            >
              <span className="eyebrow">--d: {shown}</span>
              <h3 className="h3 mt-2">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Il risultato senza costruire la competenza in casa: trattative qualificate,
                processi di vendita e persone che sanno usarli.
              </p>
            </Plot>
          ))}
        </div>
      </Story>

      <Story
        title="La regola"
        note="the stylesheet owns everything but the two class names — the component adds js and in-view, nothing else"
      >
        <div className="mt-4 overflow-x-auto rounded-img border border-border bg-muted p-4">
          <pre className="text-[13px] leading-[1.6]">{`.js [data-reveal]          { opacity: 0; translate: 0 22px;
                             transition: opacity .75s var(--ease-out) var(--d, 0s),
                                         translate .75s var(--ease-out) var(--d, 0s); }
.js [data-reveal].in-view  { opacity: 1; translate: 0 0; }

@media (prefers-reduced-motion: reduce) {
  .js [data-reveal]        { opacity: 1; translate: 0 0; transition: none; }
}`}</pre>
        </div>
      </Story>

      <Story
        title="Le due uscite di sicurezza"
        note="both are bypasses, not degradations: the page is fully readable in either"
      >
        <div className="grid grid-cols-2 gap-4">
          <Plot className="p-5">
            <span className="eyebrow">Senza JavaScript</span>
            <p className="mt-2 text-sm text-muted-foreground">
              Nessuno mette <span className="num">js</span> su <span className="num">&lt;html&gt;</span>,
              quindi la regola <span className="num">.js [data-reveal]</span> non aggancia niente:
              non esiste stato nascosto da rivelare. È esattamente quello che vedi qui sopra prima
              di premere Esegui.
            </p>
          </Plot>
          <Plot className="p-5">
            <span className="eyebrow">prefers-reduced-motion</span>
            <p className="mt-2 text-sm text-muted-foreground">
              L&apos;osservatore non viene nemmeno costruito e la media query rimette tutto a
              opacità 1: gli elementi sono già rivelati. Lo stesso accade dove manca
              IntersectionObserver. L&apos;entrata è una cortesia, mai una condizione per leggere.
            </p>
          </Plot>
        </div>
      </Story>

      <Story
        title="Chi porta l'attributo"
        note="a component that took reveal?: boolean still emits data-reveal; one that hard-coded it keeps doing so"
      >
        <div className="grid gap-2 text-sm">
          <Row>
            <span className="num w-[15rem] text-[13px]">&lt;Canvas reveal /&gt;</span>
            <span className="text-muted-foreground">
              emette <span className="num">data-reveal</span> sulla figure
            </span>
          </Row>
          <Row>
            <span className="num w-[15rem] text-[13px]">&lt;ProofStat delay={"{0.08}"} /&gt;</span>
            <span className="text-muted-foreground">
              sempre <span className="num">data-reveal</span>, con{" "}
              <span className="num">--d: 0.08s</span> in linea
            </span>
          </Row>
          <Row>
            <span className="num w-[15rem] text-[13px]">&lt;CaseStudyBlock /&gt;</span>
            <span className="text-muted-foreground">
              due metà, la seconda a <span className="num">--d: 0.12s</span>
            </span>
          </Row>
        </div>
      </Story>
    </>
  );
}
