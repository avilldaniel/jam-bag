import { createFileRoute } from '@tanstack/react-router'
import ChordsPage from '@/components/chords'

export const Route = createFileRoute('/chords')({ component: ChordsPage })
