import { Fragment } from "react";

import { CountUp, formatItalianNumber } from "@/registry/grana/ui/count-up";
import { Label, Row, Story } from "@/playground/lib/story";

/* The four numbers the home page states, verbatim. */
const HOME = [
  { value: 5000, prefix: "+", label: "trattative qualificate gestite nel 2025" },
  { value: 90, prefix: "+", label: "aziende sulla piattaforma" },
  { value: 5, prefix: "+", suffix: " MW", label: "di impianti installati nel 2025" },
  {
    value: 3.7,
    decimals: 1,
    prefix: "€ ",
    suffix: " mln",
    label: "di impianti chiusi nei casi studio pubblicati",
  },
];

/* The CLDR trap the formatter exists for: it-IT drops the separator on four digits. */
const GROUPING = [999, 1847, 12500, 90000, 1650000];

export default function CountUpStories() {
  return (
    <>
      <Story
        title="Il set della home"
        note="counts once on entry, 1100ms, easing 1-(1-p)^4 — a still may catch it mid-count"
      >
        <dl className="grid grid-cols-4 gap-6">
          {HOME.map((s) => (
            <div key={s.label}>
              <dd className="metric mb-2.5 whitespace-nowrap">
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  prefix={s.prefix}
                  suffix={s.suffix}
                />
              </dd>
              <dt className="max-w-[22ch] text-sm text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Story>

      <Story
        title="Il raggruppamento italiano"
        note="it-IT renders 1847 without a separator; the brand always writes 1.847 — useGrouping: always"
      >
        <div className="grid gap-1">
          {GROUPING.map((n) => (
            <Row key={n}>
              <span className="num w-24 text-right text-[13px] text-faint">{n}</span>
              <span className="text-faint">→</span>
              <span className="num text-[15px]">{formatItalianNumber(n)}</span>
            </Row>
          ))}
        </div>
      </Story>

      <Story
        title="Decimali, prefisso, suffisso"
        note="the prefix and suffix ride the animation, never the DOM around it"
      >
        <div className="grid grid-cols-[22rem_1fr] items-baseline gap-x-6 gap-y-4">
          {(
            [
              ['value 3.7 · decimals 1 · prefix "€ " · suffix " mln"', 3.7, 1, "€ ", " mln"],
              ['value 67.3 · decimals 1 · suffix "×"', 67.3, 1, "", "×"],
              ['value 1650000 · prefix "€ "', 1650000, 0, "€ ", ""],
              ['value 27.3 · decimals 1 · suffix "%"', 27.3, 1, "", "%"],
            ] as const
          ).map(([caption, v, d, pre, suf]) => (
            <Fragment key={caption}>
              <Label>{caption}</Label>
              <span className="metric">
                <CountUp value={v} decimals={d} prefix={pre} suffix={suf} />
              </span>
            </Fragment>
          ))}
        </div>
      </Story>

      <Story
        title="Il valore statico è già quello giusto"
        note="server-rendered text = the final value; the animation only replaces text that is already correct"
      >
        <table className="w-full max-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="eyebrow py-2 text-left">props</th>
              <th className="eyebrow py-2 text-left">markup statico</th>
            </tr>
          </thead>
          <tbody>
            {HOME.map((s) => (
              <tr key={s.label} className="border-b border-border">
                <td className="num py-2 text-[13px] text-muted-foreground">
                  {s.value}
                  {s.decimals ? ` · ${s.decimals} dec.` : ""}
                </td>
                <td className="num py-2">
                  {formatItalianNumber(s.value, s.decimals, s.prefix, s.suffix)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Story>

      <Story title="Durata" note="duration is the only knob; the easing and the once-only rule are not negotiable">
        <div className="grid grid-cols-[22rem_1fr] items-baseline gap-x-6 gap-y-4">
          {([1100, 2600, 400] as const).map((ms) => (
            <Fragment key={ms}>
              <Label>duration {ms === 1100 ? "1100 (default)" : ms}</Label>
              <span className="metric">
                <CountUp value={5000} prefix="+" duration={ms} />
              </span>
            </Fragment>
          ))}
        </div>
      </Story>

      <Story title="In una riga di testo" note="it is a span: it inherits the face it is dropped into">
        <p className="max-w-[46ch] text-lead">
          Nel 2025 abbiamo gestito <CountUp className="num font-medium" value={5000} prefix="+" />{" "}
          trattative qualificate per <CountUp className="num font-medium" value={90} prefix="+" />{" "}
          aziende installatrici.
        </p>
      </Story>
    </>
  );
}
