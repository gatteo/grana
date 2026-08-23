import * as React from "react"

import { cn } from "@/lib/utils"

/* Sidebar glyphs, traced from the product PoC (16-grid, 1.4 stroke). */
const icons = {
  overview: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  ),
  leads: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 12.5V11a3 3 0 013-3h3a3 3 0 013 3v1.5" />
      <circle cx="6.5" cy="5" r="2.4" />
    </svg>
  ),
  deals: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 4h12M2 8h12M2 12h7" />
    </svg>
  ),
  quotes: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 2h5l3 3v9H4z" />
      <path d="M9 2v3h3" />
    </svg>
  ),
  clients: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
      <path d="M5.5 6h5M5.5 9h3" />
    </svg>
  ),
  site: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M2.5 8h11" />
      <ellipse cx="8" cy="8" rx="2.6" ry="5.5" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 2l5.5 3v6L8 14l-5.5-3V5z" />
      <path d="M2.5 5L8 8l5.5-3M8 8v6" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="5.5" cy="5.2" r="2.2" />
      <path d="M1.8 12.5v-.7a3 3 0 013-3h1.4a3 3 0 013 3v.7" />
      <circle cx="11.2" cy="5.8" r="1.8" />
      <path d="M11 8.8a2.8 2.8 0 013.2 2.8v.9" />
    </svg>
  ),
  intel: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2.5 13.5h11" />
      <path d="M4.5 13.5V9M8 13.5V4.5M11.5 13.5V7" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 2.5l1.4 3.1 3.1 1.4-3.1 1.4L8 11.5 6.6 8.4 3.5 7l3.1-1.4z" />
    </svg>
  ),
  calc: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="2" width="10" height="12" rx="2" />
      <path d="M5.5 5.5h5M5.5 8.5h2M5.5 11h2" />
    </svg>
  ),
  reviews: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 2.5l1.7 3.5 3.8.5-2.8 2.6.7 3.8L8 11.1l-3.4 1.8.7-3.8L2.5 6.5l3.8-.5z" />
    </svg>
  ),
  financing: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2.5" y="5" width="11" height="8" rx="2" />
      <path d="M8 8.5V10" />
      <path d="M5.5 5V3.8a2.5 2.5 0 015 0V5" />
    </svg>
  ),
  practices: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 2h5l3 3v9H4z" />
      <path d="M6.5 8.5h3M6.5 11h3" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  ),
} as const

/* Weekly bars as [leads%, quotes%], eight weeks — the PoC series. */
const weeks: [number, number][] = [
  [55, 20],
  [65, 27.5],
  [47.5, 17.5],
  [77.5, 32.5],
  [70, 25],
  [85, 35],
  [62.5, 22.5],
  [82.5, 30],
]

/* The picture's own measures. This is the product DRAWN at ~70% of product scale, not the
 * product: its radii (2 · 5 · 7 · 9 · 12 px), its type steps and its 22px actors are a scaled
 * copy of the real shell, so they deliberately sit off Grana's radius and type scales. Sizes
 * are arbitrary on purpose — `text-13` and friends would carry a line-height with them and the
 * whole drawing leans on the surface's inherited 1.6. */
const tag =
  "ml-auto rounded-xs border border-stone-200 px-[0.3125rem] py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.07em] text-stone-500"
const smallBtn =
  "inline-flex items-center whitespace-nowrap rounded-[7px] bg-stone-900 px-[0.6875rem] py-[0.3125rem] text-[0.6875rem] font-medium text-stone-0"
const quietBtn = "border border-stone-200 bg-stone-0 text-foreground"
const panel = "overflow-hidden rounded-[9px] border border-stone-200"
const panelHead =
  "flex items-baseline justify-between gap-3 border-b border-stone-200 px-3.5 py-[0.6875rem]"
const panelTitle = "text-[0.8125rem] font-medium tracking-[-0.01em]"
const panelNote = "text-[0.625rem] text-faint"
const chip =
  "inline-flex items-center whitespace-nowrap rounded-[5px] bg-stone-100 px-[0.4375rem] py-0.5 text-[0.625rem] text-muted-foreground"

export interface ProductShotProps {
  /** Accessible one-line description of the screenshot. */
  label?: string
  className?: string
}

