import { ChevronRightIcon, HomeIcon, ListChecksIcon, PlugIcon, PlusIcon, SettingsIcon, WorkflowIcon } from "lucide-react";

import { useIsMobile } from "@/registry/grana/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/grana/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/registry/grana/ui/sidebar";
import { Label, Row, Story } from "@/playground/lib/story";

function Nav({ active }: { active: string }) {
  return (
    <>
      <SidebarHeader>
        <span className="px-2 font-voice text-[17px] font-bold text-foreground">Luminars</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Lavoro</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "home"}>
                  <HomeIcon />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "processes"}>
                  <WorkflowIcon />
                  <span>Processi</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>41</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "decisions"}>
                  <ListChecksIcon />
                  <span>Decisioni</span>
                </SidebarMenuButton>
                <SidebarMenuBadge variant="pill">3</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Unità</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Aggiungi unità">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger render={<SidebarMenuButton />}>
                    <span>Demand</span>
                  </CollapsibleTrigger>
                  <SidebarMenuAction render={<span />} aria-hidden>
                    <ChevronRightIcon className="transition-transform group-data-open/collapsible:rotate-90" />
                  </SidebarMenuAction>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#pipeline" isActive={active === "pipeline"}>
                          <span>Pipeline</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#campagne">
                          <span>Campagne</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <span>Piattaforma</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>12</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <span>Academy (presto)</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <span>Un nome di unità davvero lungo che deve troncare</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>1.204</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Caricamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon width="78%" />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon width="56%" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={active === "connections"}>
              <PlugIcon />
              <span>Connessioni</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={active === "settings"}>
              <SettingsIcon />
              <span>Impostazioni</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

/* The nav becomes a Sheet under 768px, and everything the sheet says out loud is a prop now:
 * `mobileTitle` / `mobileDescription` on Sidebar, `label` on SidebarTrigger and SidebarRail.
 * The strings are screen-reader only, so at the playground's width there is nothing to draw —
 * below the breakpoint this renders the real sheet, with its Italian name. */
const IT = {
  mobileTitle: "Navigazione",
  mobileDescription: "Apre la navigazione principale su schermo stretto.",
  trigger: "Apri la navigazione",
  rail: "Apri e chiudi la navigazione",
};

function TranslatedSheet() {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className="max-w-2xl rounded-md border border-dashed border-border-strong p-4">
        <span className="eyebrow">sotto i 768px la nav diventa un Sheet</span>
        <p className="mt-2 text-13 text-muted-foreground">
          Titolo, descrizione ed etichette del pulsante sono props con l’inglese come default:
          finché nessuno passa niente non cambia una virgola, e un prodotto italiano non deve più
          spedire &quot;Toggle Sidebar&quot; a uno screen reader.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-sm bg-muted p-3 font-mono text-xs text-muted-foreground">{`<Sidebar
  mobileTitle="${IT.mobileTitle}"
  mobileDescription="${IT.mobileDescription}"
/>
<SidebarTrigger label="${IT.trigger}" />
<SidebarRail label="${IT.rail}" />`}</pre>
        <div className="mt-3 flex items-center gap-2">
          <SidebarTrigger label={IT.trigger} />
          <span className="text-13 text-faint">
            SidebarTrigger label=&quot;{IT.trigger}&quot;
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Sidebar mobileTitle={IT.mobileTitle} mobileDescription={IT.mobileDescription}>
        <Nav active="home" />
        <SidebarRail label={IT.rail} />
      </Sidebar>
      <div className="flex items-center gap-2 p-2">
        <SidebarTrigger label={IT.trigger} />
        <span className="text-13 text-muted-foreground">{IT.trigger}</span>
      </div>
    </div>
  );
}

export default function SidebarStories() {
  return (
    <div>
      <Story
        title="The nav"
        note="transparent on the canvas, no right border, width from --sidebar-width (236 Luminars / 244 RF); rows 13px / 6px radius; active = sidebar-active + inset sidebar-active-ring + 500 — the Luminars tint and the RF white pill from the same recipe"
      >
        <Row className="items-start">
          <SidebarProvider className="h-[560px] w-auto rounded-md border border-dashed border-border-strong">
            <Sidebar collapsible="none">
              <Nav active="processes" />
            </Sidebar>
          </SidebarProvider>
          <SidebarProvider className="h-[560px] w-auto rounded-md border border-dashed border-border-strong">
            <Sidebar collapsible="none">
              <Nav active="pipeline" />
            </Sidebar>
          </SidebarProvider>
          <Label>collapsible=none · the dashed frame is the story's, not the component's</Label>
        </Row>
      </Story>

      <Story
        title="Le stringhe del Sheet mobile sono props"
        note="mobileTitle / mobileDescription su Sidebar, label su SidebarTrigger e SidebarRail — l’inglese di oggi resta il default, così nulla cambia finché un prodotto non passa la sua lingua"
      >
        <SidebarProvider className="h-auto w-full">
          <TranslatedSheet />
        </SidebarProvider>
      </Story>
    </div>
  );
}
