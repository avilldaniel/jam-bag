'use client'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Fingering overlay CVA variants for hand-based coloring
 */
const fingeringOverlayVariants = cva(
  'absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full text-[10px] font-bold leading-none pointer-events-none size-5',
  {
    variants: {
      hand: {
        left: 'bg-[oklch(0.7_0.15_200)] text-white',
        right: 'bg-[oklch(0.65_0.18_30)] text-white',
      },
    },
    defaultVariants: {
      hand: 'right',
    },
  },
)

type FingerNumber = 1 | 2 | 3 | 4 | 5

interface FingeringOverlayProps
  extends React.ComponentProps<'span'>,
    VariantProps<typeof fingeringOverlayVariants> {
  /**
   * The finger number to display (1-5)
   * 1 = thumb, 2 = index, 3 = middle, 4 = ring, 5 = pinky
   */
  fingerNumber: FingerNumber
}

/**
 * A badge overlay showing the finger number for a piano key.
 * Uses different colors for left and right hands.
 *
 * Left hand: blue-ish color
 * Right hand: orange-ish color
 *
 * @example
 * ```tsx
 * <FingeringOverlay fingerNumber={1} hand="right" />
 * <FingeringOverlay fingerNumber={5} hand="left" />
 * ```
 */
function FingeringOverlay({
  fingerNumber,
  hand = 'right',
  className,
  ...props
}: FingeringOverlayProps) {
  return (
    <span
      data-slot="fingering-overlay"
      data-finger={fingerNumber}
      data-hand={hand}
      className={cn(fingeringOverlayVariants({ hand }), className)}
      {...props}
    >
      {fingerNumber}
    </span>
  )
}

export { FingeringOverlay, fingeringOverlayVariants }
export type { FingeringOverlayProps, FingerNumber }
