import { createFileRoute } from '@tanstack/react-router'
import KaraokePage from '@/components/karaoke'

export const Route = createFileRoute('/karaoke')({
  component: KaraokePage,
})
