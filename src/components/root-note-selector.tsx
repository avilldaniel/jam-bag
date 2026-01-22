import type { VariantProps } from "class-variance-authority"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * All 12 chromatic notes with sharps only
 */
const CHROMATIC_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const

type Note = (typeof CHROMATIC_NOTES)[number]

/**
 * Natural notes (white keys on piano)
 */
const NATURAL_NOTES = new Set(["C", "D", "E", "F", "G", "A", "B"])

/**
 * Check if a note is natural (not an accidental)
 */
function isNaturalNote(note: Note): boolean {
  return NATURAL_NOTES.has(note)
}

const rootNoteSelectorVariants = cva(
  "flex flex-wrap items-center gap-1",
  {
    variants: {
      size: {
        default: "gap-1",
        compact: "gap-0.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const noteButtonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1 inline-flex items-center justify-center font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 shrink-0 border",
  {
    variants: {
      noteType: {
        natural:
          "border-border bg-background hover:bg-muted hover:text-foreground text-foreground data-[pressed]:bg-primary data-[pressed]:text-primary-foreground data-[pressed]:border-primary",
        accidental:
          "border-border bg-muted/50 hover:bg-muted hover:text-foreground text-muted-foreground data-[pressed]:bg-primary data-[pressed]:text-primary-foreground data-[pressed]:border-primary",
      },
      size: {
        default: "h-9 min-w-9 px-2 text-sm",
        compact: "h-8 min-w-8 px-1.5 text-xs",
      },
    },
    defaultVariants: {
      noteType: "natural",
      size: "compact",
    },
  }
)

interface RootNoteSelectorProps
  extends VariantProps<typeof rootNoteSelectorVariants> {
  /**
   * The currently selected note
   */
  value?: Note
  /**
   * Callback fired when the selected note changes
   */
  onValueChange?: (note: Note) => void
  /**
   * Whether the selector is disabled
   * @default false
   */
  disabled?: boolean
  /**
   * Additional class name for the container
   */
  className?: string
  /**
   * Size variant for the buttons
   * @default "compact"
   */
  buttonSize?: "default" | "compact"
}

/**
 * A selector component for choosing a root note from the 12 chromatic notes.
 * Natural notes have a subtle visual distinction from accidentals (sharps).
 *
 * @example
 * ```tsx
 * const [rootNote, setRootNote] = useState<Note>("C")
 *
 * <RootNoteSelector
 *   value={rootNote}
 *   onValueChange={setRootNote}
 * />
 * ```
 */
function RootNoteSelector({
  value = "C",
  onValueChange,
  disabled = false,
  className,
  size = "default",
  buttonSize = "compact",
}: RootNoteSelectorProps) {
  // Convert single value to array for ToggleGroup (which expects array for controlled mode)
  const groupValue = value ? [value] : []

  const handleValueChange = (newValue: readonly string[]) => {
    // ToggleGroup passes array, we only want the latest selection
    // When clicking the same item, newValue will be empty (deselected)
    // We want to keep the current value in that case (always have one selected)
    if (newValue.length > 0 && onValueChange) {
      // Get the newly selected value (the one that wasn't selected before)
      const newNote = newValue.find((v) => v !== value) ?? newValue[0]
      onValueChange(newNote as Note)
    }
  }

  return (
    <ToggleGroupPrimitive
      data-slot="root-note-selector"
      value={groupValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      orientation="horizontal"
      loopFocus
      aria-label="Select root note"
      className={cn(rootNoteSelectorVariants({ size }), className)}
    >
      {CHROMATIC_NOTES.map((note) => {
        const isNatural = isNaturalNote(note)
        return (
          <TogglePrimitive
            key={note}
            data-slot="root-note-button"
            value={note}
            aria-label={`Select ${note} as root note`}
            className={cn(
              noteButtonVariants({
                noteType: isNatural ? "natural" : "accidental",
                size: buttonSize,
              })
            )}
          >
            {note}
          </TogglePrimitive>
        )
      })}
    </ToggleGroupPrimitive>
  )
}

export { RootNoteSelector, CHROMATIC_NOTES, isNaturalNote }
export type { RootNoteSelectorProps, Note }
