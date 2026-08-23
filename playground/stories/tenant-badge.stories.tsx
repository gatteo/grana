import { TenantBadge, TenantTile } from "@/registry/grana/ui/tenant-badge";
import { Label, Row, Story } from "@/playground/lib/story";

const LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><rect width="28" height="28" fill="#0058a8"/><circle cx="14" cy="14" r="7" fill="#f6f3ee"/></svg>`,
  );

export default function TenantBadgeStories() {
  return (
    <>
      <Story title="TenantBadge" note="28px ink tile with initials + name + meta line; the customer's mark is the only identity the chrome carries">
        <div className="w-[244px] rounded-lg border border-dashed border-border-strong p-2">
          <TenantBadge name="Rossi Impianti" detail="Piano Team · 12 utenti" />
        </div>
      </Story>

      <Story title="With a logo">
        <div className="w-[244px] rounded-lg border border-dashed border-border-strong p-2">
          <TenantBadge name="Bianchi & Figli" detail="Demand · Piattaforma" logoUrl={LOGO} />
        </div>
      </Story>

      <Story title="Long name, no detail" note="the name truncates inside the sidebar column">
        <div className="w-[244px] rounded-lg border border-dashed border-border-strong p-2">
          <TenantBadge name="Consorzio Installatori Lombardia Orientale" />
        </div>
      </Story>

      <Story title="TenantTile alone" note="the tile is its own export for a topbar or a tenant switcher">
        <Row>
          <TenantTile name="Rossi Impianti" />
          <TenantTile name="Bianchi & Figli" logoUrl={LOGO} />
          <TenantTile name="tecnoedil" />
          <Label>28 · rounded-sm · bg-primary</Label>
        </Row>
      </Story>
    </>
  );
}
