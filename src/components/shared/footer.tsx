import { Logo } from '@/components/shared/logo'
import { cn } from '@/lib/utils'

interface FooterProps extends React.ComponentProps<'footer'> {}

function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn('flex flex-col items-center py-8', className)}
      {...props}
    >
      <Logo className="h-10 w-10 text-muted-foreground" />
      <p className="mt-2 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Jam Bag. Check out my other projects -{' '}
        <a
          className="font-semibold underline underline-offset-6"
          href="http://github.com/avilldaniel"
          target="_blank"
          rel="noopener noreferrer"
        >
          gh/avilldaniel
        </a>
      </p>
    </footer>
  )
}

export { Footer }
export type { FooterProps }
