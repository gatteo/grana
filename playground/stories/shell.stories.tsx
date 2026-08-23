import { HomeIcon, ListChecksIcon, MoreHorizontalIcon, PlugIcon, SettingsIcon, WorkflowIcon } from "lucide-react";

import { Button } from "@/registry/grana/ui/button";
import { Card, CardHeader } from "@/registry/grana/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/grana/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/grana/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/grana/ui/table";
import { Story } from "@/playground/lib/story";

const processes = [
  { name: "Riconciliazione fatture", owner: "Amministrazione", state: "Pronto", runs: 128, last: "09:41" },
  { name: "Aggiornamento settimanale del team", owner: "Direzione", state: "In attesa", runs: 31, last: "ieri" },
  { name: "Onboarding nuovo cliente", owner: "Customer success", state: "Bloccato", runs: 9, last: "3g fa" },
  { name: "Report incassi mensile", owner: "Finanza", state: "Pronto", runs: 12, last: "1 ago" },
  { name: "Richiesta preventivo installatori", owner: "Vendite", state: "Pronto", runs: 412, last: "11:58" },
  { name: "Archiviazione contratti scaduti", owner: "Legale", state: "Archiviato", runs: 3, last: "30 giu" },
];

const nav = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "processes", label: "Processi", icon: WorkflowIcon, count: "41" },
  { id: "decisions", label: "Decisioni", icon: ListChecksIcon, count: "3", pill: true },
];

/* The composed product shell: SidebarProvider + a transparent nav + the inset content card
 * holding a list panel (Card padded=false > Table). Under `luminars` the canvas is ecru and the
 * active row a deeper tint; under `rf` the canvas is stone-100 and the active row a white pill
 * with an inset hairline — from the tokens, not from a brand branch. */
export default function ShellStories() {
  return (
    <div>
      <Story title="Sidebar + inset content card + list panel" note="wrapper fixed to 640px for the story; the content card scrolls inside itself">
        <SidebarProvider className="h-[640px] rounded-md border border-dashed border-border-strong">
          <Sidebar collapsible="none" variant="inset">
            <SidebarHeader>
              <div className="flex items-center justify-between">
                <span className="px-2 font-voice text-[17px] font-bold text-foreground">Luminars</span>
                <SidebarTrigger />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Lavoro</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {nav.map((n) => (
                      <SidebarMenuItem key={n.id}>
                        <SidebarMenuButton isActive={n.id === "processes"}>
                          <n.icon />
                          <span>{n.label}</span>
                        </SidebarMenuButton>
                        {n.count ? <SidebarMenuBadge variant={n.pill ? "pill" : "plain"}>{n.count}</SidebarMenuBadge> : null}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Unità</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {["Demand", "Piattaforma", "Academy", "Installatori"].map((u, i) => (
                      <SidebarMenuItem key={u}>
                        <SidebarMenuButton>
                          <span>{u}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>{[12, 7, 0, 3][i]}</SidebarMenuBadge>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <PlugIcon />
                    <span>Connessioni</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <SettingsIcon />
                    <span>Impostazioni</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <div className="px-8 pt-7 pb-10">
              <header className="mb-5 flex items-end justify-between gap-6">
                <div>
                  <h1 className="font-voice text-2xl font-bold tracking-[-0.01em]">Processi</h1>
                  <p className="mt-1 text-muted-foreground">
                    Tutto ciò che Luminars sa ripetere per te. <span className="num">41</span> processi,{" "}
                    <span className="num">3</span> decisioni aperte.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button>Importa</Button>
                  <Button variant="primary">Nuovo processo</Button>
                </div>
              </header>
              <Card padded={false}>
                <CardHeader title="Tutti i processi" context="6 di 41" />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Processo</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead num>Esecuzioni</TableHead>
                      <TableHead num>Ultima</TableHead>
                      <TableHead aria-label="Azioni" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processes.map((p) => (
                      <TableRow key={p.name}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex h-5 items-center gap-1.5 rounded-full border border-border px-2 text-xs text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-stone-400" />
                            {p.state}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{p.owner}</TableCell>
                        <TableCell num>{p.runs}</TableCell>
                        <TableCell num className="text-muted-foreground">
                          {p.last}
                        </TableCell>
                        <TableCell className="w-0 py-1 pr-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" aria-label={`Azioni per ${p.name}`} />}>
                              <MoreHorizontalIcon />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Apri</DropdownMenuItem>
                              <DropdownMenuItem>Duplica</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">Elimina</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Story>
    </div>
  );
}
