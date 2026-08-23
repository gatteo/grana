import { CaseStudyBlock } from "@/registry/grana/ui/case-study-block";
import { Story } from "@/playground/lib/story";

const READ = (
  <a className="link" href="#">
    Leggi il caso studio →
  </a>
);

export default function CaseStudyBlockStories() {
  return (
    <>
      <Story
        title="Il blocco completo"
        note="claim on the left, evidence on the right · the ledger enters 0.12s behind · stacks under 900px"
      >
        <CaseStudyBlock
          index="02"
          eyebrow="Caso studio"
          metric="+9,3"
          metricSuffix="punti"
          label="Tasso di chiusura sulle trattative qualificate consegnate in piattaforma."
          quote={
            <>
              &ldquo;Primo sistema di acquisizione strutturato sul fotovoltaico industriale:
              trattative qualificate sui cinque standard, consegnate in piattaforma con le
              procedure di chiamata condivise col team.&rdquo;
            </>
          }
          cite="Azienda di luce e gas espansa nel fotovoltaico · provincia di Abruzzo"
          rows={[
            { label: "Tasso di chiusura", before: "18,0%", after: "27,3%" },
            { label: "Fatturato chiuso", before: "11.800 € investiti", after: "600.000 €" },
            { label: "Ritorno sull'investimento", before: "1 euro investito", after: "50,8×" },
          ]}
          note="Periodo di misurazione: dato aggiornato ad agosto 2026."
          link={READ}
        />
      </Story>

      <Story
        title="Il numero è una stringa già formattata"
        note="the home passes the case's own value, unit included — at clamp(3.5rem,7vw,5.75rem) a long one wraps, exactly as it does on the live page"
      >
        <CaseStudyBlock
          index="05"
          eyebrow="Caso studio"
          metric="1.650.000 €"
          label="Fatturato chiuso in meno di un anno da un'azienda nata a metà 2025."
          quote={
            <>
              &ldquo;Sistema di acquisizione costruito da zero sulle aziende della zona con tetto
              sfruttabile e consumi alti, qualificazione sui cinque standard e pipeline unica con
              fonte registrata su ogni trattativa.&rdquo;
            </>
          }
          cite="Installatore fotovoltaico ed efficientamento energetico · provincia di Veneto"
          rows={[
            { label: "Fatturato chiuso", before: "24.500 € investiti", after: "1.650.000 €" },
            { label: "Ritorno sull'investimento", before: "1 euro investito", after: "67,3×" },
          ]}
          note="Periodo di misurazione: dato aggiornato ad agosto 2026. Storia anonimizzata su richiesta del cliente."
          link={READ}
        />
      </Story>

      <Story
        title="Il minimo"
        note="no index, no unit, no cite, no note, no link — and a null quote, which is how the home renders a case the client has not spoken about"
      >
        <CaseStudyBlock
          eyebrow="Caso studio"
          metric="143.000 €"
          label="Fatturato chiuso in Toscana."
          quote={null}
          rows={[{ label: "Fatturato chiuso", before: "9.200 € investiti", after: "143.000 €" }]}
        />
      </Story>

      <Story
        title="Registro lungo"
        note="six rows, long Italian terms: the 1fr auto auto grid keeps the two number columns in one rail"
      >
        <CaseStudyBlock
          index="03"
          eyebrow="Caso studio · Piemonte"
          metric="44,5"
          metricSuffix="× di ritorno"
          label="Un installatore piemontese che vendeva solo per passaparola, dodici mesi dopo l'avvio del sistema di acquisizione."
          quote={
            <>
              &ldquo;Le trattative arrivavano, poi si fermavano dove si fermano ancora oggi:
              processi improvvisati, la vendita sulle spalle del titolare, strumenti che non si
              parlano. Ora la pipeline è una sola e ogni trattativa ha la sua fonte
              registrata.&rdquo;
            </>
          }
          cite="Installatore fotovoltaico industriale · provincia di Piemonte"
          rows={[
            { label: "Fatturato chiuso", before: "16.400 € investiti", after: "730.000 €" },
            { label: "Ritorno sull'investimento", before: "1 euro investito", after: "44,5×" },
            { label: "Trattative qualificate consegnate", before: "0", after: "312" },
            { label: "Tasso di chiusura sulle qualificate", before: "18,0%", after: "27,3%" },
            { label: "Tempo medio dalla richiesta al preventivo", before: "9 gg", after: "1,5 gg" },
            { label: "Impianti installati", before: "4", after: "39" },
          ]}
          note="Periodo di misurazione: gennaio – agosto 2026. Storia anonimizzata su richiesta del cliente."
          link={READ}
        />
      </Story>
    </>
  );
}
