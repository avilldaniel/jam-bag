import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">jam bag</h1>
      <nav className="mt-6 flex gap-6">
        <Link
          to="/chords"
          className="text-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          chords
        </Link>
        <Link
          to="/karaoke"
          className="text-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          karaoke
        </Link>
      </nav>
    </div>
  )
}
