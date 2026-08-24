"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* One box per character of a one-time code. The shape people already know from every
 * sign-in screen: type and it advances, backspace and it retreats, paste and the whole code
 * lands at once, the last character submits.
 *
 * Three rules the naive version always gets wrong, so they live here rather than in each
 * consumer:
 *   * PASTE IS NOT TYPING. A paste is matched against the code's own alphabet and fills
 *     every box; a paste that is NOT a code (someone pasted the sign-in LINK, or a raw
 *     token) is handed to `onPasteOther` instead of being silently dropped. A mailer that
 *     sends links instead of codes is common enough that rejecting the paste as
 *     "not numeric" is a dead end, not an edge case.
 *   * THE VALUE IS ONE STRING. Six pieces of state get out of sync; one string cannot.
 *     Each box renders `value[i]`, so clearing on refusal is `onValueChange("")`.
 *   * COMPLETION FIRES ONCE PER FILL. `onComplete` runs on the transition into a full
 *     value, never again on a re-render, so a submit cannot double-fire.
 *
 * The boxes carry no focus ring of their own: the stylesheet's global `:focus-visible`
 * outline is the focus state, exactly as the field shell has it. Invalid paints the
 * hairline and the glyphs destructive — the caller supplies the words. */

const codeBoxVariants = cva(
  "flex-none rounded-md border bg-card text-center font-mono font-medium text-foreground tabular-nums transition-colors duration-[120ms] not-disabled:hover:border-border-strong disabled:cursor-default disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:text-status-critical-ink",
  {
    variants: {
      size: {
        /* The onboarding moment: a 44×52 box at 20px. */
        lg: "h-[52px] w-11 text-xl",
        /* Inline in a card or a settings row. */
        md: "h-[42px] w-9 text-base",
      },
      filled: {
        true: "border-border-strong",
        false: "border-input",
      },
    },
    defaultVariants: { size: "lg", filled: false },
  }
)

type CodeFieldProps = {
  /** How many boxes. Six is the near-universal one-time-code length. */
  length?: number
  value: string
  onValueChange: (value: string) => void
  /** Fired once, on the transition into a full value. */
  onComplete?: (value: string) => void
  /**
   * A paste that does not match the code alphabet — a whole sign-in link, a bare token.
   * Return true when you have taken it somewhere; false leaves the field untouched.
   */
  onPasteOther?: (text: string) => boolean
  /** Which characters count. Digits by default. */
  pattern?: RegExp
  invalid?: boolean
  disabled?: boolean
  autoFocus?: boolean
  /** Accessible name for the group of boxes. Required: no English lives in this file. */
  label: string
  /** Accessible name for one box, given its 0-based index and the length. */
  boxLabel?: (index: number, length: number) => string
  className?: string
} & VariantProps<typeof codeBoxVariants>

function CodeField({
  length = 6,
  value,
  onValueChange,
  onComplete,
  onPasteOther,
  pattern = /\d/,
  invalid = false,
  disabled = false,
  autoFocus = false,
  label,
  boxLabel = (index, total) => `${index + 1}/${total}`,
  size = "lg",
  className,
}: CodeFieldProps) {
  const group = React.useRef<HTMLDivElement | null>(null)
  const boxes = React.useRef<Array<HTMLInputElement | null>>([])
  const wasComplete = React.useRef(value.length >= length)
  const wasFilled = React.useRef(value.length > 0)

  React.useEffect(() => {
    const complete = value.length >= length
    if (complete && !wasComplete.current) onComplete?.(value.slice(0, length))
    wasComplete.current = complete
  }, [value, length, onComplete])

  React.useEffect(() => {
    /* THE CALLER CLEARING THE FIELD MEANS "START AGAIN". A refused code is
     * the case that matters: the boxes empty themselves, and leaving the
     * caret parked on the last box someone typed into makes retyping a
     * hunt for the first one. Only when focus is already inside the group —
     * clearing a field nobody is looking at must never steal focus. */
    const filled = value.length > 0
    if (
      !filled &&
      wasFilled.current &&
      typeof document !== "undefined" &&
      group.current?.contains(document.activeElement)
    ) {
      boxes.current[0]?.focus()
    }
    wasFilled.current = filled
  }, [value])

  const focusBox = (index: number) => {
    const box = boxes.current[Math.max(0, Math.min(length - 1, index))]
    box?.focus()
    box?.select()
  }

  const keep = (raw: string) =>
    Array.from(raw)
      .filter((character) => pattern.test(character))
      .join("")

  const setAt = (index: number, raw: string) => {
    const kept = keep(raw)
    if (kept === "") return
    /* Typing into a box overwrites from there, so a correction mid-code behaves. */
    const next = (value.slice(0, index) + kept + value.slice(index + kept.length)).slice(
      0,
      length
    )
    onValueChange(next)
    focusBox(index + kept.length)
  }

  const onKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault()
      if (value[index]) {
        onValueChange(value.slice(0, index) + value.slice(index + 1))
        return
      }
      /* An empty box: step back and take that character with it. */
      onValueChange(value.slice(0, Math.max(0, index - 1)) + value.slice(index))
      focusBox(index - 1)
      return
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      focusBox(index - 1)
      return
    }
    if (event.key === "ArrowRight") {
      event.preventDefault()
      focusBox(index + 1)
    }
  }

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text").trim()
    if (text === "") return
    event.preventDefault()
    const kept = keep(text)
    /* A paste is the code only when it is ENTIRELY the code's alphabet and long enough —
     * otherwise the digits inside a URL would masquerade as one. */
    if (kept.length === text.length && kept.length >= length) {
      onValueChange(kept.slice(0, length))
      focusBox(length - 1)
      return
    }
    if (onPasteOther?.(text)) return
    /* Nothing claimed it: take whatever characters it did carry rather than dropping the
     * paste on the floor. */
    if (kept !== "") {
      onValueChange(kept.slice(0, length))
      focusBox(Math.min(kept.length, length - 1))
    }
  }

  return (
    <div
      ref={group}
      data-slot="code-field"
      role="group"
      aria-label={label}
      aria-invalid={invalid || undefined}
      className={cn("flex gap-2", className)}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            boxes.current[index] = element
          }}
          data-slot="code-field-box"
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoCorrect="off"
          spellCheck={false}
          /* maxLength 1 keeps the box a single glyph; the paste handler runs first. */
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={boxLabel(index, length)}
          aria-invalid={invalid || undefined}
          value={value[index] ?? ""}
          className={cn(
            codeBoxVariants({ size, filled: Boolean(value[index]) }),
            "focus-visible:border-foreground"
          )}
          onChange={(event) => setAt(index, event.target.value)}
          onKeyDown={onKeyDown(index)}
          onPaste={onPaste}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  )
}

export { CodeField, codeBoxVariants }
