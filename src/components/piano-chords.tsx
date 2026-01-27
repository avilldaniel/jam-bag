'use client'

import { useState } from 'react'
import {
  type ChordCategory,
  ChordSelector,
  type ChordType,
} from '@/components/chord-selector'
import { InteractivePiano } from '@/components/interactive-piano'
import { StaffNotation } from '@/components/music-notation'
import { type Note, RootNoteSelector } from '@/components/root-note-selector'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ChordSelection {
  rootNote: Note
  category: ChordCategory
  chord: ChordType | null
}

export function PianoChords() {
  const [selection, setSelection] = useState<ChordSelection>({
    rootNote: 'C',
    category: 'Major',
    chord: 'maj7',
  })

  // Derive the selected chord for InteractivePiano
  const selectedChord = selection.chord
    ? { root: selection.rootNote, type: selection.chord }
    : null

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-background p-4">
      {/* Top row: Chord Selector + Notation */}
      <div className="flex w-full max-w-5xl items-start justify-center gap-4 max-lg:flex-col max-lg:items-center">
        {/* Chord Selector Card */}
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Chord Selector</CardTitle>
            <CardDescription>
              Select a root note and choose a chord type
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Root Note</span>
              <RootNoteSelector
                value={selection.rootNote}
                onValueChange={(rootNote) =>
                  setSelection((prev) => ({ ...prev, rootNote }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Chord Type</span>
              <ChordSelector
                rootNote={selection.rootNote}
                category={selection.category}
                onCategoryChange={(category) =>
                  setSelection((prev) => ({ ...prev, category }))
                }
                selectedChord={selection.chord}
                onChordChange={(chord) =>
                  setSelection((prev) => ({ ...prev, chord }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notation Card */}
        <Card className="w-full max-w-md flex-1">
          <CardHeader>
            <CardTitle>Notation</CardTitle>
            <CardDescription>Grand staff chord display</CardDescription>
          </CardHeader>
          <CardContent>
            <StaffNotation chord={selectedChord} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Interactive Piano */}
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Interactive Piano</CardTitle>
          <CardDescription>
            Click keys to play notes, or use controls for full chord playback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InteractivePiano selectedChord={selectedChord} />
        </CardContent>
      </Card>
    </div>
  )
}
