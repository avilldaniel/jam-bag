"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RootNoteSelector, type Note } from "@/components/root-note-selector"
import {
  ChordSelector,
  type ChordType,
  type ChordCategory,
} from "@/components/chord-selector"

interface ChordSelection {
  rootNote: Note
  category: ChordCategory
  chord: ChordType | null
}

export function PianoChords() {
  const [selection, setSelection] = useState<ChordSelection>({
    rootNote: "C",
    category: "Major",
    chord: "maj7",
  })

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
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

          {selection.chord && (
            <div className="text-sm text-muted-foreground">
              Selected:{" "}
              <span className="font-medium text-foreground">
                {selection.rootNote}
                {selection.chord}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
