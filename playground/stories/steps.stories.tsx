import { Step, Steps } from "@/registry/grana/ui/steps";
import { Story } from "@/playground/lib/story";

export default function StepsStories() {
  return (
    <div className="max-w-3xl">
      <Story title="Default" note="a real <ol>; the numerals are CSS counters, so steps renumber themselves">
        <Steps className="max-w-md">
          <Step>Premi Consenti. macOS apre questa finestra.</Step>
          <Step>Trova Luminars nell&apos;elenco.</Step>
          <Step>Accendi l&apos;interruttore.</Step>
          <Step>Esci e riapri Luminars. La configurazione riprende da qui.</Step>
        </Steps>
      </Story>

      <Story title="size=sm" note="for a dense panel">
        <Steps size="sm" className="max-w-md">
          <Step>Apri le impostazioni della fatturazione.</Step>
          <Step>Scegli il piano annuale.</Step>
          <Step>Conferma.</Step>
        </Steps>
      </Story>

      <Story
        title="tone=inverse"
        note="the same list over a dark or photographic ground: numerals and rules take the inverse ramp"
      >
        <div className="rounded-lg bg-inverse p-6">
          <Steps tone="inverse" className="max-w-md">
            <Step>Premi Apri il pannello.</Step>
            <Step>Trova Luminars nell&apos;elenco.</Step>
            <Step>Accendi l&apos;interruttore. Questa riga diventa verde da sola.</Step>
          </Steps>
        </div>
      </Story>

      <Story title="Long content" note="a step wraps; the numeral stays pinned to the first line">
        <Steps className="max-w-md">
          <Step>
            Apri Impostazioni di Sistema, poi Privacy e sicurezza, poi Registrazione dello schermo e
            dell&apos;audio di sistema: l&apos;elenco delle applicazioni autorizzate si trova in fondo al
            pannello.
          </Step>
          <Step>Accendi l&apos;interruttore accanto a Luminars.</Step>
        </Steps>
      </Story>
    </div>
  );
}
