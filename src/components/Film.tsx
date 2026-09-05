import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPlayer } from '../api'
import Translators from './Translators'
import QualityChoices from './Video/QualityChoices'
import Player from './Video/Player'


interface Translator {
  id: number
  title: string
}

interface Video {
  quality: string
  playlist: string
}

interface PlayerData {
  streams: Video[]
}

interface FilmProps {
  filmId: number
  translators: Translator[]
  onUpdateState: (values: Record<string, number | string>) => void
  playerTime?: number
  playerVolume?: number
  translatorId?: number | null
  quality?: string | null
}

function Film({
  filmId,
  translators,
  onUpdateState,
  playerTime = 0,
  playerVolume = 100,
  translatorId: propTranslatorId,
  quality: propQuality,
}: FilmProps) {
  const [translatorId, setTranslatorId] = useState<number | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [quality, setQuality] = useState<string | null>(null)
  const { data: playerData } = useQuery<PlayerData>({ queryKey: ['player', filmId, translatorId], queryFn: () => getPlayer(filmId, translatorId as number), enabled: translatorId !== null })

  useEffect(() => {
    setTranslatorId(propTranslatorId ?? null)
  }, [propTranslatorId])

  useEffect(() => {
    setQuality(propQuality ?? null)
  }, [propQuality])

  useEffect(() => {
    if (playerData) setVideos(playerData.streams)
  }, [playerData])

  useEffect(() => {
    if (translatorId === null) setVideos([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, translatorId])

  function onClickOnTranslator(id: number) {
    setTranslatorId(id)
    onUpdateState({ translator: id })
  }

  function onClickOnQuality(value: string) {
    setQuality(value)
    onUpdateState({ quality: value })
  }

  function getVideoSrc(value: string) {
    return videos.find(video => video.quality === value)?.playlist
  }

  function onCurrentTimeChange(time: number) {
    onUpdateState({ time })
  }

  return (
    <>
      <div className="mt-1">
        <Translators
          translatorId={translatorId}
          translators={translators}
          onClickOnTranslator={onClickOnTranslator}
        />
        {videos.length > 0 && (
          <>
            <div className="mt-1">
              <QualityChoices
                quality={quality as string}
                qualities={videos}
                onClickOnQuality={onClickOnQuality}
              />
            </div>
            {filmId && quality && (
              <div className="mt-1">
                <Player
                  movieId={filmId}
                  src={getVideoSrc(quality)}
                  currentTime={playerTime as unknown as null | undefined}
                  volume={playerVolume as unknown as null | undefined}
                  onCurrentTimeChange={onCurrentTimeChange as () => void}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Film
