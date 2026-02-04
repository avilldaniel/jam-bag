import { cva, type VariantProps } from 'class-variance-authority'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { Note } from './root-note-selector'

/**
 * Chord categories with their chord types
 */
const CHORD_CATEGORIES = {
  Major: ['maj', 'maj7', 'maj9', 'maj11', 'maj13', '6', 'add9', '6/9'],
  Minor: ['m', 'm7', 'm9', 'm11', 'm6', 'm(maj7)', 'm(maj9)', 'm add9'],
  Dominant: ['7', '9', '11', '13', '7#9', '7b9', '7#5', '7b5', '9#11', '13#11'],
  'Dim/Aug': ['dim', 'dim7', 'm7b5', 'aug', 'aug7'],
  'Sus/Power': ['sus2', 'sus4', '7sus4', '9sus4', '5'],
} as const

type ChordCategory = keyof typeof CHORD_CATEGORIES
type ChordType = (typeof CHORD_CATEGORIES)[ChordCategory][number]

/**
 * Display labels for chord types (some need special formatting)
 */
const CHORD_DISPLAY_LABELS: Partial<Record<ChordType, string>> = {
  m7b5: 'm7b5',
  'm(maj7)': 'm(maj7)',
  'm(maj9)': 'm(maj9)',
  'm add9': 'm add9',
  '6/9': '6/9',
  '7#9': '7#9',
  '7b9': '7b9',
  '7#5': '7#5',
  '7b5': '7b5',
  '9#11': '9#11',
  '13#11': '13#11',
}

/**
 * Get the display label for a chord type
 */
function getChordDisplayLabel(chordType: ChordType): string {
  return CHORD_DISPLAY_LABELS[chordType] ?? chordType
}

/**
 * Format a full chord name with root note and chord type
 */
function formatChordName(rootNote: Note, chordType: ChordType): string {
  return `${rootNote}${chordType}`
}

const chordSelectorVariants = cva('flex flex-col gap-3', {
  variants: {
    size: {
      default: 'gap-3',
      compact: 'gap-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const chordButtonVariants = cva(
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1 inline-flex items-center justify-center font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 shrink-0 border text-xs',
  {
    variants: {
      selected: {
        true: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
        false:
          'border-border bg-background hover:bg-muted hover:text-foreground text-foreground',
      },
      size: {
        default: 'h-8 min-w-14 px-2',
        compact: 'h-7 min-w-12 px-1.5',
      },
    },
    defaultVariants: {
      selected: false,
      size: 'default',
    },
  },
)

const chordGridVariants = cva('grid gap-1.5', {
  variants: {
    columns: {
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      auto: 'grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))]',
    },
  },
  defaultVariants: {
    columns: 'auto',
  },
})

interface ChordSelectorProps
  extends VariantProps<typeof chordSelectorVariants> {
  /**
   * The root note to construct full chord names
   */
  rootNote: Note
  /**
   * The currently selected chord category (tab)
   */
  category: ChordCategory
  /**
   * Callback fired when category changes
   */
  onCategoryChange: (category: ChordCategory) => void
  /**
   * The currently selected chord type (or null if none selected)
   */
  selectedChord: ChordType | null
  /**
   * Callback fired when chord selection changes
   */
  onChordChange: (chord: ChordType | null) => void
  /**
   * Additional class name for the container
   */
  className?: string
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean
  /**
   * Number of columns in the chord grid
   * @default "auto"
   */
  gridColumns?: 4 | 5 | 6 | 'auto'
}

/**
 * A single-select chord selector component with tabbed categories.
 * Displays chords with the provided root note and allows selecting one chord type.
 *
 * @example
 * ```tsx
 * const [selection, setSelection] = useState({
 *   rootNote: "C" as Note,
 *   category: "Major" as ChordCategory,
 *   chord: "maj7" as ChordType | null,
 * })
 *
 * <ChordSelector
 *   rootNote={selection.rootNote}
 *   category={selection.category}
 *   onCategoryChange={(category) => setSelection(prev => ({ ...prev, category }))}
 *   selectedChord={selection.chord}
 *   onChordChange={(chord) => setSelection(prev => ({ ...prev, chord }))}
 * />
 * ```
 */
function ChordSelector({
  rootNote,
  category,
  onCategoryChange,
  selectedChord,
  onChordChange,
  className,
  size = 'default',
  disabled = false,
  gridColumns = 'auto',
}: ChordSelectorProps) {
  const handleChordClick = (chordType: ChordType) => {
    if (disabled) return

    // Toggle off if clicking the same chord, otherwise select the new one
    if (selectedChord === chordType) {
      onChordChange(null)
    } else {
      onChordChange(chordType)
    }
  }

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value as ChordCategory)
  }

  const categories = Object.keys(CHORD_CATEGORIES) as ChordCategory[]

  return (
    <div
      data-slot="chord-selector"
      className={cn(chordSelectorVariants({ size }), className)}
    >
      <Tabs value={category} onValueChange={handleCategoryChange} size="sm">
        <TabsList className="flex-wrap h-auto gap-0">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className={cat === category ? `bg-muted/50` : ``}
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => {
          const chordTypes = CHORD_CATEGORIES[cat]
          return (
            <TabsContent key={cat} value={cat}>
              <div
                data-slot="chord-grid"
                className={cn(chordGridVariants({ columns: gridColumns }))}
                role="radiogroup"
                aria-label={`${cat} chord types`}
              >
                {chordTypes.map((chordType) => {
                  const isSelected = selectedChord === chordType
                  const fullChordName = formatChordName(rootNote, chordType)
                  const displayLabel = getChordDisplayLabel(chordType)

                  return (
                    <button
                      key={chordType}
                      type="button"
                      role="radio"
                      data-slot="chord-button"
                      disabled={disabled}
                      aria-checked={isSelected}
                      aria-label={`Select ${fullChordName}`}
                      onClick={() => handleChordClick(chordType)}
                      className={cn(
                        chordButtonVariants({
                          selected: isSelected,
                          size: size === 'compact' ? 'compact' : 'default',
                        }),
                      )}
                    >
                      {rootNote}
                      {displayLabel}
                    </button>
                  )
                })}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

export {
  ChordSelector,
  CHORD_CATEGORIES,
  formatChordName,
  getChordDisplayLabel,
  chordSelectorVariants,
  chordButtonVariants,
  chordGridVariants,
}
export type { ChordSelectorProps, ChordCategory, ChordType }
