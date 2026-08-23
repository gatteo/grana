import { CheckIcon } from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  getInitials,
} from "@/registry/grana/ui/avatar";
import { Badge } from "@/registry/grana/ui/badge";
import { Label, Row, Story } from "@/playground/lib/story";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function AvatarStories() {
  return (
    <div>
      <Story title="Human vs machine" note="the contract: humans are round with initials; machines are a square dashed tile">
        <Row className="gap-6">
          <span className="inline-flex items-center gap-2">
            <Avatar initials={getInitials("Matteo Giardino")} />
            <Label>human</Label>
          </span>
          <span className="inline-flex items-center gap-2">
            <Avatar kind="machine" initials="AI" />
            <Label>machine · AI</Label>
          </span>
          <span className="inline-flex items-center gap-2">
            <Avatar kind="machine" initials="SYS" />
            <Label>machine · SYS</Label>
          </span>
        </Row>
      </Story>

      <Story title="Variants" note="outline = Luminars shell avatar (canvas-deep, hairline, mono); filled = RF (stone-300, 600)">
        <Row className="gap-6">
          <Avatar variant="outline" initials="MG" />
          <Label>outline</Label>
          <Avatar variant="filled" initials="MG" />
          <Label>filled</Label>
        </Row>
      </Story>

      <Story title="Sizes" note="xs 20 · sm 24 (Luminars) · md 27 (RF) · lg 32">
        <Row className="gap-6">
          {sizes.map((s) => (
            <span key={s} className="inline-flex items-center gap-2">
              <Avatar size={s} initials="MG" />
              <Label>{s}</Label>
            </span>
          ))}
        </Row>
        <Row className="gap-6">
          {sizes.map((s) => (
            <Avatar key={s} size={s} variant="filled" initials="MG" />
          ))}
        </Row>
        <Row className="gap-6">
          {sizes.map((s) => (
            <Avatar key={s} size={s} kind="machine" initials="AI" />
          ))}
        </Row>
      </Story>

      <Story title="With an image" note="the fallback shows until the image loads; a broken image falls back to initials">
        <Row className="gap-6">
          <Avatar size="lg" initials="MG">
            <AvatarImage
              alt="Matteo Giardino"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23a97a2e'/%3E%3Ccircle cx='32' cy='24' r='12' fill='%23f6f3ee'/%3E%3C/svg%3E"
            />
          </Avatar>
          <Avatar size="lg">
            <AvatarImage alt="" src="/does-not-exist.png" />
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
        </Row>
      </Story>

      <Story title="Presence badge">
        <Row className="gap-6">
          {sizes.map((s) => (
            <Avatar key={s} size={s} initials="MG">
              <AvatarBadge className="bg-status-good">
                <CheckIcon />
              </AvatarBadge>
            </Avatar>
          ))}
        </Row>
      </Story>

      <Story title="Group">
        <Row className="gap-6">
          <AvatarGroup>
            <Avatar initials="MG" />
            <Avatar initials="LB" />
            <Avatar initials="AR" />
            <AvatarGroupCount>+4</AvatarGroupCount>
          </AvatarGroup>
          <AvatarGroup>
            <Avatar size="md" variant="filled" initials="MG" />
            <Avatar size="md" variant="filled" initials="LB" />
            <AvatarGroupCount>+12</AvatarGroupCount>
          </AvatarGroup>
        </Row>
      </Story>

      <Story title="Account row" note="the Luminars sidebar row: avatar · name · mono-caps role">
        <Row>
          <div className="flex w-[220px] items-center gap-[9px] rounded-sm px-2 py-1.5">
            <Avatar initials="MG" />
            <div className="min-w-0">
              <div className="truncate text-[12.5px] font-medium">Matteo Giardino</div>
              <div className="font-mono text-[9.5px] tracking-[.08em] text-faint uppercase">Proprietario</div>
            </div>
          </div>
        </Row>
      </Story>

      <Story title="Feed rows" note="the RF activity feed: actor · sentence (+ a dashed action badge) · mono time">
        <ul className="max-w-[560px] rounded-md border border-border bg-card px-4 pt-1.5 pb-4">
          {[
            { kind: "human" as const, who: "MG", text: <><strong className="font-medium">Matteo</strong> ha chiuso l&apos;opportunità Bianchi Impianti.</>, time: "10:42" },
            { kind: "machine" as const, who: "AI", text: <>Riassunto della chiamata con Acme S.p.A. pronto. <Badge variant="action" className="ml-1.5 align-[1px]">Azione AI</Badge></>, time: "10:08" },
            { kind: "machine" as const, who: "SYS", text: <>Importati 148 contatti da HubSpot. <Badge variant="action" className="ml-1.5 align-[1px]">Automatico</Badge></>, time: "09:30" },
          ].map((row, i) => (
            <li key={i} className="grid grid-cols-[26px_1fr] gap-3 border-b border-border py-[11px] last:border-b-0">
              <Avatar size="md" kind={row.kind} variant="filled" initials={row.who} className="size-[26px]" />
              <div>
                <p className="text-13 leading-[1.45]">{row.text}</p>
                <time className="num mt-[3px] block text-[11px] text-faint">{row.time}</time>
              </div>
            </li>
          ))}
        </ul>
      </Story>
    </div>
  );
}
