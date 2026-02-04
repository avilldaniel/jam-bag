'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePiano } from '@/hooks/use-piano'
import { ChordInversions } from './display/chord-inversions'
import { StaffNotation } from './notation/staff-notation'
import { InteractivePiano } from './piano/interactive-piano'
import {
  type ChordCategory,
  ChordSelector,
  type ChordType,
} from './selectors/chord-selector'
import { type Note, RootNoteSelector } from './selectors/root-note-selector'

interface ChordSelection {
  rootNote: Note
  category: ChordCategory
  chord: ChordType | null
}

export default function ChordsPage() {
  const [selection, setSelection] = useState<ChordSelection>({
    rootNote: 'C',
    category: 'Major',
    chord: 'maj7',
  })

  // Shared piano audio instance
  const piano = usePiano()

  // Derive the selected chord for InteractivePiano
  const selectedChord = selection.chord
    ? { root: selection.rootNote, type: selection.chord }
    : null

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-background p-4">
      {/* Top row: Chord Selector + Notation */}
      <div className="flex w-full max-w-5xl items-start justify-center gap-4 max-lg:flex-col max-lg:items-center lg:items-stretch">
        {/* Chord Selector Card */}
        <Card className="w-full lg:max-w-lg">
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
        <Card className="w-full lg:max-w-md lg:flex-1">
          <CardHeader>
            <CardTitle>Notation</CardTitle>
            <CardDescription>Grand staff chord display</CardDescription>

            {selectedChord?.root && selectedChord?.type && (
              <h1 className="py-4 text-center text-3xl font-bold text-primary text-shadow-foreground text-shadow-2xs">
                {selectedChord?.root + selectedChord?.type}
              </h1>
            )}
          </CardHeader>
          <CardContent>
            <StaffNotation chord={selectedChord} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Interactive Piano */}
      <Card className="w-full lg:max-w-5xl">
        <CardHeader>
          <CardTitle>Interactive Piano</CardTitle>
          <CardDescription>
            Click keys to play notes, or use controls for full chord playback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InteractivePiano selectedChord={selectedChord} piano={piano} />
        </CardContent>
      </Card>

      {/* Chord Inversions */}
      <Card className="w-full lg:max-w-5xl">
        <CardHeader>
          <CardTitle>Chord Inversions</CardTitle>
          <CardDescription>
            All inversions with interactive playback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChordInversions selectedChord={selectedChord} piano={piano} />
        </CardContent>
      </Card>
    </div>
  )
}
