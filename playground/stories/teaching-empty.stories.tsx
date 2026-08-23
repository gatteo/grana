import { Button } from "@/registry/grana/ui/button";
import { TeachingEmpty } from "@/registry/grana/ui/teaching-empty";
import { Story } from "@/playground/lib/story";

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
