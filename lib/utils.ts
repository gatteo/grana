import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/* Grana’s theme adds three font sizes Tailwind’s default scale lacks (2xs = 10.5px, 13 = 13px,
 * and the metric size). tailwind-merge cannot tell a custom size from a colour and would drop the
 * size whenever a text colour follows it — so the merger is taught the names here.
 * Installed into consumers as `@grana/utils` (the theme item depends on it). */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["2xs", "13", "metric"] }],
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
