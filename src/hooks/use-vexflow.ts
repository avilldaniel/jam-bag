'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { VoicedNote } from '@/lib/music/piano-utils'

interface UseVexFlowOptions {
  /** Ref to the container element */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Width of the notation area */
  width?: number
  /** Height of the notation area */
  height?: number
}

interface UseVexFlowReturn {
  /** Whether VexFlow is initialized and ready */
  isReady: boolean
  /** Render a chord on the grand staff */
  renderChord: (notes: VoicedNote[], chordName?: string) => void
  /** Clear the notation */
  clear: () => void
}

/**
 * Hook for VexFlow music notation rendering
 * Handles SSR safety and provides grand staff rendering
 */
export function useVexFlow({
  containerRef,
  width = 280,
  height = 200,
}: UseVexFlowOptions): UseVexFlowReturn {
  const [isReady, setIsReady] = useState(false)

  // Store VexFlow module and renderer in refs
  const vexflowRef = useRef<typeof import('vexflow') | null>(null)
  const rendererRef = useRef<import('vexflow').Renderer | null>(null)
  const contextRef = useRef<import('vexflow').RenderContext | null>(null)

  // Initialize VexFlow on client side only
  useEffect(() => {
    let mounted = true

    async function initVexFlow() {
      if (typeof window === 'undefined' || !containerRef.current) return

      try {
        const VexFlow = await import('vexflow')
        if (!mounted || !containerRef.current) return

        vexflowRef.current = VexFlow

        const { Renderer } = VexFlow

        // Create SVG renderer
        const renderer = new Renderer(
          containerRef.current,
          Renderer.Backends.SVG,
        )
        renderer.resize(width, height)

        const context = renderer.getContext()

        if (mounted) {
          rendererRef.current = renderer
          contextRef.current = context
          setIsReady(true)
        }
      } catch (err) {
        console.error('Failed to initialize VexFlow:', err)
      }
    }

    initVexFlow()

    return () => {
      mounted = false
    }
  }, [containerRef, width, height])

  const clear = useCallback(() => {
    if (!containerRef.current) return
    // Clear SVG content
    const svg = containerRef.current.querySelector('svg')
    if (svg) {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild)
      }
    }
  }, [containerRef])

  const renderChord = useCallback(
    (notes: VoicedNote[], chordName?: string) => {
      if (!vexflowRef.current || !contextRef.current || !rendererRef.current)
        return

      const VF = vexflowRef.current
      const context = contextRef.current

      // Clear previous content
      clear()

      // Reinitialize context after clear
      rendererRef.current.resize(width, height)

      const staveWidth = width - 40

      // Create treble stave
      const trebleStave = new VF.Stave(10, 10, staveWidth)
      trebleStave.addClef('treble')
      trebleStave.setContext(context).draw()

      // Create bass stave
      const bassStave = new VF.Stave(10, 100, staveWidth)
      bassStave.addClef('bass')
      bassStave.setContext(context).draw()

      // Add connector
      const connector = new VF.StaveConnector(trebleStave, bassStave)
      connector.setType(VF.StaveConnector.type.BRACE)
      connector.setContext(context).draw()

      const lineConnector = new VF.StaveConnector(trebleStave, bassStave)
      lineConnector.setType(VF.StaveConnector.type.SINGLE_LEFT)
      lineConnector.setContext(context).draw()

      if (notes.length === 0) return

      // Split notes between treble and bass (C4 = middle C, goes to treble)
      const trebleNotes = notes.filter((n) => n.octave >= 4)
      const bassNotes = notes.filter((n) => n.octave < 4)

      // Helper to convert note to VexFlow key
      const toVexKey = (n: VoicedNote): string => {
        const noteName = n.note.replace('#', '#').toLowerCase()
        return `${noteName}/${n.octave}`
      }

      // Render treble notes
      if (trebleNotes.length > 0) {
        const keys = trebleNotes.map(toVexKey)
        const staveNote = new VF.StaveNote({
          clef: 'treble',
          keys,
          duration: 'w',
        })

        // Add accidentals
        trebleNotes.forEach((n, i) => {
          if (n.note.includes('#')) {
            staveNote.addModifier(new VF.Accidental('#'), i)
          }
        })

        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 })
        voice.addTickables([staveNote])

        new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 50)
        voice.draw(context, trebleStave)
      }

      // Render bass notes
      if (bassNotes.length > 0) {
        const keys = bassNotes.map(toVexKey)
        const staveNote = new VF.StaveNote({
          clef: 'bass',
          keys,
          duration: 'w',
        })

        // Add accidentals
        bassNotes.forEach((n, i) => {
          if (n.note.includes('#')) {
            staveNote.addModifier(new VF.Accidental('#'), i)
          }
        })

        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 })
        voice.addTickables([staveNote])

        new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 50)
        voice.draw(context, bassStave)
      }

      // Add chord name text if provided
      if (chordName) {
        const svg = containerRef.current?.querySelector('svg')
        if (svg) {
          const text = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'text',
          )
          text.setAttribute('x', String(width / 2))
          text.setAttribute('y', '195')
          text.setAttribute('text-anchor', 'middle')
          text.setAttribute('font-size', '14')
          text.setAttribute('font-weight', 'bold')
          text.setAttribute('fill', 'currentColor')
          text.textContent = chordName
          svg.appendChild(text)
        }
      }
    },
    [clear, width, height, containerRef],
  )

  return {
    isReady,
    renderChord,
    clear,
  }
}
