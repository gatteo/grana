import { Button } from "@/registry/grana/ui/button";
import { Canvas } from "@/registry/grana/ui/canvas";
import { Eyebrow } from "@/registry/grana/ui/eyebrow";
import { Label, Row, Story } from "@/playground/lib/story";

const TEXTURES = [
  ["dune-2", "/img/dune-2.jpg"],
  ["olive-wax-2", "/img/olive-wax-2.jpg"],
  ["warm-stones", "/img/warm-stones.jpg"],
  ["clay-coils", "/img/clay-coils.jpg"],
  ["soft-shapes-2", "/img/soft-shapes-2.jpg"],
  ["oil-impasto", "/img/oil-impasto.jpg"],
] as const;

export default function CanvasStories() {
  return (
    <>
      <Story
        title="I cinque strati"
        note="image z0 · wash z1 · grain z2 · content z3 · marks z4 — isolate, plain alpha, never a blend mode"
      >
        <Canvas img="/img/dune-2.jpg" marks className="h-[280px] p-8">
          <div className="flex h-full flex-col justify-end">
            <Eyebrow size="lg" index="01" className="text-inverse-foreground">
              Il campo
            </Eyebrow>
            <h2 className="h2 mt-3 max-w-[18ch] text-inverse-foreground">
              La piattaforma che fa crescere chi installa impianti industriali.
            </h2>
          </div>
        </Canvas>
        <p className="mt-3 max-w-text text-sm text-muted-foreground">
          Il wash è quello che rende leggibile il bianco su una fotografia sconosciuta: senza,
          una zona chiara della texture si mangia una parola.
        </p>
      </Story>

      <Story title="Nudo" note="no marks, default wash, grain 0.14 — the recipe with nothing turned on">
        <div className="grid grid-cols-3 gap-4">
          {TEXTURES.map(([name, src]) => (
            <div key={name}>
              <Canvas img={src} className="h-[150px]" />
              <Label>{name}</Label>
            </div>
          ))}
        </div>
      </Story>

      <Story
        title="marks"
        note="four 6px squares inset 14px: ink at 50% (marks) or ecru at 75% (marks=&quot;light&quot;) — the print-registration tell"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Canvas img="/img/dune-3.jpg" className="h-[180px]" />
            <Label>marks={"{false}"} (default)</Label>
          </div>
          <div>
            <Canvas img="/img/dune-3.jpg" marks className="h-[180px]" />
            <Label>marks — ink 50%</Label>
          </div>
          <div>
            <Canvas img="/img/dune-3.jpg" marks="light" className="h-[180px]" />
            <Label>marks=&quot;light&quot; — ecru 75%</Label>
          </div>
        </div>
      </Story>

      <Story
        title="duotone"
        note="one fixed filter chain on the image layer (grayscale → sepia → hue-rotate 178° → saturate → brightness → contrast), never a blend mode: every texture lands on the SAME duotone, and the unit's own hue is carried by the card around it"
      >
        <div className="grid grid-cols-4 gap-4">
          {(
            [
              ["Demand", "bg-unit-demand", "/img/rust-fabric.jpg"],
              ["Piattaforma", "bg-unit-piattaforma", "/img/cobalt-foam.jpg"],
              ["Academy", "bg-unit-academy", "/img/amber-glass-2.jpg"],
              ["Installatori", "bg-unit-installatori", "/img/plum-rope-2.jpg"],
            ] as const
          ).map(([unit, tint, src]) => (
            <div key={unit}>
              <div className={`${tint} rounded-img p-1`}>
                <Canvas img={src} duotone className="h-[160px]" />
              </div>
              <Label>
                {unit} · mat, duotone dentro
              </Label>
            </div>
          ))}
        </div>
        <Row className="mt-3">
          <div>
            <Canvas img="/img/rust-fabric.jpg" className="h-[110px] w-[220px]" />
            <Label>rust-fabric, as shot</Label>
          </div>
          <div>
            <Canvas img="/img/rust-fabric.jpg" duotone className="h-[110px] w-[220px]" />
            <Label>the same file, duotone</Label>
          </div>
        </Row>
      </Story>

      <Story
        title="wash"
        note="replace the fall of light when the picture asks for it — any CSS background value"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Canvas img="/img/teal-paper-2.jpg" className="h-[180px] p-5">
              <p className="h3 text-inverse-foreground">Il wash di serie</p>
            </Canvas>
            <Label>default — ecru 10% → ink 22% in basso</Label>
          </div>
          <div>
            <Canvas
              img="/img/teal-paper-2.jpg"
              wash="linear-gradient(90deg, rgba(14,13,10,0.62) 0%, rgba(14,13,10,0.06) 70%)"
              className="h-[180px] p-5"
            >
              <p className="h3 max-w-[12ch] text-inverse-foreground">Dal bordo sinistro</p>
            </Canvas>
            <Label>wash: ink 62% → 6%, a 90°</Label>
          </div>
          <div>
            <Canvas
              img="/img/teal-paper-2.jpg"
              wash="rgba(246,243,238,0.72)"
              className="h-[180px] p-5"
            >
              <p className="h3 max-w-[12ch]">Testo scuro su carta</p>
            </Canvas>
            <Label>wash: ecru 72% piatto</Label>
          </div>
        </div>
      </Story>

      <Story
        title="grainOpacity"
        note="0.14 is the veil the whole site wears; lower it only when the texture already carries its own noise"
      >
        <div className="grid grid-cols-4 gap-4">
          {([0.14, 0.08, 0.04, 0] as const).map((o) => (
            <div key={o}>
              <Canvas img="/img/soft-shapes-2.jpg" grainOpacity={o} className="h-[150px]" />
              <Label>grainOpacity {o === 0.14 ? "0.14 (default)" : o}</Label>
            </div>
          ))}
        </div>
      </Story>

      <Story
        title="pos"
        note="background-position on the image layer: the same file, framed three ways"
      >
        <div className="grid grid-cols-3 gap-4">
          {(["top", "center", "bottom"] as const).map((p) => (
            <div key={p}>
              <Canvas img="/img/dune-2.jpg" pos={p} className="h-[150px]" />
              <Label>pos=&quot;{p}&quot;</Label>
            </div>
          ))}
        </div>
      </Story>

      <Story
        title="Contenuto sopra la tela"
        note="children land on z3, above both veils and below the marks — the CTA band, as the site builds it"
      >
        <Canvas
          img="/img/teal-paper-3.jpg"
          marks="light"
          wash="linear-gradient(180deg, rgba(14,13,10,0.34) 0%, rgba(14,13,10,0.30) 45%, rgba(14,13,10,0.52) 100%)"
          className="h-[360px]"
        >
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <Eyebrow size="lg" className="text-inverse-foreground">
              Parla con noi
            </Eyebrow>
            <h2 className="h2 mt-4 max-w-[20ch] text-inverse-foreground">
              Questi numeri sono ripetibili dove lavori tu?
            </h2>
            <p className="mt-4 max-w-[46ch] text-inverse-muted">
              Trenta minuti online, sui tuoi numeri: zona, spesa in campagne e tipo di impianto.
              Ti diciamo anche quando la risposta è no.
            </p>
            <div className="mt-7 flex gap-3">
              <Button variant="on-dark">Prenota una demo</Button>
              <Button variant="glass-dark">Vedi la piattaforma</Button>
            </div>
          </div>
        </Canvas>
      </Story>

      <Story
        title="reveal"
        note="reveal emits data-reveal on the figure so the scroll observer animates the whole canvas in (see the reveal story)"
      >
        <Canvas img="/img/warm-stones.jpg" reveal marks className="h-[160px]" />
      </Story>
    </>
  );
}
