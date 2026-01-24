import { createFileRoute } from '@tanstack/react-router'
import { PianoChords } from '@/components/piano-chords'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <PianoChords />
}
