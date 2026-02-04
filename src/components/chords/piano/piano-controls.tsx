'use client'

import {
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMute01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

interface PianoControlsProps extends React.ComponentProps<'div'> {
  /**
   * Whether audio is ready to play (samples loaded and volume > 0)
   */
  isEnabled: boolean
  /**
   * Current volume level (0-100)
   */
  volume: number
  /**
   * Callback when volume changes
   */
  onChangeVolume: (volume: number) => void
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
 * Includes volume slider, play buttons, hand toggle, and fingering toggle.
 *
 * @example
 * ```tsx
 * <PianoControls
 *   isEnabled={isEnabled}
 *   volume={volume}
 *   onChangeVolume={setVolume}
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
  volume,
  onChangeVolume,
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
      // className={cn('flex items-center justify-between', className)}
      className={cn(
        'flex flex-wrap items-center justify-between gap-6',
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Volume control */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => volume > 0 && onChangeVolume(0)}
            aria-label={volume > 0 ? 'Mute' : 'Muted'}
          >
            <HugeiconsIcon
              icon={
                volume === 0
                  ? VolumeMute01Icon
                  : volume < 50
                    ? VolumeLowIcon
                    : VolumeHighIcon
              }
              className="size-4"
            />
          </Button>
          <Slider
            value={[volume]}
            onValueChange={(values) => {
              const newVolume = Array.isArray(values) ? values[0] : values
              onChangeVolume(newVolume)
            }}
            min={0}
            max={100}
            step={1}
            className="w-24"
            aria-label="Volume"
          />
        </div>

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
      </div>

      <div className="flex flex-wrap items-center gap-3">
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

        {/* Hand toggle */}
        <ToggleGroup
          value={[hand]}
          onValueChange={handleHandChange}
          variant="outline"
          size="sm"
          aria-label="Select hand"
          className="gap-0"
        >
          <ToggleGroupItem value="left" aria-label="Left hand">
            L
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Right hand">
            R
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}

export { PianoControls }
export type { PianoControlsProps }
