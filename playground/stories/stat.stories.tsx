import { Stat, StatGrid } from "@/registry/grana/ui/stat";
import { Story } from "@/playground/lib/story";

export default function StatStories() {
  return (
    <>
      <Story title="StatGrid · cells (RF KPI row)" note="one box, hairline-gap cells; eyebrow label, tabular value, delta with direction + a word, faint mono base">
        <StatGrid>
          <Stat
            label="Pipeline"
            value="€ 1.284.000"
            delta="+12% vs mese scorso"
            deltaDirection="up"
            base="su 128 trattative · 30 gg"
          />
          <Stat
            label="Tasso di chiusura"
            value="23,4"
            suffix="%"
            delta="−2,1 pt vs trimestre"
            deltaDirection="down"
            base="41 chiuse / 175 · 90 gg"
          />
          <Stat
            label="Tempo medio"
            value="18"
            suffix="gg"
            delta="invariato"
            deltaDirection="flat"
            base="mediana · ultime 60 chiuse"
          />
          <Stat label="Trattative attive" value="128" base="aggiornato 14:32" />
        </StatGrid>
      </Story>

      <Story title="StatGrid · cards (Luminars Home)" note="separate cards twelve apart; a null value is a dash and a teaching line — a dash never pretends to be a zero">
        <StatGrid variant="cards">
          <Stat size="md" label="Processi" value="7" base="2 eseguiti oggi" />
          <Stat size="md" label="Ore recuperate" value="4,5" suffix="h" base="questa settimana" />
          <Stat size="md" label="Decisioni aperte" value="3" delta="+1 da ieri" deltaDirection="up" />
          <Stat
            size="md"
            label="Affidabilità"
            value={null}
            teach="Compare dopo la prima esecuzione completa di un processo."
          />
        </StatGrid>
      </Story>

      <Story title="Columns" note="2 · 3; cells collapse to one column under 640px">
        <div className="grid gap-4">
          <StatGrid columns={2}>
            <Stat label="Vinte" value="41" delta="+6 vs trimestre" deltaDirection="up" base="90 gg" />
            <Stat label="Perse" value="34" delta="+9 vs trimestre" deltaDirection="down" base="90 gg" />
          </StatGrid>
          <StatGrid columns={3}>
            <Stat label="Contatti" value="1.204" />
            <Stat label="Aziende" value="318" />
            <Stat label="Utenti attivi" value="12" suffix="/ 15" />
          </StatGrid>
        </div>
      </Story>

      <Story title="Italian-length labels and values" note="the label wraps as an eyebrow; the value never breaks">
        <StatGrid columns={2}>
          <Stat
            label="Valore medio ponderato delle trattative in corso"
            value="€ 10.031,25"
            delta="+0,8% rispetto alla settimana precedente"
            deltaDirection="up"
            base="media ponderata su 128 trattative"
          />
          <Stat
            label="Giorni dalla prima risposta"
            value="2,7"
            suffix="gg"
            delta="peggiorato di 0,4 gg"
            deltaDirection="down"
            base="mediana · 30 gg"
          />
        </StatGrid>
      </Story>
    </>
  );
}
