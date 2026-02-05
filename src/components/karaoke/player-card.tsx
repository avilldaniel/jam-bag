'use client'

import YouTube, { type YouTubeEvent, type YouTubePlayer } from 'react-youtube'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PlayerCardProps {
  videoId: string | null
  onReady?: (player: YouTubePlayer) => void
  onStateChange?: (state: number) => void
}

export type { YouTubePlayer }

export function PlayerCard({
  videoId,
  onReady,
  onStateChange,
}: PlayerCardProps) {
  const handleReady = (event: YouTubeEvent) => {
    onReady?.(event.target)
  }

  const handleStateChange = (event: YouTubeEvent) => {
    onStateChange?.(event.data)
  }

  return (
    <Card className="w-full lg:flex-2">
      <CardHeader>
        <CardTitle>Player</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {videoId ? (
            <YouTube
              videoId={videoId}
              className="absolute inset-0 size-full"
              iframeClassName="size-full"
              onReady={handleReady}
              onStateChange={handleStateChange}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 0,
                  modestbranding: 1,
                  rel: 0,
                },
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Load a video to start</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
