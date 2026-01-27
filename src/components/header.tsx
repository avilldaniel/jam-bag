import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface HeaderProps extends React.ComponentProps<'header'> {}

function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      data-slot="header"
      className={cn('flex items-center justify-end py-4', className)}
      {...props}
    >
      <ThemeToggle />
    </header>
  )
}

export { Header }
export type { HeaderProps }
