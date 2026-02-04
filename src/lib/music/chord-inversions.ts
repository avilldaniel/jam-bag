import type { Note } from '@/components/chords/selectors/root-note-selector'
import type { NoteWithRole } from './chord-theory'
import { getChordNotes } from './chord-theory'
import type { VoicedNote } from './piano-utils'
import { noteToMidi } from './piano-utils'

/**
 * Represents a chord inversion with voicing and notation
 */
export interface ChordInversion {
  /** Inversion number (1 = first inversion, 2 = second, etc.) */
  inversionNumber: number
  /** Notes with octave placement for this inversion */
  voicedNotes: VoicedNote[]
  /** The bass (lowest) note of this inversion */
  bassNote: Note
  /** Slash chord notation (e.g., "Cmaj7/E") */
  slashNotation: string
}

/**
 * Get the number of possible inversions for a chord
 * Inversions = number of notes - 1 (root position not counted as inversion)
 */
export function getInversionCount(chordNotes: NoteWithRole[]): number {
  return Math.max(0, chordNotes.length - 1)
}

/**
 * Rotate chord notes by a given number of positions
 * For inversion N, the Nth note becomes the bass
 */
function rotateNotes(notes: NoteWithRole[], positions: number): NoteWithRole[] {
  if (notes.length === 0) return []
  const normalizedPos = positions % notes.length
  return [...notes.slice(normalizedPos), ...notes.slice(0, normalizedPos)]
}

/**
 * Voice a chord inversion with proper octave placement
 * Bass note starts at baseOctave, other notes stack above
 */
export function voiceChordInversion(
  chordNotes: NoteWithRole[],
  inversionNumber: number,
  baseOctave: number = 4,
): VoicedNote[] {
  if (chordNotes.length === 0) return []

  // Rotate notes so the inversion's bass note is first
  const rotatedNotes = rotateNotes(chordNotes, inversionNumber)

  const voiced: VoicedNote[] = []
  let currentOctave = baseOctave
  let previousMidi = -1

  for (const chordNote of rotatedNotes) {
    // Calculate MIDI at current octave
    let midi = noteToMidi(chordNote.note, currentOctave)

    // If this note would be lower than or equal to previous, bump up an octave
    if (previousMidi >= 0 && midi <= previousMidi) {
      currentOctave++
      midi = noteToMidi(chordNote.note, currentOctave)
    }

    voiced.push({
      note: chordNote.note,
      octave: currentOctave,
      midiNumber: midi,
      role: chordNote.role,
    })

    previousMidi = midi
  }

  return voiced
}

/**
 * Format slash chord notation (e.g., "Cmaj7/E")
 */
export function formatSlashNotation(
  root: Note,
  chordType: string,
  bassNote: Note,
): string {
  return `${root}${chordType}/${bassNote}`
}

/**
 * Get all inversions for a chord
 */
export function getAllInversions(
  root: Note,
  chordType: string,
  baseOctave: number = 4,
): ChordInversion[] {
  const chordNotes = getChordNotes(root, chordType)
  const inversionCount = getInversionCount(chordNotes)

  if (inversionCount === 0) return []

  const inversions: ChordInversion[] = []

  for (let i = 1; i <= inversionCount; i++) {
    const voicedNotes = voiceChordInversion(chordNotes, i, baseOctave)
    const bassNote = voicedNotes[0]?.note ?? root

    inversions.push({
      inversionNumber: i,
      voicedNotes,
      bassNote,
      slashNotation: formatSlashNotation(root, chordType, bassNote),
    })
  }

  return inversions
}

/**
 * Get inversion name (e.g., "1st", "2nd", "3rd")
 */
export function getInversionName(inversionNumber: number): string {
  const suffixes: Record<number, string> = {
    1: '1st',
    2: '2nd',
    3: '3rd',
  }
  return suffixes[inversionNumber] ?? `${inversionNumber}th`
}
