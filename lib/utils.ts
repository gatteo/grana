import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/* Grana's theme adds font sizes Tailwind's default scale lacks (`text-2xs` 10.5px, `text-13`
 * 13px, `text-metric`). tailwind-merge cannot tell a custom size from a colour and would drop
 * `text-13` whenever a `text-<colour>` follows it — so the merger is taught the names here.
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
