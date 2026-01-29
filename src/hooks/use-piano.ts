'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { VoicedNote } from '@/lib/music/piano-utils'
import { getToneNoteName } from '@/lib/music/piano-utils'

export interface UsePianoReturn {
  /** Whether audio context has been started */
  isEnabled: boolean
  /** Whether samples are still loading */
  isLoading: boolean
  /** Any error that occurred */
  error: Error | null
  /** Current volume level (0-100) */
  volume: number
  /** Set volume level (0-100) */
  setVolume: (volume: number) => void
  /** Enable audio (must be called from user interaction) */
  enable: () => Promise<void>
  /** Disable audio */
  disable: () => Promise<void>
  /** Toggle audio on/off */
  toggle: () => Promise<void>
  /** Play a single note by MIDI number */
  playNote: (note: string, duration?: number) => void
  /** Play multiple notes simultaneously as a chord */
  playChord: (notes: VoicedNote[], duration?: number) => void
  /** Play notes sequentially as an ascending arpeggio */
  playArpeggio: (
    notes: VoicedNote[],
    noteDuration?: number,
    gap?: number,
  ) => void
  /** Stop all playing notes */
  stopAll: () => void
}

/**
 * Hook for Tone.js piano audio playback
 * Handles SSR safety and browser autoplay policy
 */
// Convert 0-100 volume to decibels (-40 to 0 dB range)
function volumeToDb(volume: number): number {
  if (volume === 0) return -Infinity
  // Map 0-100 to -40dB to 0dB
  return (volume / 100) * 40 - 40
}

export function usePiano(): UsePianoReturn {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [volume, setVolumeState] = useState(50) // Default to 50%

  // Store Tone module and sampler in refs
  const toneRef = useRef<typeof import('tone') | null>(null)
  const samplerRef = useRef<import('tone').Sampler | null>(null)

  // Initialize Tone.js on client side only
  useEffect(() => {
    let mounted = true

    async function initTone() {
      if (typeof window === 'undefined') return

      try {
        // Dynamic import to avoid SSR issues
        const Tone = await import('tone')
        if (!mounted) return

        toneRef.current = Tone

        // Create sampler with Salamander piano samples from CDN
        const sampler = new Tone.Sampler({
          urls: {
            A0: 'A0.mp3',
            C1: 'C1.mp3',
            'D#1': 'Ds1.mp3',
            'F#1': 'Fs1.mp3',
            A1: 'A1.mp3',
            C2: 'C2.mp3',
            'D#2': 'Ds2.mp3',
            'F#2': 'Fs2.mp3',
            A2: 'A2.mp3',
            C3: 'C3.mp3',
            'D#3': 'Ds3.mp3',
            'F#3': 'Fs3.mp3',
            A3: 'A3.mp3',
            C4: 'C4.mp3',
            'D#4': 'Ds4.mp3',
            'F#4': 'Fs4.mp3',
            A4: 'A4.mp3',
            C5: 'C5.mp3',
            'D#5': 'Ds5.mp3',
            'F#5': 'Fs5.mp3',
            A5: 'A5.mp3',
            C6: 'C6.mp3',
            'D#6': 'Ds6.mp3',
            'F#6': 'Fs6.mp3',
            A6: 'A6.mp3',
            C7: 'C7.mp3',
            'D#7': 'Ds7.mp3',
            'F#7': 'Fs7.mp3',
            A7: 'A7.mp3',
            C8: 'C8.mp3',
          },
          baseUrl: 'https://tonejs.github.io/audio/salamander/',
          onload: () => {
            if (mounted) {
              setIsLoading(false)
            }
          },
          onerror: (err) => {
            if (mounted) {
              setError(
                err instanceof Error
                  ? err
                  : new Error('Failed to load samples'),
              )
              setIsLoading(false)
            }
          },
        }).toDestination()

        // Set initial volume
        sampler.volume.value = volumeToDb(50)

        if (mounted) {
          samplerRef.current = sampler
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to initialize audio'),
          )
          setIsLoading(false)
        }
      }
    }

    initTone()

    return () => {
      mounted = false
      // Cleanup sampler on unmount
      samplerRef.current?.dispose()
    }
  }, [])

  const enable = useCallback(async () => {
    if (!toneRef.current) return

    try {
      await toneRef.current.start()
      setIsEnabled(true)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to start audio context'),
      )
    }
  }, [])

  const disable = useCallback(async () => {
    setIsEnabled(false)
  }, [])

  const toggle = useCallback(async () => {
    if (!toneRef.current) return

    // If not yet started, we need to start the audio context first (browser autoplay policy)
    const context = toneRef.current.getContext()
    if (context.state === 'suspended') {
      try {
        await toneRef.current.start()
        setIsEnabled(true)
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to start audio'),
        )
      }
    } else {
      // Audio context is running, just toggle the mute state
      setIsEnabled((prev) => !prev)
    }
  }, [])

  const playNote = useCallback(
    (note: string, duration: number = 0.8) => {
      if (!samplerRef.current || !isEnabled) return
      samplerRef.current.triggerAttackRelease(note, duration)
    },
    [isEnabled],
  )

  const playChord = useCallback(
    (notes: VoicedNote[], duration: number = 1.5) => {
      if (!samplerRef.current || !isEnabled || notes.length === 0) return

      const noteNames = notes.map((n) => getToneNoteName(n.note, n.octave))
      samplerRef.current.triggerAttackRelease(noteNames, duration)
    },
    [isEnabled],
  )

  const playArpeggio = useCallback(
    (notes: VoicedNote[], noteDuration: number = 0.4, gap: number = 0.15) => {
      if (
        !samplerRef.current ||
        !toneRef.current ||
        !isEnabled ||
        notes.length === 0
      )
        return

      const Tone = toneRef.current
      const now = Tone.now()

      // Sort notes by MIDI number for ascending arpeggio
      const sortedNotes = [...notes].sort((a, b) => a.midiNumber - b.midiNumber)

      sortedNotes.forEach((n, i) => {
        const noteName = getToneNoteName(n.note, n.octave)
        const time = now + i * (noteDuration + gap)
        samplerRef.current?.triggerAttackRelease(noteName, noteDuration, time)
      })
    },
    [isEnabled],
  )

  const stopAll = useCallback(() => {
    samplerRef.current?.releaseAll()
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, newVolume))
    setVolumeState(clampedVolume)
    if (samplerRef.current) {
      samplerRef.current.volume.value = volumeToDb(clampedVolume)
    }
  }, [])

  return {
    isEnabled,
    isLoading,
    error,
    volume,
    setVolume,
    enable,
    disable,
    toggle,
    playNote,
    playChord,
    playArpeggio,
    stopAll,
  }
}