function SideItem({
  icon,
  children,
  current,
  off,
}: {
  icon: keyof typeof icons
  children: React.ReactNode
  current?: boolean
  off?: boolean
}) {
  return (
    <span
      data-slot="product-shot-item"
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-[0.75rem] text-muted-foreground",
        "[&_svg]:size-[13px] [&_svg]:flex-none [&_svg]:opacity-75",
        "data-[current]:bg-stone-0 data-[current]:font-medium data-[current]:text-foreground",
        "data-[current]:shadow-[inset_0_0_0_1px_var(--stone-200)]",
        off && "text-stone-400"
      )}
      data-current={current ? "" : undefined}
    >
      {icons[icon]}
      {children}
    </span>
  )
}

/**
 * The product, faithfully scaled down for the marketing surface: the
 * same shell the customer sees — warm-grey canvas, tenant sidebar,
 * one white work card with topbar, KPIs, chart, deals table and the
 * human/AI activity feed. Static and decorative; every string is
 * Italian product-demo data, mirrored from the dashboard PoC.
 *
 * It holds `min-width: 900px` on purpose: below that it scrolls sideways inside a
 * `<PanelScroll>` rather than reflowing, because a screenshot that reflows lies about the
 * product.
 */
export function ProductShot({
  label = "Anteprima della dashboard: lead, trattative, preventivi e attività del team",
  className,
}: ProductShotProps) {
  return (
    <div
      data-slot="product-shot"
      className={cn(
        "grid min-w-[900px] grid-cols-[218px_minmax(0,1fr)] bg-stone-100 text-left text-[0.8125rem]",
        className
      )}
      role="img"
      aria-label={label}
    >
      <div
        aria-hidden="true"
        data-slot="product-shot-side"
        className="flex flex-col gap-0.5 px-3 py-3.5"
      >
        <span
          data-slot="product-shot-tenant"
          className="flex items-center gap-[9px] px-2 pt-1 pb-3.5"
        >
          <span className="grid size-[26px] flex-none place-items-center rounded-[7px] bg-stone-900 text-[0.625rem] font-semibold tracking-[0.01em] text-stone-0">
            ER
          </span>
          <span>
            <b className="block text-[0.75rem] leading-[1.25] font-medium tracking-[-0.01em]">
              Elettro Rossi Srl
            </b>
            <small className="text-[0.625rem] text-faint">Bergamo · 12 persone</small>
          </span>
        </span>
        <SideItem icon="overview" current>
          Panoramica
        </SideItem>
        <SideItem icon="deals">
          Trattative <span className="num ml-auto text-[0.6875rem] text-faint">24</span>
        </SideItem>
        <SideItem icon="clients">Clienti</SideItem>
        <span
          data-slot="product-shot-group"
          className="px-2 pt-3.5 pb-1 font-mono text-[0.5625rem] font-medium tracking-[0.11em] text-stone-400 uppercase"
        >
          Vendita
        </span>
        <SideItem icon="calc">Incentivi</SideItem>
        <SideItem icon="quotes">
          Preventivi <span className="num ml-auto text-[0.6875rem] text-faint">9</span>
        </SideItem>
        <SideItem icon="intel">Sales Intelligence</SideItem>
        <SideItem icon="ai">
          Agenti AI <span className={tag}>Beta</span>
        </SideItem>
        <span
          data-slot="product-shot-group"
          className="px-2 pt-3.5 pb-1 font-mono text-[0.5625rem] font-medium tracking-[0.11em] text-stone-400 uppercase"
        >
          Presenza online
        </span>
        <SideItem icon="reviews">Recensioni</SideItem>
        <SideItem icon="site">Sito web</SideItem>
        <span
          data-slot="product-shot-group"
          className="px-2 pt-3.5 pb-1 font-mono text-[0.5625rem] font-medium tracking-[0.11em] text-stone-400 uppercase"
        >
          Operations
        </span>
        <SideItem icon="box">Materiali</SideItem>
        <SideItem icon="team">Squadre</SideItem>
        <SideItem icon="financing" off>
          Finanziamenti <span className={cn(tag, "border-stone-400 text-stone-700")}>Attiva</span>
        </SideItem>
        <SideItem icon="practices" off>
          Pratiche <span className={tag}>In arrivo</span>
        </SideItem>
        <p
          data-slot="product-shot-powered"
          className="mt-auto border-t border-stone-200 px-2 pt-3 font-mono text-[0.5625rem] tracking-[0.04em] text-stone-400"
        >
          powered by Revenue Farm
        </p>
      </div>

      <div
        aria-hidden="true"
        data-slot="product-shot-shell"
        className="my-2 mr-2 flex flex-col overflow-hidden rounded-[12px] border border-stone-200 bg-stone-0"
      >
        <div
          data-slot="product-shot-topbar"
          className="flex h-[2.875rem] items-center gap-3 border-b border-stone-200 px-[1.125rem]"
        >
          <span
            data-slot="product-shot-search"
            className="flex max-w-[300px] flex-1 items-center gap-[7px] rounded-[7px] border border-stone-200 bg-stone-50 px-2.5 py-[0.3125rem] text-[0.6875rem] text-faint [&_svg]:size-[11px] [&_svg]:flex-none"
          >
            {icons.search}
            Cerca clienti, trattative, preventivi
            <kbd className="ml-auto rounded-xs border border-stone-200 px-1 font-mono text-[0.5625rem]">
              ⌘K
            </kbd>
          </span>
          <span className="ml-auto flex items-center gap-2">
            <span className={cn(smallBtn, quietBtn)}>Importa lead</span>
            <span className={smallBtn}>+ Nuova trattativa</span>
            <span
              data-slot="product-shot-avatar"
              className="grid size-6 flex-none place-items-center rounded-full bg-stone-300 text-[0.5625rem] font-semibold text-stone-800"
            >
              LF
            </span>
          </span>
        </div>

        <div
          data-slot="product-shot-page"
          className="flex flex-col gap-4 p-[1.125rem]"
        >
          <div
            data-slot="product-shot-page-head"
            className="flex items-end justify-between gap-4"
          >
            <div>
              <h3 className="text-[1.1875rem] font-medium tracking-[-0.02em]">Panoramica</h3>
              <p className="tabular mt-0.5 text-[0.6875rem] text-faint">
                Ultimo aggiornamento 27/07/2026 alle 09:48
              </p>
            </div>
            <span
              data-slot="product-shot-segmented"
              className="flex overflow-hidden rounded-[7px] border border-stone-200 [&>span]:border-r [&>span]:border-stone-200 [&>span]:px-[0.5625rem] [&>span]:py-1 [&>span]:text-[0.6875rem] [&>span]:text-muted-foreground [&>span:last-child]:border-r-0 [&>span[data-on]]:bg-stone-100 [&>span[data-on]]:font-medium [&>span[data-on]]:text-foreground"
            >
              <span>7 giorni</span>
              <span data-on="">30 giorni</span>
              <span>Trimestre</span>
            </span>
          </div>

          <dl
            data-slot="product-shot-kpis"
            className="grid grid-cols-4 gap-px overflow-hidden rounded-[9px] border border-stone-200 bg-stone-200"
          >
            <div data-slot="product-shot-kpi" className="bg-stone-0 px-3.5 pt-3 pb-[0.8125rem]">
              <dt className="mb-1.5 text-[0.6875rem] text-muted-foreground">Lead ricevuti</dt>
              <dd className="flex flex-wrap items-baseline gap-[0.4375rem]">
                <span className="num text-[1.25rem] leading-none font-medium tracking-[-0.03em]">
                  42
                </span>
                <span className="text-[0.625rem] font-medium text-status-good-ink">▲ 13,5%</span>
              </dd>
              <p className="tabular mt-1.5 text-[0.625rem] text-faint">giugno 2026: 37</p>
            </div>
            <div data-slot="product-shot-kpi" className="bg-stone-0 px-3.5 pt-3 pb-[0.8125rem]">
              <dt className="mb-1.5 text-[0.6875rem] text-muted-foreground">Tasso di qualifica</dt>
              <dd className="flex flex-wrap items-baseline gap-[0.4375rem]">
                <span className="num text-[1.25rem] leading-none font-medium tracking-[-0.03em]">
                  38,1%
                </span>
                <span className="text-[0.625rem] font-medium text-status-good-ink">▲ 2,1 pt</span>
              </dd>
              <p className="tabular mt-1.5 text-[0.625rem] text-faint">16 lead su 42</p>
            </div>
            <div data-slot="product-shot-kpi" className="bg-stone-0 px-3.5 pt-3 pb-[0.8125rem]">
              <dt className="mb-1.5 text-[0.6875rem] text-muted-foreground">
                Valore pipeline aperta
              </dt>
              <dd className="flex flex-wrap items-baseline gap-[0.4375rem]">
                <span className="num text-[1.25rem] leading-none font-medium tracking-[-0.03em]">
                  € 3.480.000
                </span>
              </dd>
              <p className="tabular mt-1.5 text-[0.625rem] text-faint">
                24 trattative · media € 145.000
              </p>
            </div>
            <div data-slot="product-shot-kpi" className="bg-stone-0 px-3.5 pt-3 pb-[0.8125rem]">
              <dt className="mb-1.5 text-[0.6875rem] text-muted-foreground">
                Tempo medio di risposta
              </dt>
              <dd className="flex flex-wrap items-baseline gap-[0.4375rem]">
                <span className="num text-[1.25rem] leading-none font-medium tracking-[-0.03em]">
                  3h 12m
                </span>
                <span className="text-[0.625rem] font-medium text-status-critical">
                  sopra l&rsquo;obiettivo
                </span>
              </dd>
              <p className="tabular mt-1.5 text-[0.625rem] text-faint">
                obiettivo 2h · giorni feriali
              </p>
            </div>
          </dl>

          <div
            data-slot="product-shot-cols"
            className="grid grid-cols-[minmax(0,1fr)_264px] items-start gap-4"
          >
            <div className="flex min-w-0 flex-col gap-4">
              <section data-slot="product-shot-panel" className={panel}>
                <div className={panelHead}>
                  <h4 className={panelTitle}>Lead e preventivi per settimana</h4>
                  <p className={cn("tabular", panelNote)}>Settimane 22–29 · 2026</p>
                </div>
                <div data-slot="product-shot-chart" className="px-3.5 pt-3.5 pb-2.5">
                  <div
                    data-slot="product-shot-plot"
                    className="relative flex h-[118px] items-end gap-[0.3125rem] border-b border-stone-300"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 [&>span]:absolute [&>span]:inset-x-0 [&>span]:h-px [&>span]:bg-stone-200"
                      data-slot="product-shot-gridlines"
                    >
                      <span style={{ top: 0 }} />
                      <span style={{ top: "25%" }} />
                      <span style={{ top: "50%" }} />
                      <span style={{ top: "75%" }} />
                    </div>
                    {weeks.map(([leads, quotes], i) => (
                      <div
                        key={i}
                        data-slot="product-shot-bars"
                        className="flex h-full flex-1 items-end justify-center gap-[3px]"
                      >
                        <i
                          className="w-[14px] rounded-t-[2px] bg-chart-1"
                          data-s="1"
                          style={{ height: `${leads}%` }}
                        />
                        <i
                          className="w-[14px] rounded-t-[2px] bg-chart-2"
                          data-s="2"
                          style={{ height: `${quotes}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    data-slot="product-shot-xlabels"
                    className="mt-1.5 flex gap-[0.3125rem] [&>span]:num [&>span]:flex-1 [&>span]:text-center [&>span]:text-[0.5625rem] [&>span]:text-faint"
                  >
                    {["S22", "S23", "S24", "S25", "S26", "S27", "S28", "S29"].map((week) => (
                      <span key={week}>{week}</span>
                    ))}
                  </div>
                </div>
                <div
                  data-slot="product-shot-legend"
                  className="flex gap-3.5 px-3.5 pb-3 text-[0.625rem] text-muted-foreground [&>span]:inline-flex [&>span]:items-center [&>span]:gap-[0.3125rem]"
                >
                  <span>
                    <i className="size-2 rounded-[2px] bg-chart-1" /> Lead ricevuti
                  </span>
                  <span>
                    <i className="size-2 rounded-[2px] bg-chart-2" /> Preventivi inviati
                  </span>
                </div>
              </section>

              <section data-slot="product-shot-panel" className={panel}>
                <div className={panelHead}>
                  <h4 className={panelTitle}>Trattative aperte</h4>
                  <p className={cn("tabular", panelNote)}>24 risultati · per ultimo contatto</p>
                </div>
                <table
                  data-slot="product-shot-table"
                  className="w-full border-collapse text-[0.6875rem] [&_td]:border-b [&_td]:border-stone-200 [&_td]:px-3.5 [&_td]:py-[0.5625rem] [&_td]:align-middle"
                >
                  <tbody className="[&>tr:last-child>td]:border-b-0">
                    <tr>
                      <td className="font-medium">Fonderia Bresciana Spa</td>
                      <td className="text-muted-foreground">Brescia · 220 kWp</td>
                      <td className="num text-right whitespace-nowrap">€ 198.000</td>
                      <td>
                        <span className={chip}>In trattativa</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium">Logistica Padana Srl</td>
                      <td className="text-muted-foreground">Verona · 145 kWp</td>
                      <td className="num text-right whitespace-nowrap">€ 132.500</td>
                      <td>
                        <span
                          className={cn(chip, "bg-status-warning/20 text-status-warning-ink")}
                        >
                          Da qualificare
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium">Caseificio Val Seriana</td>
                      <td className="text-muted-foreground">Bergamo · 84 kWp</td>
                      <td className="num text-right whitespace-nowrap">€ 91.400</td>
                      <td>
                        <span className={chip}>Sopralluogo fissato</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium">Mobilificio Orobico Srl</td>
                      <td className="text-muted-foreground">Lecco · 310 kWp</td>
                      <td className="num text-right whitespace-nowrap">€ 265.000</td>
                      <td>
                        <span className={cn(chip, "bg-status-good/12 text-status-good-ink")}>
                          Vinta
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <section data-slot="product-shot-panel" className={panel}>
                <div className={panelHead}>
                  <h4 className={panelTitle}>Attività</h4>
                  <p className={panelNote}>Oggi</p>
                </div>
                <ul
                  data-slot="product-shot-feed"
                  className="list-none px-3.5 pt-1 pb-2.5 [&>li]:grid [&>li]:grid-cols-[22px_1fr] [&>li]:gap-[0.5625rem] [&>li]:border-b [&>li]:border-stone-200 [&>li]:py-[0.5625rem] [&>li:last-child]:border-b-0 [&_p]:text-[0.6875rem] [&_p]:leading-[1.45] [&_strong]:font-medium [&_time]:num [&_time]:mt-0.5 [&_time]:block [&_time]:text-[0.625rem] [&_time]:text-faint"
                >
                  <li>
                    <span
                      data-slot="product-shot-actor"
                      className="grid size-[22px] place-items-center rounded-sm border border-dashed border-stone-400 font-mono text-[0.5rem] font-semibold text-stone-600"
                    >
                      AI
                    </span>
                    <div>
                      <p>
                        <strong>Agente AI</strong> ha qualificato{" "}
                        <strong>Fonderia Bresciana Spa</strong> · 82/100
                        <span className="ml-1 inline-flex rounded-xs border border-dashed border-stone-400 px-1 align-[1px] font-mono text-[0.5rem] tracking-[0.07em] text-stone-600 uppercase">
                          Azione AI
                        </span>
                      </p>
                      <time>09:41</time>
                    </div>
                  </li>
                  <li>
                    <span
                      data-slot="product-shot-actor"
                      className="grid size-[22px] place-items-center rounded-full bg-stone-200 text-[0.5rem] font-semibold text-stone-700"
                    >
                      LF
                    </span>
                    <div>
                      <p>
                        <strong>Luca Ferrari</strong> ha inviato il preventivo{" "}
                        <strong>#2026-0184</strong>
                      </p>
                      <time>09:12</time>
                    </div>
                  </li>
                  <li>
                    <span
                      data-slot="product-shot-actor"
                      className="grid size-[22px] place-items-center rounded-sm border border-dashed border-stone-400 font-mono text-[0.5rem] font-semibold text-stone-600"
                    >
                      AI
                    </span>
                    <div>
                      <p>
                        <strong>Agente AI</strong> ha risposto a 3 messaggi WhatsApp
                        <span className="ml-1 inline-flex rounded-xs border border-dashed border-stone-400 px-1 align-[1px] font-mono text-[0.5rem] tracking-[0.07em] text-stone-600 uppercase">
                          Azione AI
                        </span>
                      </p>
                      <time>08:55</time>
                    </div>
                  </li>
                  <li>
                    <span
                      data-slot="product-shot-actor"
                      className="grid size-[22px] place-items-center rounded-full bg-stone-200 text-[0.5rem] font-semibold text-stone-700"
                    >
                      AR
                    </span>
                    <div>
                      <p>
                        <strong>Anna Rizzo</strong> ha fissato un sopralluogo per il 30/07
                      </p>
                      <time>08:30</time>
                    </div>
                  </li>
                </ul>
              </section>

              <section
                data-slot="product-shot-upsell"
                className={cn(panel, "flex flex-col gap-[0.4375rem] p-3.5")}
              >
                <span className="font-mono text-[0.5625rem] tracking-[0.1em] text-stone-400 uppercase">
                  Modulo da attivare
                </span>
                <h4 className="text-[0.8125rem] font-medium">Finanziamenti</h4>
                <p className="text-[0.6875rem] leading-[1.5] text-muted-foreground">
                  In 7 delle ultime 20 trattative perse il motivo è la liquidità. Con questo modulo
                  il noleggio operativo entra dentro il preventivo.
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className={smallBtn}>Attiva il modulo</span>
                  <span className={cn(smallBtn, quietBtn)}>Come funziona</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
