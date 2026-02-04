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
          className="relative text-lg text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
        >
          chords
        </Link>
        <Link
          to="/karaoke"
          className="relative text-lg text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
        >
          karaoke
        </Link>
      </nav>
    </div>
  )
}
