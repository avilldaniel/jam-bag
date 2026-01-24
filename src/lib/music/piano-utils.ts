import type { Note } from '@/components/root-note-selector'
import type { ChordRole, NoteWithRole } from './chord-theory'

/**
 * Chromatic notes for conversion
 */
const CHROMATIC_NOTES: Note[] = [
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
 * Represents a single piano key
 */
export interface PianoKey {
  note: Note
  octave: number
  midiNumber: number
  isBlack: boolean
  keyId: string
}

/**
 * A piano key with optional highlighting for chord tones
 */
export interface HighlightedKey extends PianoKey {
  role: ChordRole | null
}

/**
 * A voiced chord note with octave placement
 */
export interface VoicedNote {
  note: Note
  octave: number
  midiNumber: number
  role: ChordRole
}

/**
 * Check if a note is a black key
 */
export function isBlackKey(note: Note): boolean {
  return note.includes('#')
}

/**
 * Convert note + octave to MIDI number
 * Middle C (C4) = MIDI 60
 */
export function noteToMidi(note: Note, octave: number): number {
  const noteIndex = CHROMATIC_NOTES.indexOf(note)
  return (octave + 1) * 12 + noteIndex
}

/**
 * Convert MIDI number to note + octave
 */
export function midiToNote(midiNumber: number): { note: Note; octave: number } {
  const octave = Math.floor(midiNumber / 12) - 1
  const noteIndex = midiNumber % 12
  return {
    note: CHROMATIC_NOTES[noteIndex],
    octave,
  }
}

/**
 * Generate a key ID string (e.g., "C4", "F#3")
 */
export function getKeyId(note: Note, octave: number): string {
  return `${note}${octave}`
}

/**
 * Generate piano keys for a range of octaves
 * Default: C3 to C6 (3 full octaves + final C = 37 keys)
 */
export function generatePianoKeys(
  startOctave: number = 3,
  numOctaves: number = 3,
): PianoKey[] {
  const keys: PianoKey[] = []

  for (let octave = startOctave; octave < startOctave + numOctaves; octave++) {
    for (const note of CHROMATIC_NOTES) {
      keys.push({
        note,
        octave,
        midiNumber: noteToMidi(note, octave),
        isBlack: isBlackKey(note),
        keyId: getKeyId(note, octave),
      })
    }
  }

  // Add final C to complete the range
  const finalOctave = startOctave + numOctaves
  keys.push({
    note: 'C',
    octave: finalOctave,
    midiNumber: noteToMidi('C', finalOctave),
    isBlack: false,
    keyId: getKeyId('C', finalOctave),
  })

  return keys
}

/**
 * Voice a chord in a specific octave range
 * Places root at baseOctave, stacks other notes above
 */
export function voiceChord(
  chordNotes: NoteWithRole[],
  baseOctave: number = 4,
): VoicedNote[] {
  if (chordNotes.length === 0) return []

  const voiced: VoicedNote[] = []
  const currentOctave = baseOctave

  for (const chordNote of chordNotes) {
    // Calculate octave based on semitones from root
    const octaveOffset = Math.floor(chordNote.semitones / 12)
    const targetOctave = currentOctave + octaveOffset

    voiced.push({
      note: chordNote.note,
      octave: targetOctave,
      midiNumber: noteToMidi(chordNote.note, targetOctave),
      role: chordNote.role,
    })
  }

  return voiced
}

/**
 * Create a map of keyId -> role for highlighting
 */
export function createHighlightMap(
  voicedNotes: VoicedNote[],
): Map<string, ChordRole> {
  const map = new Map<string, ChordRole>()
  for (const note of voicedNotes) {
    map.set(getKeyId(note.note, note.octave), note.role)
  }
  return map
}

/**
 * Get highlighted keys from piano keys and a chord
 */
export function getHighlightedKeys(
  pianoKeys: PianoKey[],
  highlightMap: Map<string, ChordRole>,
): HighlightedKey[] {
  return pianoKeys.map((key) => ({
    ...key,
    role: highlightMap.get(key.keyId) ?? null,
  }))
}

/**
 * Get Tone.js note string (e.g., "C4", "F#3")
 */
export function getToneNoteName(note: Note, octave: number): string {
  return `${note}${octave}`
}

/**
 * Get VexFlow note key (e.g., "c/4", "f#/3")
 */
export function getVexFlowKey(note: Note, octave: number): string {
  return `${note.toLowerCase()}/${octave}`
}
