import { ModuleCell, ModulesGrid, moduleStatusVariants } from "@/registry/grana/ui/modules-grid";
import { Story } from "@/playground/lib/story";

export default function ModulesGridStories() {
  return (
    <>
      <Story
        title="La mappa dei moduli"
        note="four columns on the hairline grid (two at 1000, one at 560); every cell prints its state — the roadmap is public"
      >
        <ModulesGrid>
          <ModuleCell
            group="Acquisizione"
            status={{ label: "Live", tone: "live" }}
            name="Moduli lead"
            copy="Form whitelabel sul tuo sito. I lead entrano già assegnati."
          />
          <ModuleCell
            group="Acquisizione"
            status={{ label: "Beta", tone: "beta" }}
            name="Qualificatore AI"
            copy="Chiama e scrive entro due minuti, di notte e nei weekend."
          />
          <ModuleCell
            group="Acquisizione"
            status={{ label: "Beta", tone: "beta" }}
            name="Chatbot"
            copy="Risponde su WhatsApp con i prezzi e gli incentivi giusti."
          />
          <ModuleCell
            group="Vendita"
            status={{ label: "Live", tone: "live" }}
            name="Deals"
            copy="La pipeline. Nata per essere usata in furgone, dal telefono."
          />
          <ModuleCell
            group="Vendita"
            status={{ label: "Live", tone: "live" }}
            name="Calcolatore incentivi"
            copy="Detrazioni, IVA e payback aggiornati. Con la data di verifica."
          />
          <ModuleCell
            group="Vendita"
            status={{ label: "In arrivo", tone: "soon" }}
            name="Finanziamento"
            copy="Rate e pre-delibera dentro il preventivo. Partner convenzionati."
          />
          <ModuleCell
            group="Operations"
            status={{ label: "In arrivo", tone: "soon" }}
            name="Pratiche"
            copy="Scadenze, allegati e stato di ogni pratica sullo stesso record."
          />
          <ModuleCell
            group="Crescita"
            status={{ label: "Beta", tone: "beta" }}
            name="Reputazione"
            copy="Chiede la recensione al momento giusto: a impianto acceso."
          />
        </ModulesGrid>
      </Story>

      <Story
        title="I tre stati, da soli"
        note="live carries the only colour, on the AA-safe ink over a 12% wash; beta is a stone fill; in arrivo is a hairline outline — a thing not filled in"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className={moduleStatusVariants({ tone: "live" })}>Live</span>
          <span className={moduleStatusVariants({ tone: "beta" })}>Beta</span>
          <span className={moduleStatusVariants({ tone: "soon" })}>In arrivo</span>
        </div>
      </Story>

      <Story
        title="Nomi navigabili · gruppi lunghi · nessuno stato"
        note="the name takes a link element; a cell without a status keeps the top row for the group label alone; min-height 176px holds the grid square"
      >
        <ModulesGrid delay={0.08}>
          <ModuleCell
            group="Presenza online"
            status={{ label: "Live", tone: "live" }}
            name={
              <a className="link" href="#modules-grid">
                Sito e recensioni
              </a>
            }
            copy="Il sito dell’azienda con i lavori fatti e le recensioni verificate, aggiornato da solo a impianto consegnato."
          />
          <ModuleCell
            group="Presenza online"
            name={
              <a className="link" href="#modules-grid">
                Configuratore impianto
              </a>
            }
            copy="Il configuratore col tuo marchio, da mettere sul tuo sito."
          />
          <ModuleCell
            group="Operations"
            status={{ label: "In arrivo", tone: "soon" }}
            name="Magazzino e commesse"
            copy="Materiali, squadre e collaudi: ogni passaggio ha uno stato che tutta l’azienda vede."
          />
          <ModuleCell
            group="Crescita"
            status={{ label: "Beta", tone: "beta" }}
            name="Referral e passaparola"
            copy="Chiede la presentazione a chi è appena stato contento."
          />
        </ModulesGrid>
      </Story>

      <Story title="Due colonne" note="the grid at its 1000px step, forced">
        <ModulesGrid className="grid-cols-2">
          <ModuleCell
            group="Acquisizione"
            status={{ label: "Live", tone: "live" }}
            name="Moduli lead"
            copy="Form whitelabel sul tuo sito. I lead entrano già assegnati."
          />
          <ModuleCell
            group="Vendita"
            status={{ label: "In arrivo", tone: "soon" }}
            name="Finanziamento"
            copy="Rate e pre-delibera dentro il preventivo. Partner convenzionati."
          />
        </ModulesGrid>
      </Story>
    </>
  );
}
