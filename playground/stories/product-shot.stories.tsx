import { Panel, PanelScroll } from "@/registry/grana/ui/panel"
import { ProductShot } from "@/registry/grana/ui/product-shot"
import { Story } from "@/playground/lib/story"

export default function ProductShotStories() {
  return (
    <>
      <Story
        title="ProductShot · the home page's rising panel"
        note="the product drawn at ~70% scale — warm-grey canvas, tenant sidebar, one white work card. Inside <Panel><PanelScroll>, exactly as RisingPanel frames it on the home page."
      >
        <Panel>
          <PanelScroll>
            <ProductShot />
          </PanelScroll>
        </Panel>
      </Story>

      <Story
        title="ProductShot · unframed, custom label"
        note="the form used inside a band that already supplies the frame: the shot's own stone-100 canvas and tenant sidebar read to the edge. `label` is the only content prop — it is the alt text of a role=img."
      >
        <ProductShot label="Anteprima della dashboard di Elettro Rossi: lead, trattative e attività del team" />
      </Story>

      <Story
        title="ProductShot · below the 900px measure"
        note="min-width 900px is deliberate: in a 620px column it scrolls sideways rather than reflowing, because a screenshot that reflows lies about the product."
      >
        <div className="max-w-[620px]">
          <Panel>
            <PanelScroll>
              <ProductShot />
            </PanelScroll>
          </Panel>
        </div>
      </Story>

      <Story
        title="ProductShot · className passes through"
        note="the illustration is self-contained; className only places it. Here it is held to the shot's own minimum and centred."
      >
        <div className="flex justify-center">
          <ProductShot className="w-[900px] rounded-lg border border-border-strong" />
        </div>
      </Story>
    </>
  )
}
