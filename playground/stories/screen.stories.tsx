import { Button } from "@/registry/grana/ui/button";
import { Card } from "@/registry/grana/ui/card";
import { Chip } from "@/registry/grana/ui/chip";
import { Page, PageHead } from "@/registry/grana/ui/page";
import { Stat, StatGrid } from "@/registry/grana/ui/stat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/grana/ui/table";
import { TeachingEmpty } from "@/registry/grana/ui/teaching-empty";
import { Term } from "@/registry/grana/ui/term";
import { Story } from "@/playground/lib/story";

/* The composed proof: a real product page built only from the kit, rendered inside a mock of
 * the inset content panel both shells use (14px radius, hairline, shadow-panel — which the RF
 * surface zeroes through the token). Switch the brand: the title changes face, the chrome
 * does not. */

const ROWS = [
  { name: "Rossi Impianti S.p.A.", owner: "Giulia Ferrante", stage: "Proposta inviata", tone: "ok", value: "€ 184.000", days: "12", prob: "65" },
  { name: "Bianchi & Figli", owner: "Marco De Luca", stage: "In trattativa", tone: "info", value: "€ 96.500", days: "4", prob: "40" },
  { name: "Consorzio Installatori Lombardia Orientale", owner: "Giulia Ferrante", stage: "Ferma", tone: "warning", value: "€ 312.000", days: "31", prob: "20" },
  { name: "Tecnoedil", owner: "Sara Conti", stage: "Persa", tone: "attention", value: "€ 48.200", days: "45", prob: "0" },
  { name: "Verdi Impianti", owner: "Marco De Luca", stage: "Qualificata", tone: "quiet", value: "€ 22.750", days: "1", prob: "10" },
] as const;

export default function ScreenStories() {
  return (
    <>
      <Story title="A product page" note="Page wide · PageHead · StatGrid · Card padded={false} + Table · TeachingEmpty — switch the brand">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-panel">
          <Page width="wide" stack>
            <PageHead
              title="Trattative"
              subtitle="128 trattative aperte · 14 in attesa di risposta · aggiornato alle 14:32"
              actions={
                <>
                  <Button variant="quiet">Esporta</Button>
                  <Button variant="primary">Nuova trattativa</Button>
                </>
              }
            />

            <StatGrid>
              <Stat label="Pipeline" value="€ 1.284.000" delta="+12% vs mese scorso" deltaDirection="up" base="su 128 trattative · 30 gg" />
              <Stat label="Tasso di chiusura" value="23,4" suffix="%" delta="−2,1 pt vs trimestre" deltaDirection="down" base="41 chiuse / 175 · 90 gg" />
              <Stat label="Tempo medio" value="18" suffix="gg" delta="invariato" deltaDirection="flat" base="mediana · ultime 60 chiuse" />
              <Stat label="In attesa di risposta" value="14" base="da più di 7 gg: 5" />
            </StatGrid>

            <Card padded={false}>
              <Table minWidth={720}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trattativa</TableHead>
                    <TableHead>Responsabile</TableHead>
                    <TableHead>
                      <Term label="Fase" explain="Il punto del percorso di vendita in cui la trattativa si trova adesso. Cambia solo quando qualcuno la sposta." />
                    </TableHead>
                    <TableHead num>Valore</TableHead>
                    <TableHead num>
                      <Term label="Giorni" explain="Giorni dall'ultimo contatto con il cliente, in qualsiasi direzione." />
                    </TableHead>
                    <TableHead num>Prob.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.owner}</TableCell>
                      <TableCell>
                        <Chip tone={r.tone}>{r.stage}</Chip>
                      </TableCell>
                      <TableCell num>{r.value}</TableCell>
                      <TableCell num>{r.days}</TableCell>
                      <TableCell num>{r.prob} %</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <TeachingEmpty
              eyebrow="Decisioni"
              title="Nessuna decisione in attesa"
              body="Quando un'esecuzione non è sicura di un passo, si ferma e te lo chiede qui. Finché la lista è vuota, i processi stanno andando avanti da soli."
              action="Esegui un processo"
              onAction={() => {}}
            />
          </Page>
        </div>
      </Story>
    </>
  );
}
