'use client'

import { useState } from 'react'
import { ControlsCard } from './controls-card'
import { PlayerCard, type YouTubePlayer } from './player-card'
import { UrlInputCard } from './url-input-card'

// YouTube player state for "playing"
const YT_PLAYING = 1

export default function KaraokePage() {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [player, setPlayer] = useState<YouTubePlayer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [pitch, setPitch] = useState(0)

  const handleVideoLoad = (id: string) => {
    setVideoId(id)
    setIsPlaying(false)
  }

  const handlePlayerReady = (playerInstance: YouTubePlayer) => {
    setPlayer(playerInstance)
  }

  const handleStateChange = (state: number) => {
    setIsPlaying(state === YT_PLAYING)
  }

  const handlePlayPause = () => {
    if (!player) return

    if (isPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-background p-4">
      {/* Card 1: URL Input */}
      <UrlInputCard onVideoLoad={handleVideoLoad} />

      {/* Cards 2 & 3: Player and Controls side by side */}
      <div className="flex w-full max-w-5xl gap-4 max-lg:flex-col max-lg:items-center lg:items-stretch">
        <PlayerCard
          videoId={videoId}
          onReady={handlePlayerReady}
          onStateChange={handleStateChange}
        />
        <ControlsCard
          player={player}
          isPlaying={isPlaying}
          playbackRate={playbackRate}
          pitch={pitch}
          onPlaybackRateChange={setPlaybackRate}
          onPitchChange={setPitch}
          onPlayPause={handlePlayPause}
        />
      </div>
    </div>
  )
}
