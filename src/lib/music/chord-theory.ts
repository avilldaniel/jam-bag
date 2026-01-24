import type { Note } from '@/components/root-note-selector'

/**
 * Chord tone roles for color coding
 */
export type ChordRole = 'root' | 'third' | 'fifth' | 'seventh' | 'extension'

/**
 * A chord interval with semitones from root and its role
 */
export interface ChordInterval {
  semitones: number
  role: ChordRole
}

/**
 * A note with its chord role for highlighting
 */
export interface NoteWithRole {
  note: Note
  semitones: number
  role: ChordRole
}

/**
 * Chromatic note array for transposition calculations
 */
const CHROMATIC_SCALE: Note[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

/**
 * Get the index of a note in the chromatic scale (0-11)
 */
export function getNoteIndex(note: Note): number {
  return CHROMATIC_SCALE.indexOf(note)
}

/**
 * Transpose a note by a number of semitones
 */
export function transposeNote(note: Note, semitones: number): Note {
  const index = getNoteIndex(note)
  const newIndex = (index + semitones + 12) % 12
  return CHROMATIC_SCALE[newIndex]
}

/**
 * Interval definitions for all 40 chord types
 * Each chord maps to an array of intervals with their roles
 */
export const CHORD_INTERVALS: Record<string, ChordInterval[]> = {
  // Major family
  maj: [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
  ],
  maj7: [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 11, role: 'seventh' },
  ],
  maj9: [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 11, role: 'seventh' },
    { semitones: 14, role: 'extension' },
  ],
  maj11: [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 11, role: 'seventh' },
    { semitones: 14, role: 'extension' },
    { semitones: 17, role: 'extension' },
  ],
  maj13: [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 11, role: 'seventh' },
    { semitones: 14, role: 'extension' },
    { semitones: 21, role: 'extension' },
  ],
  '6': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 9, role: 'extension' },
  ],
  add9: [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 14, role: 'extension' },
  ],
  '6/9': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 9, role: 'extension' },
    { semitones: 14, role: 'extension' },
  ],

  // Minor family
  m: [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 7, role: 'fifth' },
  ],
  m7: [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
  ],
  m9: [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 14, role: 'extension' },
  ],
  m11: [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 14, role: 'extension' },
    { semitones: 17, role: 'extension' },
  ],
  m6: [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 9, role: 'extension' },
  ],
  'm(maj7)': [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 11, role: 'seventh' },
  ],
  'm(maj9)': [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 11, role: 'seventh' },
    { semitones: 14, role: 'extension' },
  ],
  'm add9': [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 14, role: 'extension' },
  ],

  // Dominant family
  '7': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
  ],
  '9': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 14, role: 'extension' },
  ],
  '11': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 14, role: 'extension' },
    { semitones: 17, role: 'extension' },
  ],
  '13': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 14, role: 'extension' },
    { semitones: 21, role: 'extension' },
  ],
  '7#9': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 15, role: 'extension' },
  ],
  '7b9': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 13, role: 'extension' },
  ],
  '7#5': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 8, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
  ],
  '7b5': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 6, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
  ],
  '9#11': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 14, role: 'extension' },
    { semitones: 18, role: 'extension' },
  ],
  '13#11': [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 18, role: 'extension' },
    { semitones: 21, role: 'extension' },
  ],

  // Diminished / Augmented family
  dim: [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 6, role: 'fifth' },
  ],
  dim7: [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 6, role: 'fifth' },
    { semitones: 9, role: 'seventh' },
  ],
  m7b5: [
    { semitones: 0, role: 'root' },
    { semitones: 3, role: 'third' },
    { semitones: 6, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
  ],
  aug: [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 8, role: 'fifth' },
  ],
  aug7: [
    { semitones: 0, role: 'root' },
    { semitones: 4, role: 'third' },
    { semitones: 8, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
  ],

  // Sus / Power family
  sus2: [
    { semitones: 0, role: 'root' },
    { semitones: 2, role: 'third' },
    { semitones: 7, role: 'fifth' },
  ],
  sus4: [
    { semitones: 0, role: 'root' },
    { semitones: 5, role: 'third' },
    { semitones: 7, role: 'fifth' },
  ],
  '7sus4': [
    { semitones: 0, role: 'root' },
    { semitones: 5, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
  ],
  '9sus4': [
    { semitones: 0, role: 'root' },
    { semitones: 5, role: 'third' },
    { semitones: 7, role: 'fifth' },
    { semitones: 10, role: 'seventh' },
    { semitones: 14, role: 'extension' },
  ],
  '5': [
    { semitones: 0, role: 'root' },
    { semitones: 7, role: 'fifth' },
  ],
}

/**
 * Get the notes of a chord with their roles
 */
export function getChordNotes(root: Note, chordType: string): NoteWithRole[] {
  const intervals = CHORD_INTERVALS[chordType]
  if (!intervals) {
    return []
  }

  return intervals.map((interval) => ({
    note: transposeNote(root, interval.semitones % 12),
    semitones: interval.semitones,
    role: interval.role,
  }))
}

/**
 * Get the chord definition (intervals) for a chord type
 */
export function getChordDefinition(chordType: string): ChordInterval[] | null {
  return CHORD_INTERVALS[chordType] ?? null
}
