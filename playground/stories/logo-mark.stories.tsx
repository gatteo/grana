import { Button } from "@/registry/grana/ui/button";
import { LogoMark } from "@/registry/grana/ui/logo-mark";
import { Label, Row, Story } from "@/playground/lib/story";

const NAV = ["Piattaforma", "Soluzioni", "Servizi", "Prodotti", "Casi studio", "Azienda"];

export default function LogoMarkStories() {
  return (
    <>
      <Story title="Il lockup" note="mark 30px / corner 7px · 11px of air · the display face at 700, track -0.015em">
        <Row className="gap-8">
          <LogoMark />
          <Label>default (wordmark)</Label>
        </Row>
      </Story>

      <Story title="Solo il marchio" note="wordmark={false}: the image carries the name, so its alt is the name">
        <Row className="gap-8">
          <LogoMark wordmark={false} />
          <Label>wordmark={"{false}"}</Label>
        </Row>
      </Story>

      <Story title="Come link" note="href renders an <a>; without it a <span>, so the lockup can sit inside another anchor">
        <Row className="gap-8">
          <LogoMark href="#" />
          <Label>href=&quot;/&quot;</Label>
          <LogoMark href="#" wordmark={false} />
          <Label>href + wordmark={"{false}"}</Label>
        </Row>
      </Story>

      <Story title="Nell'header" note="the real site chrome: brand · nav pushed to the middle · two verbs, 72px tall">
        <div className="-mx-8 border-b border-border bg-background/90 backdrop-blur-[12px] backdrop-saturate-[1.6]">
          <div className="mx-auto flex h-[4.5rem] w-full max-w-measure items-center gap-8 px-gutter">
            <LogoMark href="#" />
            <nav className="mx-auto flex gap-[1.625rem]">
              {NAV.map((item) => (
                <a key={item} className="text-sm text-muted-foreground no-underline hover:text-foreground" href="#">
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex flex-none gap-2.5">
              <Button variant="glass" size="sm">
                Accedi
              </Button>
              <Button variant="primary" size="sm">
                Prenota una demo
              </Button>
            </div>
          </div>
        </div>
      </Story>

      <Story title="Sul fondo scuro" note="the lockup takes the ink of what it sits on — but the shipped mark is an ink tile, so an inverse band needs an inverted file through src">
        <div className="-mx-8 bg-inverse px-8 py-10 text-inverse-foreground">
          <LogoMark href="#" />
          <p className="mt-4 max-w-[42ch] text-sm text-inverse-muted">
            L&apos;azienda che fa crescere chi installa impianti industriali.
          </p>
        </div>
      </Story>

      <Story title="Nel footer" note="the footer lockup sits over the legal line; the mark is decorative, the wordmark is the name">
        <div className="-mx-8 border-t border-border px-8 pt-10">
          <LogoMark />
          <p className="mt-4 max-w-[42ch] text-sm text-muted-foreground">
            L&apos;azienda che fa crescere chi installa impianti industriali.
          </p>
          <p className="mt-6 text-[13px] text-faint">
            Revenue.farm S.R.L. · P.IVA 12993750962 · Via Giosuè Carducci 34, 20123 Milano
          </p>
        </div>
      </Story>

      <Story title="Misure" note="the lockup does not scale itself: size it from the outside and the mark holds its 30px">
        <div className="grid gap-4">
          <Row className="gap-8">
            <LogoMark />
            <Label>18px (default)</Label>
          </Row>
          <Row className="gap-8">
            <LogoMark className="text-[1.375rem]" />
            <Label>className=&quot;text-[1.375rem]&quot;</Label>
          </Row>
          <Row className="gap-8">
            <LogoMark className="text-[0.9375rem]" />
            <Label>className=&quot;text-[0.9375rem]&quot;</Label>
          </Row>
        </div>
      </Story>
    </>
  );
}
