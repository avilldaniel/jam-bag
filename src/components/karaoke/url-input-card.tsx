'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface UrlInputCardProps {
  onVideoLoad: (videoId: string) => void
}

/**
 * Extract video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }

  return null
}

export function UrlInputCard({ onVideoLoad }: UrlInputCardProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLoad = () => {
    const videoId = extractVideoId(url)
    if (videoId) {
      setError(null)
      onVideoLoad(videoId)
    } else {
      setError('Invalid YouTube URL')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoad()
    }
  }

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Load Video</CardTitle>
        <CardDescription>Paste a YouTube URL to get started</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-invalid={!!error}
          />
          <InputGroupButton onClick={handleLoad} variant="default">
            Load
          </InputGroupButton>
        </InputGroup>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}
