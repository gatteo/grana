import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/* Grana’s theme adds font sizes Tailwind’s default scale lacks — 2xs (10.5px), 13 (13px), the
 * metric, and the marketing register's four fluid steps. tailwind-merge cannot tell a custom size
 * from a colour and would drop the size whenever a text colour follows it — so the merger is
 * taught the names here. Same for the field geometry: `max-w-measure|head|lead|text` and the
 * `rounded-img` role, which are theme keys, not arbitrary values.
 * Installed into consumers as `@grana/utils` (the theme item depends on it). */
/* The spacing scale Grana adds on top of Tailwind's numeric one. */
const FIELD = ["gutter", "section", "frame", "sidebar", "sidebar-pad", "shell-gap"]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["2xs", "13", "metric", "display", "h2", "h3", "lead"] }],
      "max-w": [{ "max-w": ["measure", "head", "lead", "text"] }],
      rounded: [{ rounded: ["img"] }],
      /* The field geometry is spacing, not an arbitrary value — without these a component's own
       * `py-section` and a caller's `py-[clamp(…)]` both survive the merge and stylesheet order
       * decides, which is never what the caller meant. */
      p: [{ p: FIELD }],
      px: [{ px: FIELD }],
      py: [{ py: FIELD }],
      pt: [{ pt: FIELD }],
      pr: [{ pr: FIELD }],
      pb: [{ pb: FIELD }],
      pl: [{ pl: FIELD }],
      m: [{ m: FIELD }],
      mx: [{ mx: FIELD }],
      my: [{ my: FIELD }],
      mt: [{ mt: FIELD }],
      mb: [{ mb: FIELD }],
      gap: [{ gap: FIELD }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* Initials for an avatar tile: the first letters of the first two words, upper-cased. Lives here
 * (not in avatar.tsx) so server modules can call it without crossing a "use client" boundary. */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
}
