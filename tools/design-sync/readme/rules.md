## Rules that are not stylistic preferences

- **A status is a dot AND a word** — never colour alone. Use `<Chip tone=…>` or
  `<StatusDot tone=…>`; the six tones are `ok · attention · serious · warning · info · quiet`.
  A chip naming something that is *not* a status (an origin, a kind) passes `dot={false}`.
- **Chip vs Badge.** A `<Chip>` reports a STATE the thing is in; a `<Badge>` names a
  PROPERTY of the thing itself (its grade, who authored it) in mono caps. Badge's
  `variant="dashed"` is the standing signal for *inferred, not asserted* — use it rather than
  presenting a guess as a fact. Who performs a step is an `<ExecutorChip>`.
- **Two filter primitives, on purpose.** `<Segmented>` is one choice from a short FIXED set,
  shown at once on a track (it filters, never navigates). `<FilterChip>` is for a DYNAMIC
  many-of-many set that may wrap (a catalog's categories). `<Tabs>` navigate between panels.
  Do not force one to do another's job.
- **One primary per screen.** `<Button variant="primary">` is the ink ground; every other verb
  is `variant="quiet"` (the default) and `variant="ghost"` is the icon trigger face.
  Destructive verbs are a two-step ladder: `<Button destructive>` (quiet, warms to critical
  under the pointer) for the verb you reach for, then `<Button variant="danger">` for the one
  that commits. Buttons are pills; a link that sits in a button row is `variant="link"`;
  a button that is really a link is `<Button render={<a href="…" />}>`.
- **Empty states teach.** `<TeachingEmpty>` for a surface reached for the first time — it
  carries the one action that fills it. `<Notice>` for a condition the person did not cause
  (offline, degraded, nothing yet), stated calmly, with at most one action. `<Empty>` is the
  generic faint line. `<FirstVisit>` is the dismissible inline first-visit panel (never modal).
- **Pick a page width, do not invent one:** `<Page width="narrow|medium|wide|full">`
  (760 / 860 / 1080 / fills the card). Narrow reads, wide is for tables. `<PageHead>` carries
  the title in the product's voice, a tabular subtitle, and at most one primary action.
- **Numerals are never proportional.** Every numeric readout carries `num`; numeric table
  columns pass `num` on the `<TableHead>` and its `<TableCell>`s. Section labels are
  `<Eyebrow>` (or the `eyebrow` utility) — mono, uppercase.
- **Never write a raw `<input>`, `<select>` or `<textarea>`.** Use `<Input>` (`mono` for keys,
  ids and times), `<NativeSelect>` (the default select of the desktop app — the OS popup) or
  `<Select>` (the custom popup), `<Textarea>`, `<Checkbox>`, `<Switch>`; wrap them in
  `<Field>` + `<FieldLabel>` / `<FieldDescription>` / `<FieldError>`. They carry the one field
  shell and deliberately paint no focus ring of their own — the stylesheet gives every
  focusable thing the global `:focus-visible` outline.
- **A list of rows is a `<Card padded={false}>`** wrapping the `<Table>` (or an `<ItemGroup>`
  of `<Item>`s, or a `<Feed>`) — the card owns the border and clips the child to its radius.
  Every list in the product is that same object; do not hand-roll a bordered box. A KPI row
  is a `<StatGrid>` of `<Stat>`s (a null value renders a dash, never a zero).
- **Layered UI is portalled and `fixed`** (`<DropdownMenu>`, `<Tooltip>`, `<Popover>`,
  `<Dialog>`, `<Sheet>`, `<Term>`): every product surface scrolls inside an inset panel, and
  a clipping ancestor would cut an absolutely-positioned layer. Toasts go through `notify()`
  (a tone, a title, a mono timestamp) with one `<Toaster>` mounted per page.
- **Borders are 1px hairlines** (`border-border`; `border-border-strong` for modals and
  frames). Never 2px, never coloured borders except the destructive/invalid state. Fills
  and borders come from the stone ramp; status colours never decorate.
- Both products are **light only**. Dark is punctuation (one marketing band), never a theme.

## An idiomatic screen

```jsx
const { Page, PageHead, Button, StatGrid, Stat, Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Chip, Term, TeachingEmpty } = window.Grana;

<Page width="wide" stack>
  <PageHead
    title="Trattative"
    subtitle="128 trattative aperte · 14 in attesa di risposta · aggiornato alle 14:32"
    actions={<><Button variant="quiet">Esporta</Button><Button variant="primary">Nuova trattativa</Button></>}
  />
  <StatGrid>
    <Stat label="Pipeline" value="€ 1.284.000" delta="+12% vs mese scorso" deltaDirection="up" base="su 128 trattative · 30 gg" />
    <Stat label="Tasso di chiusura" value="23,4" suffix="%" delta="−2,1 pt vs trimestre" deltaDirection="down" base="41 chiuse / 175 · 90 gg" />
    <Stat label="Tempo medio" value="18" suffix="gg" delta="invariato" deltaDirection="flat" base="mediana · ultime 60 chiuse" />
    <Stat label="In attesa di risposta" value={null} teach="Compare dopo la prima esecuzione." />
  </StatGrid>
  <Card padded={false}>
    <Table minWidth={720}>
      <TableHeader>
        <TableRow>
          <TableHead>Trattativa</TableHead>
          <TableHead><Term label="Fase" explain="Il punto del percorso di vendita in cui la trattativa si trova adesso." /></TableHead>
          <TableHead num>Valore</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Rossi Impianti S.p.A.</TableCell>
          <TableCell><Chip tone="ok">Proposta inviata</Chip></TableCell>
          <TableCell num>€ 184.000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
  <TeachingEmpty
    eyebrow="Decisioni"
    title="Nessuna decisione in attesa"
    body="Quando un'esecuzione non è sicura si ferma qui e aspetta la tua risposta."
    action="Avvia un processo"
  />
</Page>
```
