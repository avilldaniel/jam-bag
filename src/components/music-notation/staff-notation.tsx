'use client'

import { useEffect, useRef } from 'react'
import type { ChordType } from '@/components/chord-selector'
import type { Note } from '@/components/root-note-selector'
import { useTheme } from '@/components/theme-provider'
import { useVexFlow } from '@/hooks/use-vexflow'
import { getChordNotes } from '@/lib/music/chord-theory'
import { voiceChord } from '@/lib/music/piano-utils'
import { cn } from '@/lib/utils'

interface StaffNotationProps {
  /**
   * The chord to display on the staff
   * Pass null to show an empty staff with placeholder text
   */
  chord: { root: Note; type: ChordType } | null
  /**
   * Additional class name for the container
   */
  className?: string
}

/**
 * Grand staff notation component for displaying chords.
 * Uses VexFlow to render music notation with treble and bass clefs.
 *
 * @example
 * ```tsx
 * <StaffNotation
 *   chord={{ root: 'C', type: 'maj7' }}
 *   className="w-full"
 * />
 * ```
 */
function StaffNotation({ chord, className }: StaffNotationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const notationColor = resolvedTheme === 'dark' ? '#ffffff' : '#000000'

  const { isReady, renderChord, clear } = useVexFlow({
    containerRef,
    width: 280,
    height: 200,
    color: notationColor,
  })

  useEffect(() => {
    if (!isReady) return

    if (!chord) {
      clear()
      return
    }

    // Get chord notes and voice them
    const chordNotes = getChordNotes(chord.root, chord.type)
    const voicedNotes = voiceChord(chordNotes, 4) // Start at octave 4

    renderChord(voicedNotes)
  }, [chord, isReady, renderChord, clear])

  return (
    <div
      data-slot="staff-notation"
      className={cn('relative min-h-36 bg-card', className)}
    >
      <div
        ref={containerRef}
        className="flex items-center justify-center h-24"
      />
      {!chord && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          Select a chord to see notation
        </div>
      )}
    </div>
  )
}

export { StaffNotation }
export type { StaffNotationProps }
