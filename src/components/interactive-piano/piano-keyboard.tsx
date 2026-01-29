'use client'

import { useMemo } from 'react'
import type { ChordRole } from '@/lib/music/chord-theory'
import type { HighlightedKey } from '@/lib/music/piano-utils'
import { generatePianoKeys, getHighlightedKeys } from '@/lib/music/piano-utils'
import { cn } from '@/lib/utils'
import { type FingerNumber, PianoKey, type PianoKeySize } from './piano-key'

interface PianoKeyboardProps
  extends Omit<React.ComponentProps<'div'>, 'onKeyPress'> {
  /**
   * Map of keyId to chord role for highlighting
   */
  highlightMap?: Map<string, ChordRole>
  /**
   * Callback fired when a key is pressed
   */
  onKeyPress?: (keyId: string) => void
  /**
   * Whether to show fingering overlays
   * @default false
   */
  showFingering?: boolean
  /**
   * Map of keyId to finger number for fingering display
   */
  fingeringMap?: Map<string, FingerNumber>
  /**
   * Which hand is being used
   * @default 'right'
   */
  hand?: 'left' | 'right'
  /**
   * Starting octave for the keyboard
   * @default 3
   */
  startOctave?: number
  /**
   * Number of octaves to display
   * @default 3
   */
  numOctaves?: number
  /**
   * Size variant for the keys
   * @default 'default'
   */
  size?: PianoKeySize
}

/**
 * A 3-octave piano keyboard layout (C3-C6 by default).
 * Renders white keys in a row with black keys positioned absolutely between them.
 *
 * @example
 * ```tsx
 * const highlightMap = new Map([['C4', 'root'], ['E4', 'third'], ['G4', 'fifth']])
 *
 * <PianoKeyboard
 *   highlightMap={highlightMap}
 *   onKeyPress={(keyId) => console.log('Pressed:', keyId)}
 *   showFingering
 *   fingeringMap={new Map([['C4', 1], ['E4', 2], ['G4', 3]])}
 * />
 * ```
 */
function PianoKeyboard({
  highlightMap = new Map(),
  onKeyPress,
  showFingering = false,
  fingeringMap = new Map(),
  hand = 'right',
  startOctave = 3,
  numOctaves = 3,
  size = 'default',
  className,
  ...props
}: PianoKeyboardProps) {
  // Generate piano keys
  const pianoKeys = useMemo(
    () => generatePianoKeys(startOctave, numOctaves),
    [startOctave, numOctaves],
  )

  // Get highlighted keys with roles
  const highlightedKeys: HighlightedKey[] = useMemo(
    () => getHighlightedKeys(pianoKeys, highlightMap),
    [pianoKeys, highlightMap],
  )

  // Separate white and black keys
  const whiteKeys = useMemo(
    () => highlightedKeys.filter((key) => !key.isBlack),
    [highlightedKeys],
  )

  const blackKeys = useMemo(
    () => highlightedKeys.filter((key) => key.isBlack),
    [highlightedKeys],
  )

  const handleKeyPress = (keyId: string) => {
    onKeyPress?.(keyId)
  }

  // Key dimensions based on size
  const keyDimensions = {
    default: { whiteWidth: 40, blackWidth: 24 },
    compact: { whiteWidth: 28, blackWidth: 18 },
  }

  const { whiteWidth, blackWidth } = keyDimensions[size]

  // Calculate black key position based on which white key it follows
  const getBlackKeyStyle = (key: HighlightedKey): React.CSSProperties => {
    // Find the index of the white key that this black key follows
    const whiteKeyIndex = whiteKeys.findIndex(
      (wk) => wk.note === key.note.replace('#', '') && wk.octave === key.octave,
    )

    if (whiteKeyIndex === -1) return {}

    // Position the black key between white keys
    // Center the black key on the gap between white keys
    const leftOffset = (whiteKeyIndex + 1) * whiteWidth - blackWidth / 2

    return {
      position: 'absolute' as const,
      left: `${leftOffset}px`,
      top: 0,
    }
  }

  return (
    <div
      data-slot="piano-keyboard"
      className={cn(
        'scrollbar-visible relative inline-flex overflow-x-auto rounded-sm border border-border bg-muted/30 p-2',
        className,
      )}
      {...props}
    >
      {/* White keys container */}
      <div className="mx-auto relative flex" data-slot="white-keys">
        {whiteKeys.map((key) => (
          <PianoKey
            key={key.keyId}
            keyData={key}
            onPress={handleKeyPress}
            showFingering={showFingering}
            fingerNumber={fingeringMap.get(key.keyId)}
            hand={hand}
            size={size}
          />
        ))}

        {/* Black keys overlay */}
        {blackKeys.map((key) => (
          <PianoKey
            key={key.keyId}
            keyData={key}
            onPress={handleKeyPress}
            showFingering={showFingering}
            fingerNumber={fingeringMap.get(key.keyId)}
            hand={hand}
            size={size}
            style={getBlackKeyStyle(key)}
          />
        ))}
      </div>
    </div>
  )
}

export { PianoKeyboard }
export type { PianoKeyboardProps }
