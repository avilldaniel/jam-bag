'use client'

import { useMemo, useState } from 'react'
import type { ChordType } from '@/components/chord-selector'
import type { Note } from '@/components/root-note-selector'
import { usePiano } from '@/hooks/use-piano'
import type { ChordRole } from '@/lib/music/chord-theory'
import { getChordNotes } from '@/lib/music/chord-theory'
import type { VoicedNote } from '@/lib/music/piano-utils'
import { createHighlightMap, voiceChord } from '@/lib/music/piano-utils'
import { cn } from '@/lib/utils'
import { PianoControls } from './piano-controls'
import type { FingerNumber } from './piano-key'
import { PianoKeyboard } from './piano-keyboard'

/**
 * Selected chord structure
 */
interface SelectedChord {
  root: Note
  type: ChordType
}

/**
 * Generate basic fingering for a chord
 * This is a simplified fingering suggestion - real fingering depends on context
 */
function generateBasicFingering(
  voicedNotes: VoicedNote[],
  hand: 'left' | 'right',
): Map<string, FingerNumber> {
  const fingeringMap = new Map<string, FingerNumber>()

  if (voicedNotes.length === 0) return fingeringMap

  // Sort notes by pitch
  const sortedNotes = [...voicedNotes].sort(
    (a, b) => a.midiNumber - b.midiNumber,
  )

  // Simple fingering patterns based on chord size
  const rightHandPatterns: Record<number, FingerNumber[]> = {
    2: [1, 3],
    3: [1, 3, 5],
    4: [1, 2, 3, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 5], // repeat last finger for extended chords
  }

  const leftHandPatterns: Record<number, FingerNumber[]> = {
    2: [5, 3],
    3: [5, 3, 1],
    4: [5, 4, 2, 1],
    5: [5, 4, 3, 2, 1],
    6: [5, 5, 4, 3, 2, 1],
  }

  const patterns = hand === 'right' ? rightHandPatterns : leftHandPatterns
  const pattern = patterns[Math.min(sortedNotes.length, 6)] ?? patterns[3]

  sortedNotes.forEach((note, index) => {
    const keyId = `${note.note}${note.octave}`
    const fingerIndex = Math.min(index, pattern.length - 1)
    fingeringMap.set(keyId, pattern[fingerIndex])
  })

  return fingeringMap
}

interface InteractivePianoProps extends React.ComponentProps<'div'> {
  /**
   * The currently selected chord (root note and chord type)
   * Pass null when no chord is selected
   */
  selectedChord: SelectedChord | null
  /**
   * Base octave for chord voicing
   * @default 4
   */
  baseOctave?: number
}

/**
 * Main orchestrator component for the interactive piano.
 * Combines the keyboard display with playback controls and chord highlighting.
 *
 * @example
 * ```tsx
 * const [chord, setChord] = useState<{ root: Note, type: ChordType } | null>({
 *   root: 'C',
 *   type: 'maj7',
 * })
 *
 * <InteractivePiano selectedChord={chord} />
 * ```
 */
function InteractivePiano({
  selectedChord,
  baseOctave = 4,
  className,
  ...props
}: InteractivePianoProps) {
  const [showFingering, setShowFingering] = useState(false)
  const [hand, setHand] = useState<'left' | 'right'>('right')

  const piano = usePiano()

  // Derive chord notes and voicing from selected chord
  const voicedNotes = useMemo<VoicedNote[]>(() => {
    if (!selectedChord) return []

    const chordNotes = getChordNotes(selectedChord.root, selectedChord.type)
    return voiceChord(chordNotes, baseOctave)
  }, [selectedChord, baseOctave])

  // Create highlight map for the keyboard
  const highlightMap = useMemo<Map<string, ChordRole>>(
    () => createHighlightMap(voicedNotes),
    [voicedNotes],
  )

  // Generate fingering suggestions
  const fingeringMap = useMemo<Map<string, FingerNumber>>(
    () => generateBasicFingering(voicedNotes, hand),
    [voicedNotes, hand],
  )

  // Handle playing a single key
  const handleKeyPress = (keyId: string) => {
    if (!piano.isEnabled) return
    piano.playNote(keyId)
  }

  // Handle playing the chord
  const handlePlayChord = () => {
    if (!piano.isEnabled || voicedNotes.length === 0) return
    piano.playChord(voicedNotes)
  }

  // Handle playing the arpeggio
  const handlePlayArpeggio = () => {
    if (!piano.isEnabled || voicedNotes.length === 0) return
    piano.playArpeggio(voicedNotes)
  }

  return (
    <div
      data-slot="interactive-piano"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      <PianoControls
        isEnabled={piano.isEnabled}
        isLoading={piano.isLoading}
        volume={piano.volume}
        onChangeVolume={piano.setVolume}
        onEnableAudio={piano.toggle}
        onPlayChord={handlePlayChord}
        onPlayArpeggio={handlePlayArpeggio}
        hasChord={voicedNotes.length > 0}
        hand={hand}
        onHandChange={setHand}
        showFingering={showFingering}
        onShowFingeringChange={setShowFingering}
      />

      <PianoKeyboard
        highlightMap={highlightMap}
        onKeyPress={handleKeyPress}
        showFingering={showFingering}
        fingeringMap={fingeringMap}
        hand={hand}
      />

      {/* Chord info display */}
      {selectedChord && (
        <div data-slot="chord-info" className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {selectedChord.root}
            {selectedChord.type}
          </span>
          {' - '}
          {voicedNotes.length} notes
          {voicedNotes.length > 0 && (
            <span className="ml-2 text-xs">
              ({voicedNotes.map((n) => `${n.note}${n.octave}`).join(', ')})
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { InteractivePiano }
export type { InteractivePianoProps, SelectedChord }
