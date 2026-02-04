import { Link } from '@tanstack/react-router'

import { Logo } from '@/components/shared/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface HeaderProps extends React.ComponentProps<'header'> {}

const navLinkStyles =
  'relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full'

function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      data-slot="header"
      className={cn('flex items-center justify-between py-4', className)}
      {...props}
    >
      <Link
        to="/"
        className="text-foreground transition-colors hover:text-foreground/80"
      >
        <Logo className="h-16 w-16" />
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/chords" className={navLinkStyles}>
          chords
        </Link>
        <Link to="/karaoke" className={navLinkStyles}>
          karaoke
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  )
}

export { Header }
export type { HeaderProps }
