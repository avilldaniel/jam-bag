'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { HighlightedKey } from '@/lib/music/piano-utils'
import { cn } from '@/lib/utils'
import { FingeringOverlay } from './fingering-overlay'

/**
 * Piano key CVA variants for styling based on key type and chord role
 */
const pianoKeyVariants = cva(
  'relative flex items-end justify-center font-medium transition-all select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 outline-none',
  {
    variants: {
      keyType: {
        white:
          'bg-background border border-border hover:bg-muted/50 active:bg-muted text-foreground',
        black:
          'bg-foreground hover:bg-foreground/80 active:bg-foreground/60 text-background z-10',
      },
      size: {
        default: '',
        compact: '',
      },
      role: {
        none: '',
        root: '',
        third: '',
        fifth: '',
        seventh: '',
        extension: '',
      },
    },
    compoundVariants: [
      // Size variants for white keys
      {
        keyType: 'white',
        size: 'default',
        className: 'h-32 w-10 text-xs pb-2',
      },
      {
        keyType: 'white',
        size: 'compact',
        className: 'h-20 w-7 text-[10px] pb-1',
      },
      // Size variants for black keys
      {
        keyType: 'black',
        size: 'default',
        className: 'h-20 w-6 text-[10px] pb-1.5',
      },
      {
        keyType: 'black',
        size: 'compact',
        className: 'h-12 w-[18px] text-[8px] pb-1',
      },
      // White key role highlights
      {
        keyType: 'white',
        role: 'root',
        className:
          'bg-[oklch(0.65_0.18_250)] hover:bg-[oklch(0.60_0.18_250)] active:bg-[oklch(0.55_0.18_250)] text-white border-[oklch(0.55_0.18_250)]',
      },
      {
        keyType: 'white',
        role: 'third',
        className:
          'bg-[oklch(0.7_0.2_145)] hover:bg-[oklch(0.65_0.2_145)] active:bg-[oklch(0.60_0.2_145)] text-white border-[oklch(0.60_0.2_145)]',
      },
      {
        keyType: 'white',
        role: 'fifth',
        className:
          'bg-[oklch(0.8_0.18_90)] hover:bg-[oklch(0.75_0.18_90)] active:bg-[oklch(0.70_0.18_90)] text-foreground border-[oklch(0.70_0.18_90)]',
      },
      {
        keyType: 'white',
        role: 'seventh',
        className:
          'bg-[oklch(0.65_0.22_300)] hover:bg-[oklch(0.60_0.22_300)] active:bg-[oklch(0.55_0.22_300)] text-white border-[oklch(0.55_0.22_300)]',
      },
      {
        keyType: 'white',
        role: 'extension',
        className:
          'bg-[oklch(0.75_0.18_350)] hover:bg-[oklch(0.70_0.18_350)] active:bg-[oklch(0.65_0.18_350)] text-white border-[oklch(0.65_0.18_350)]',
      },
      // Black key role highlights
      {
        keyType: 'black',
        role: 'root',
        className:
          'bg-[oklch(0.55_0.18_250)] hover:bg-[oklch(0.50_0.18_250)] active:bg-[oklch(0.45_0.18_250)]',
      },
      {
        keyType: 'black',
        role: 'third',
        className:
          'bg-[oklch(0.60_0.2_145)] hover:bg-[oklch(0.55_0.2_145)] active:bg-[oklch(0.50_0.2_145)]',
      },
      {
        keyType: 'black',
        role: 'fifth',
        className:
          'bg-[oklch(0.70_0.18_90)] hover:bg-[oklch(0.65_0.18_90)] active:bg-[oklch(0.60_0.18_90)] text-foreground',
      },
      {
        keyType: 'black',
        role: 'seventh',
        className:
          'bg-[oklch(0.55_0.22_300)] hover:bg-[oklch(0.50_0.22_300)] active:bg-[oklch(0.45_0.22_300)]',
      },
      {
        keyType: 'black',
        role: 'extension',
        className:
          'bg-[oklch(0.65_0.18_350)] hover:bg-[oklch(0.60_0.18_350)] active:bg-[oklch(0.55_0.18_350)]',
      },
    ],
    defaultVariants: {
      keyType: 'white',
      role: 'none',
      size: 'default',
    },
  },
)

type FingerNumber = 1 | 2 | 3 | 4 | 5

type PianoKeySize = 'default' | 'compact'

interface PianoKeyProps
  extends Omit<React.ComponentProps<'button'>, 'role'>,
    Omit<VariantProps<typeof pianoKeyVariants>, 'keyType' | 'role' | 'size'> {
  /**
   * The highlighted key data including note, octave, and role
   */
  keyData: HighlightedKey
  /**
   * Callback fired when the key is pressed
   */
  onPress: (keyId: string) => void
  /**
   * Optional finger number for fingering display (1-5)
   */
  fingerNumber?: FingerNumber
  /**
   * Whether to show the fingering overlay
   * @default false
   */
  showFingering?: boolean
  /**
   * Which hand is being used (for fingering color)
   * @default 'right'
   */
  hand?: 'left' | 'right'
  /**
   * Size variant for the key
   * @default 'default'
   */
  size?: PianoKeySize
}

/**
 * A single piano key component with chord role highlighting.
 * Supports both white and black keys with appropriate styling.
 *
 * @example
 * ```tsx
 * <PianoKey
 *   keyData={{ note: 'C', octave: 4, isBlack: false, midiNumber: 60, keyId: 'C4', role: 'root' }}
 *   onPress={(keyId) => console.log('Pressed:', keyId)}
 *   fingerNumber={1}
 *   showFingering
 *   hand="right"
 * />
 * ```
 */
function PianoKey({
  keyData,
  onPress,
  fingerNumber,
  showFingering = false,
  hand = 'right',
  size = 'default',
  className,
  ...props
}: PianoKeyProps) {
  const handleClick = () => {
    onPress(keyData.keyId)
  }

  const keyType = keyData.isBlack ? 'black' : 'white'
  const role = keyData.role ?? 'none'

  return (
    <button
      type="button"
      data-slot="piano-key"
      data-key-type={keyType}
      data-role={role}
      data-key-id={keyData.keyId}
      aria-label={`Piano key ${keyData.note}${keyData.octave}`}
      onClick={handleClick}
      className={cn(pianoKeyVariants({ keyType, role, size }), className)}
      {...props}
    >
      <span className="pointer-events-none">
        {keyData.note}
        {!keyData.isBlack && (
          <span className="text-[10px] opacity-60">{keyData.octave}</span>
        )}
      </span>
      {showFingering && fingerNumber && (
        <FingeringOverlay fingerNumber={fingerNumber} hand={hand} />
      )}
    </button>
  )
}

export { PianoKey, pianoKeyVariants }
export type { PianoKeyProps, FingerNumber, PianoKeySize }
