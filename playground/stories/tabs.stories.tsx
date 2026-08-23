import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/grana/ui/tabs";
import { Label, Row, Story } from "@/playground/lib/story";

const tabs = [
  { value: "runs", label: "Esecuzioni", body: "Le ultime 30 esecuzioni del processo." },
  { value: "steps", label: "Passi", body: "I 14 passi, nell'ordine in cui vengono eseguiti." },
  { value: "settings", label: "Impostazioni", body: "Nome, owner, pianificazione." },
];

export default function TabsStories() {
  return (
    <div>
      <Story title="Line (default)" note="quiet 13px labels on a hairline; the active one in ink with a 2px ink underline sitting on the rule">
        <Tabs defaultValue="runs" className="max-w-md">
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="off" disabled>
              Disabilitata
            </TabsTrigger>
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <p className="text-muted-foreground">{t.body}</p>
            </TabsContent>
          ))}
        </Tabs>
      </Story>

      <Story title="Filled" note="variant=default: the raised pill strip (the Segmented recipe) for a contained switch">
        <Tabs defaultValue="steps" className="max-w-md">
          <TabsList variant="default">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <p className="text-muted-foreground">{t.body}</p>
            </TabsContent>
          ))}
        </Tabs>
      </Story>

      <Story title="Vertical" note="orientation=vertical: the rule and the indicator move to the right edge">
        <Row className="items-start">
          <Tabs defaultValue="runs" orientation="vertical" className="max-w-md">
            <TabsList>
              {tabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="pr-3">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((t) => (
              <TabsContent key={t.value} value={t.value}>
                <p className="text-muted-foreground">{t.body}</p>
              </TabsContent>
            ))}
          </Tabs>
          <Label>orientation=vertical</Label>
        </Row>
      </Story>
    </div>
  );
}
