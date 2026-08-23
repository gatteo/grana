import { Button } from "@/registry/grana/ui/button";
import { Notice } from "@/registry/grana/ui/notice";
import { Story } from "@/playground/lib/story";

export default function NoticeStories() {
  return (
    <div>
      <Story title="Card (default)" note="the Luminars .notice: sunken box, hairline, voice-face title, 32px padding, max 560">
        <Notice title="Sei offline">
          Le registrazioni continuano in locale. Il workspace si aggiorna da solo appena torna la rete.
        </Notice>
      </Story>

      <Story title="Card with one action" note="a Notice may have nothing to offer — or exactly one thing">
        <Notice
          title="Il motore non risponde"
          action={
            <Button variant="quiet" size="sm">
              Riavvia il motore
            </Button>
          }
        >
          L&apos;ultimo battito risale a 4 minuti fa. Le bozze già scritte restano al loro posto.
        </Notice>
      </Story>

      <Story title="Card with an eyebrow" note="the RF upsell shape: eyebrow · title · body · action">
        <Notice
          eyebrow="Piano Pro"
          title="Le esportazioni sono sul piano Pro"
          action={
            <>
              <Button variant="primary" size="sm">
                Passa a Pro
              </Button>
              <Button variant="ghost" size="sm">
                Scopri di più
              </Button>
            </>
          }
        >
          Esporta i report in CSV e PDF e condividili con il team senza limiti.
        </Notice>
      </Story>

      <Story title="Plain" note="the RF .empty: a centered faint line, no box">
        <div className="max-w-[560px] rounded-md border border-border bg-card">
          <Notice variant="plain">Nessuna attività negli ultimi 30 giorni.</Notice>
        </div>
      </Story>

      <Story title="Plain with title and action">
        <div className="max-w-[560px] rounded-md border border-border bg-card">
          <Notice
            variant="plain"
            title="Ancora nessun cliente"
            action={
              <Button variant="quiet" size="sm">
                Importa da CSV
              </Button>
            }
          >
            I clienti compaiono qui appena il primo connettore sincronizza.
          </Notice>
        </div>
      </Story>

      <Story title="Title only" note="nothing to add, nothing to do">
        <Notice title="Nessuna registrazione ancora" />
      </Story>
    </div>
  );
}
