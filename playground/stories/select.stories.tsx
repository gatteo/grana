import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/grana/ui/native-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/grana/ui/select";
import { Label, Row, Story } from "@/playground/lib/story";

const fusi = {
  "Europe/Rome": "Europa / Roma (CET)",
  "Europe/London": "Europa / Londra (GMT)",
  "America/New_York": "America / New York (EST)",
  "Asia/Tokyo": "Asia / Tokyo (JST)",
};

const connettori = {
  asana: "Asana",
  linear: "Linear",
  notion: "Notion",
  gmail: "Gmail",
  calendar: "Google Calendar",
};

export default function SelectStories() {
  return (
    <div className="max-w-3xl">
      <Story title="NativeSelect" note="the default for the desktop app — the OS popup, the field shell, an SVG caret">
        <div className="grid max-w-sm gap-3">
          <NativeSelect defaultValue="" aria-label="Fuso orario">
            <NativeSelectOption value="" disabled>
              Scegli un fuso orario…
            </NativeSelectOption>
            {Object.entries(fusi).map(([v, l]) => (
              <NativeSelectOption key={v} value={v}>
                {l}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect defaultValue="Europe/Rome" aria-label="Fuso orario impostato">
            {Object.entries(fusi).map(([v, l]) => (
              <NativeSelectOption key={v} value={v}>
                {l}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect defaultValue="asana" aria-label="Con gruppi">
            <NativeSelectOptGroup label="Attività">
              <NativeSelectOption value="asana">Asana</NativeSelectOption>
              <NativeSelectOption value="linear">Linear</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Documenti">
              <NativeSelectOption value="notion">Notion</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
          <NativeSelect defaultValue="Europe/Rome" aria-invalid aria-label="Non valido">
            {Object.entries(fusi).map(([v, l]) => (
              <NativeSelectOption key={v} value={v}>
                {l}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect defaultValue="Europe/Rome" disabled aria-label="Disabilitato">
            {Object.entries(fusi).map(([v, l]) => (
              <NativeSelectOption key={v} value={v}>
                {l}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Row>
            <NativeSelect size="sm" defaultValue="Europe/Rome" className="w-52" aria-label="Piccolo">
              {Object.entries(fusi).map(([v, l]) => (
                <NativeSelectOption key={v} value={v}>
                  {l}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <Label>size=sm (28)</Label>
          </Row>
        </div>
      </Story>

      <Story title="Select (custom popup)" note="trigger = the field shell with ChevronsUpDown · popup = the menu panel, portalled">
        <div className="grid max-w-sm gap-3">
          <Select items={fusi}>
            <SelectTrigger aria-label="Fuso orario">
              <SelectValue placeholder="Scegli un fuso orario…" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fusi).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select items={fusi} defaultValue="Europe/Rome">
            <SelectTrigger aria-label="Fuso orario impostato">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fusi).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select items={connettori} defaultValue="notion">
            <SelectTrigger aria-label="Connettore">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Attività</SelectLabel>
                <SelectItem value="asana">Asana</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Documenti e posta</SelectLabel>
                <SelectItem value="notion">Notion</SelectItem>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="calendar" disabled>
                  Google Calendar
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select items={fusi} defaultValue="Europe/Rome">
            <SelectTrigger aria-invalid aria-label="Non valido">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fusi).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select items={fusi} defaultValue="Europe/Rome" disabled>
            <SelectTrigger aria-label="Disabilitato">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fusi).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Row>
            <Select items={fusi} defaultValue="Europe/Rome">
              <SelectTrigger size="sm" className="w-52" aria-label="Piccolo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(fusi).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>size=sm (28)</Label>
          </Row>
        </div>
      </Story>

      <Story title="Open popup" note="defaultOpen — the menu panel: bg-popover · hairline · rounded-md · shadow-panel · eyebrow group labels · bg-accent highlight">
        <div className="h-64 max-w-sm">
          <Select items={connettori} defaultValue="linear" defaultOpen modal={false}>
            <SelectTrigger aria-label="Connettore aperto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Attività</SelectLabel>
                <SelectItem value="asana">Asana</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Documenti e posta</SelectLabel>
                <SelectItem value="notion">Notion</SelectItem>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="calendar" disabled>
                  Google Calendar
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Story>
    </div>
  );
}
