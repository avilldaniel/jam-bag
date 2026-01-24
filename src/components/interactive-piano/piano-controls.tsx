'use client'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

interface PianoControlsProps extends React.ComponentProps<'div'> {
  /**
   * Whether audio is enabled
   */
  isEnabled: boolean
  /**
   * Whether audio is loading
   */
  isLoading: boolean
  /**
   * Callback to enable audio
   */
  onEnableAudio: () => void
  /**
   * Callback to play the chord
   */
  onPlayChord: () => void
  /**
   * Callback to play the arpeggio
   */
  onPlayArpeggio: () => void
  /**
   * Whether there is an active chord to play
   */
  hasChord: boolean
  /**
   * Current hand selection
   */
  hand: 'left' | 'right'
  /**
   * Callback when hand selection changes
   */
  onHandChange: (hand: 'left' | 'right') => void
  /**
   * Whether to show fingering
   */
  showFingering: boolean
  /**
   * Callback when show fingering changes
   */
  onShowFingeringChange: (show: boolean) => void
}

/**
 * Control panel for the interactive piano.
 * Includes audio enable button, play buttons, hand toggle, and fingering toggle.
 *
 * @example
 * ```tsx
 * <PianoControls
 *   isEnabled={isEnabled}
 *   isLoading={isLoading}
 *   onEnableAudio={enable}
 *   onPlayChord={handlePlayChord}
 *   onPlayArpeggio={handlePlayArpeggio}
 *   hasChord={!!selectedChord}
 *   hand={hand}
 *   onHandChange={setHand}
 *   showFingering={showFingering}
 *   onShowFingeringChange={setShowFingering}
 * />
 * ```
 */
function PianoControls({
  isEnabled,
  isLoading,
  onEnableAudio,
  onPlayChord,
  onPlayArpeggio,
  hasChord,
  hand,
  onHandChange,
  showFingering,
  onShowFingeringChange,
  className,
  ...props
}: PianoControlsProps) {
  const handleHandChange = (value: readonly string[]) => {
    if (value.length > 0) {
      const newHand = value.find((v) => v !== hand) ?? value[0]
      onHandChange(newHand as 'left' | 'right')
    }
  }

  const handleFingeringChange = (value: readonly string[]) => {
    onShowFingeringChange(value.includes('fingering'))
  }

  return (
    <div
      data-slot="piano-controls"
      className={cn('flex flex-wrap items-center gap-3', className)}
      {...props}
    >
      {/* Audio enable button */}
      <Button
        variant={isEnabled ? 'secondary' : 'default'}
        size="sm"
        onClick={onEnableAudio}
        disabled={isEnabled || isLoading}
      >
        {isLoading
          ? 'Loading...'
          : isEnabled
            ? 'Audio Enabled'
            : 'Enable Audio'}
      </Button>

      {/* Play buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onPlayChord}
          disabled={!isEnabled || !hasChord}
        >
          Play Chord
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPlayArpeggio}
          disabled={!isEnabled || !hasChord}
        >
          Play Arpeggio
        </Button>
      </div>

      {/* Hand toggle */}
      <ToggleGroup
        value={[hand]}
        onValueChange={handleHandChange}
        variant="outline"
        size="sm"
        aria-label="Select hand"
      >
        <ToggleGroupItem value="left" aria-label="Left hand">
          L
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Right hand">
          R
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Fingering toggle */}
      <ToggleGroup
        value={showFingering ? ['fingering'] : []}
        onValueChange={handleFingeringChange}
        variant="outline"
        size="sm"
        aria-label="Toggle fingering display"
      >
        <ToggleGroupItem value="fingering" aria-label="Show fingering">
          Fingering
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export { PianoControls }
export type { PianoControlsProps }
