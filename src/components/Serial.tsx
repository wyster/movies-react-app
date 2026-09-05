import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSerialData, getSerialPlayer } from '../api'
import Translators from './Serial/Translators'
import Seasons from './Serial/Seasons'
import Episodes from './Serial/Episodes'
import QualityChoices from './Video/QualityChoices'
import Player from './Video/Player'


interface Episode {
  episode: number
  season: number
  title: string
}

interface Season {
  id: number
  title: string
}

interface Video {
  quality: string
  playlist: string
}

interface SerialData {
  episodes: Episode[]
  seasons: Season[]
}

interface PlayerData {
  streams: Video[]
}

interface SerialProps {
  serialId: number
  episodeId?: number | null
  seasonId?: number | null
  translatorId?: number | null
  quality?: string | null
  onUpdateState: (values: Record<string, number | string>) => void
  playerTime?: number
  playerVolume?: number
  playerAutoPlay?: boolean
}

function Serial({
  serialId,
  episodeId: propEpisodeId,
  seasonId: propSeasonId,
  translatorId: propTranslatorId,
  quality: propQuality,
  onUpdateState,
  playerTime = 0,
  playerVolume = 100,
  playerAutoPlay = false,
}: SerialProps) {
  const [translatorId, setTranslatorId] = useState<number | null>(null)
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [seasonId, setSeasonId] = useState<number | null>(null)
  const [episodeId, setEpisodeId] = useState<number | null>(null)
  const [quality, setQuality] = useState<string | null>(null)
  const [autoPlay, setAutoPlay] = useState(false)
  const { data: serialData } = useQuery<SerialData>({ queryKey: ['serial', serialId, translatorId], queryFn: () => getSerialData(serialId, translatorId as number), enabled: translatorId !== null })
  const { data: playerData } = useQuery<PlayerData>({ queryKey: ['serial-player', serialId, translatorId, seasonId, episodeId], queryFn: () => getSerialPlayer(serialId, translatorId as number, episodeId as number, seasonId as number), enabled: translatorId !== null && seasonId !== null && episodeId !== null })

  useEffect(() => {
    if (playerData) setVideos(playerData.streams)
  }, [playerData])
  useEffect(() => {
    setTranslatorId(propTranslatorId ?? null)
  }, [propTranslatorId])
  useEffect(() => {
    setSeasonId(propSeasonId ?? null)
  }, [propSeasonId])
  useEffect(() => {
    setEpisodeId(propEpisodeId ?? null)
  }, [propEpisodeId])
  useEffect(() => {
    setQuality(propQuality ?? null)
  }, [propQuality])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialId, translatorId])

  useEffect(() => {
    if (serialData) setSeasonEpisodes(serialData.episodes.filter(item => item.season === seasonId))
  }, [serialData, seasonId])

  useEffect(() => {
    if (translatorId !== null && seasonId !== null && episodeId !== null) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialId, translatorId, seasonId, episodeId])

  useEffect(() => {
    if (translatorId === null || seasonId === null || episodeId === null) setVideos([])
  }, [serialId, translatorId, seasonId, episodeId])

  const onClickOnTranslator = (id: number) => {
    setSeasonId(null);
    setEpisodeId(null);
    setTranslatorId(id);
    onUpdateState({translator: id})
  }
  const onClickOnSeason = (id: number) => {
    setSeasonId(id);
    setEpisodeId(1);
    onUpdateState({season: id})
  }
  const onClickOnEpisode = (id: number) => {
    setEpisodeId(id);
    onUpdateState({episode: id});
    onUpdateState({time: 0})
  }
  const onClickOnQuality = (value: string) => {
    setQuality(value);
    onUpdateState({quality: value})
  }
  const onCurrentTimeChange = (time: number) => onUpdateState({time})
  const onVolumeChange = (volume: number) => onUpdateState({volume})
  const getVideoSrc = (value: string) => videos.find(video => video.quality === value)?.playlist

  const onEnded = useCallback(() => {
    if (episodeId === null || seasonId === null || !serialData) return
    const nextEpisode = seasonEpisodes.find(item => item.episode === episodeId + 1)
    if (nextEpisode) {
      onClickOnEpisode(nextEpisode.episode);
      setAutoPlay(true);
      return
    }
    if (serialData.seasons.find(item => item.id === seasonId + 1)) {
      onClickOnSeason(seasonId + 1);
      setAutoPlay(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, seasonId, seasonEpisodes, serialData])

  return <>
    <div className="mt-1">
      <Translators serialId={serialId} translatorId={translatorId as number} onClickOnTranslator={onClickOnTranslator} />
    </div>
    <div className="mt-1">
      <Seasons seasonId={seasonId as number} seasons={serialData?.seasons || []} onClickOnSeason={onClickOnSeason} />
    </div>
    {seasonId && <div className="mt-1"><Episodes episodeId={episodeId as number} episodes={seasonEpisodes} onClickOnEpisode={onClickOnEpisode} /></div>}
    {videos.length > 0 &&
        <>
        <div className="mt-1">
          <QualityChoices quality={quality as string} qualities={videos} onClickOnQuality={onClickOnQuality} /></div>
          {serialId && quality && (
            <div className="mt-1">
              <Player
                  movieId={serialId}
                  src={getVideoSrc(quality)}
                  currentTime={playerTime as unknown as null | undefined}
                  volume={playerVolume as unknown as null | undefined}
                  onCurrentTimeChange={onCurrentTimeChange as () => void}
                  onChangeVolume={onVolumeChange as () => void}
                  onEnded={onEnded}
                  autoPlay={autoPlay || playerAutoPlay}
              />
            </div>
          )}
        </>
    }
  </>
}

export default Serial
