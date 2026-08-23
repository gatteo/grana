import { ChevronRightIcon, HomeIcon, ListChecksIcon, PlugIcon, PlusIcon, SettingsIcon, WorkflowIcon } from "lucide-react";

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
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
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
    </div>
  );
}
