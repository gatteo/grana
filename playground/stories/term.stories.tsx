import { Badge } from "@/registry/grana/ui/badge";
import { Chip } from "@/registry/grana/ui/chip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/grana/ui/table";
import { Term } from "@/registry/grana/ui/term";
import { Label, Row, Story } from "@/playground/lib/story";

export default function TermStories() {
  return (
    <>
      <Story title="In a sentence" note="hover or Tab to the word; 180 ms to open, 120 ms grace, Escape dismisses">
        <p className="max-w-[62ch] text-13 text-muted-foreground">
          Ogni esecuzione produce un{" "}
          <Term
            label="giornale"
            explain="Il registro passo per passo di cosa il processo ha fatto, cosa ha chiesto e cosa hai risposto. Resta sul dispositivo."
          />{" "}
          e, quando serve, una{" "}
          <Term
            label="decisione"
            explain="Un punto in cui l'esecuzione non era sicura e si è fermata ad aspettare la tua risposta."
          />
          .
        </p>
      </Story>

      <Story title="Marker policy" note="`?` after plain words; nothing on a chip or badge — the shape is its own affordance">
        <Row>
          <Term label="Affidabilità" explain="Quante esecuzioni su dieci sono arrivate in fondo senza fermarsi." />
          <Term marker="none" explain="L'ultima esecuzione è arrivata in fondo senza chiedere niente.">
            <Chip tone="ok">Attiva</Chip>
          </Term>
          <Term marker="none" explain="Questa proprietà è stata dedotta dal contenuto, non dichiarata da una persona.">
            <Badge variant="dashed">Dedotto</Badge>
          </Term>
        </Row>
      </Story>

      <Story title="In a table head" note="the marker survives the mono-caps cell; the tip is portalled past the scroll container">
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processo</TableHead>
                <TableHead>
                  <Term label="Esecuzioni" explain="Quante volte questo processo è stato eseguito, a mano o su pianificazione." />
                </TableHead>
                <TableHead num>
                  <Term label="Affidabilità" explain="Esecuzioni arrivate in fondo senza fermarsi, su dieci." />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Aggiornamento settimanale</TableCell>
                <TableCell>
                  <Chip tone="ok">Attiva</Chip>
                </TableCell>
                <TableCell num>9,4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Onboarding cliente</TableCell>
                <TableCell>
                  <Chip tone="warning">In revisione</Chip>
                </TableCell>
                <TableCell num>7,1</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Story>

      <Story title="Side" note="preferred above; falls below at the top edge, or when asked">
        <Row>
          <Term side="bottom" label="Sotto" explain="Questo suggerimento si apre sotto la parola." />
          <Term side="right" label="A destra" explain="E questo a destra." />
          <Label>side</Label>
        </Row>
      </Story>
    </>
  );
}
