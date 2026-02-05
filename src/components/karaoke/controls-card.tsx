'use client'

import {
  InformationCircleIcon,
  MinusSignIcon,
  PauseIcon,
  PlayIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { YouTubePlayer } from './player-card'

interface ControlsCardProps {
  player: YouTubePlayer | null
  isPlaying: boolean
  playbackRate: number
  pitch: number
  onPlaybackRateChange: (rate: number) => void
  onPitchChange: (pitch: number) => void
  onPlayPause: () => void
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export function ControlsCard({
  player,
  isPlaying,
  playbackRate,
  pitch,
  onPlaybackRateChange,
  onPitchChange,
  onPlayPause,
}: ControlsCardProps) {
  const handleSpeedChange = (values: readonly string[]) => {
    const newRate = values[0]
    if (newRate) {
      const rate = parseFloat(newRate)
      onPlaybackRateChange(rate)
      player?.setPlaybackRate(rate)
    }
  }

  const handlePitchIncrement = (delta: number) => {
    const newPitch = Math.max(-12, Math.min(12, pitch + delta))
    onPitchChange(newPitch)
  }

  return (
    <Card className="w-full lg:flex-1">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Pitch Control */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Pitch
            </span>
            <span className="text-xs text-muted-foreground">
              {pitch > 0 ? `+${pitch}` : pitch} semitones
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon-xs"
              variant="outline"
              onClick={() => handlePitchIncrement(-1)}
              disabled
              title="Requires Chrome extension"
            >
              <HugeiconsIcon icon={MinusSignIcon} className="size-3" />
            </Button>
            <Slider
              value={[pitch]}
              min={-12}
              max={12}
              step={1}
              disabled
              className="flex-1 opacity-50"
            />
            <Button
              size="icon-xs"
              variant="outline"
              onClick={() => handlePitchIncrement(1)}
              disabled
              title="Requires Chrome extension"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="size-3" />
            </Button>
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Speed</span>
          <ToggleGroup
            value={[String(playbackRate)]}
            onValueChange={handleSpeedChange}
            variant="outline"
            size="sm"
          >
            {SPEED_OPTIONS.map((speed) => (
              <ToggleGroupItem key={speed} value={String(speed)}>
                {speed}x
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Playback</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onPlayPause}
              disabled={!player}
              className="flex-1"
            >
              {isPlaying ? (
                <>
                  <HugeiconsIcon icon={PauseIcon} className="size-4" />
                  Pause
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={PlayIcon} className="size-4" />
                  Play
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Extension Notice */}
        <div className="flex items-start gap-2 rounded-sm border border-border bg-muted/50 p-3">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">
            Install our Chrome extension for pitch control functionality.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
