'use client'

import { PlayCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useMemo } from 'react'
import type { UsePianoReturn } from '@/hooks/use-piano'
import {
  type ChordInversion,
  getAllInversions,
  getInversionName,
} from '@/lib/music/chord-inversions'
import type { ChordRole } from '@/lib/music/chord-theory'
import { createHighlightMap } from '@/lib/music/piano-utils'
import { cn } from '@/lib/utils'
import type { SelectedChord } from './interactive-piano'
import { PianoKeyboard } from './interactive-piano/piano-keyboard'
import { Button } from './ui/button'

interface ChordInversionsProps extends React.ComponentProps<'div'> {
  /**
   * The currently selected chord
   */
  selectedChord: SelectedChord | null
  /**
   * Shared piano audio instance
   */
  piano: UsePianoReturn
  /**
   * Base octave for inversions
   * @default 4
   */
  baseOctave?: number
}

/**
 * Single inversion row with label, compact keyboard, and play buttons
 */
function InversionRow({
  inversion,
  piano,
}: {
  inversion: ChordInversion
  piano: UsePianoReturn
}) {
  const highlightMap = useMemo<Map<string, ChordRole>>(
    () => createHighlightMap(inversion.voicedNotes),
    [inversion.voicedNotes],
  )

  // Determine octave range needed to display this inversion
  const { startOctave, numOctaves } = useMemo(() => {
    if (inversion.voicedNotes.length === 0) {
      return { startOctave: 4, numOctaves: 2 }
    }

    const octaves = inversion.voicedNotes.map((n) => n.octave)
    const minOctave = Math.min(...octaves)
    const maxOctave = Math.max(...octaves)
    // Add 1 octave padding on each side for context
    const start = Math.max(0, minOctave - 1)
    const end = maxOctave + 1
    return { startOctave: start, numOctaves: end - start }
  }, [inversion.voicedNotes])

  const handleKeyPress = (keyId: string) => {
    if (!piano.isEnabled) return
    piano.playNote(keyId)
  }

  const handlePlayChord = () => {
    if (!piano.isEnabled || inversion.voicedNotes.length === 0) return
    piano.playChord(inversion.voicedNotes)
  }

  const handlePlayArpeggio = () => {
    if (!piano.isEnabled || inversion.voicedNotes.length === 0) return
    piano.playArpeggio(inversion.voicedNotes)
  }

  return (
    <div
      data-slot="inversion-row"
      data-inversion-number={inversion.inversionNumber}
      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
    >
      {/* Inversion label */}
      <div className="flex w-full flex-row items-center justify-between gap-2 sm:w-32 sm:flex-col sm:items-start sm:justify-start">
        <div>
          <div data-slot="inversion-name" className="text-sm font-medium">
            {getInversionName(inversion.inversionNumber)} Inversion
          </div>
          <div data-slot="slash-notation" className="text-xs text-muted-foreground">
            {inversion.slashNotation}
          </div>
        </div>

        {/* Play buttons */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePlayChord}
            disabled={!piano.isEnabled}
            className="h-7 px-2"
          >
            <HugeiconsIcon icon={PlayCircleIcon} className="mr-1 size-3" />
            Chord
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePlayArpeggio}
            disabled={!piano.isEnabled}
            className="h-7 px-2"
          >
            Arpeggio
          </Button>
        </div>
      </div>

      {/* Compact keyboard */}
      <div className="flex-1 overflow-x-auto">
        <PianoKeyboard
          highlightMap={highlightMap}
          onKeyPress={handleKeyPress}
          startOctave={startOctave}
          numOctaves={numOctaves}
          size="compact"
        />
      </div>
    </div>
  )
}

/**
 * Displays all inversions of the selected chord with compact, interactive keyboards
 */
function ChordInversions({
  selectedChord,
  piano,
  baseOctave = 4,
  className,
  ...props
}: ChordInversionsProps) {
  const inversions = useMemo<ChordInversion[]>(() => {
    if (!selectedChord) return []
    return getAllInversions(selectedChord.root, selectedChord.type, baseOctave)
  }, [selectedChord, baseOctave])

  if (!selectedChord) {
    return (
      <div
        className={cn('text-center text-muted-foreground', className)}
        {...props}
      >
        Select a chord to view its inversions
      </div>
    )
  }

  if (inversions.length === 0) {
    return (
      <div
        className={cn('text-center text-muted-foreground', className)}
        {...props}
      >
        This chord has no inversions (single note or power chord)
      </div>
    )
  }

  return (
    <div
      data-slot="chord-inversions"
      data-inversion-count={inversions.length}
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      {inversions.map((inversion) => (
        <InversionRow
          key={inversion.inversionNumber}
          inversion={inversion}
          piano={piano}
        />
      ))}
    </div>
  )
}

export { ChordInversions }
export type { ChordInversionsProps }
