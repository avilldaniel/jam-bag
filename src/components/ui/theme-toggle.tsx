'use client'

import { Moon01Icon, Sun01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThemeToggleProps extends React.ComponentProps<typeof Button> {}

function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      data-slot="theme-toggle"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      className={cn(className)}
      {...props}
    >
      <HugeiconsIcon
        icon={Sun01Icon}
        className="size-4 rotate-0 scale-100 transition-transform dark:rotate-90 dark:scale-0"
      />
      <HugeiconsIcon
        icon={Moon01Icon}
        className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
      />
    </Button>
  )
}

export { ThemeToggle }
export type { ThemeToggleProps }
