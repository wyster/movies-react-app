import { useEffect, useState, useCallback } from 'react'
import Translators from './Serial/Translators'
import Seasons from './Serial/Seasons'
import Episodes from './Serial/Episodes'
import QualityChoices from './Video/QualityChoices'
import Player from './Video/Player'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/react-hooks'
import {prepareUri} from "../utils/UriHelper";

const GET_SERIAL_DATA = gql`
  query SerialData($serialId: Number, $translatorId: Number) {
    data(serialId: $serialId, translatorId: $translatorId) @rest(type: "SerialData", path: "serial/episodes?id={args.serialId}&translator_id={args.translatorId}") {
      episodes,
      seasons
    }
  }
`

const GET_PLAYER = gql`
  query MoviePlayer($serialId: Number, $translatorId: Number, $episodeId: Number, $seasonId: Number) {
    data(serialId: $serialId, translatorId: $translatorId, episodeId: $episodeId, seasonId: $seasonId) @rest(type: "MoviePlayer", path: "serial/player?id={args.serialId}&translator_id={args.translatorId}&episode={args.episodeId}&season={args.seasonId}") {
      url
    }
  }
`

function Serial ({
  serialId,
  episodeId: propEpisodeId,
  seasonId: propSeasonId,
  translatorId: propTranslatorId,
  quality: propQuality,
  onUpdateState,
  playerTime = 0,
  playerVolume = 100,
  playerAutoPlay = false
}) {
  const [getSerialData, { data: serialData }] = useLazyQuery(GET_SERIAL_DATA);
  const [getPlayerData, { data: playerData }] = useLazyQuery(GET_PLAYER);

  const [translatorId, setTranslatorId] = useState(null)
  const [seasonEpisodes, setSeasonEpisodes] = useState([])
  const [videos, setVideos] = useState([])
  const [seasonId, setSeasonId] = useState(null)
  const [episodeId, setEpisodeId] = useState(null)
  const [quality, setQuality] = useState(null)
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    if (!playerData) {
      return;
    }
    setVideos(prepareUri(playerData.data.url));
  }, [playerData])

  useEffect(() => {
    setTranslatorId(propTranslatorId)
  }, [propTranslatorId])

  useEffect(() => {
    setSeasonId(propSeasonId)
  }, [propSeasonId])

  useEffect(() => {
    setEpisodeId(propEpisodeId)
  }, [propEpisodeId])

  useEffect(() => {
    setQuality(propQuality)
  }, [propQuality])

  useEffect(() => {
    if (translatorId == null) {
      return
    }
    getSerialData({ variables: { serialId, translatorId } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialId, translatorId])

  useEffect(() => {
    if (!serialData) {
      return;
    }
    setSeasonEpisodes(serialData.data.episodes.filter(item => {
      return item.season === seasonId
    }))
  }, [serialData, seasonId])

  useEffect(() => {
    if (translatorId === null || seasonId === null || episodeId === null) {
      return
    }
    getPlayerData({ variables: { serialId, translatorId, seasonId, episodeId} })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialId, translatorId, seasonId, episodeId])

  useEffect(() => {
    if (translatorId !== null && seasonId !== null && episodeId !== null) {
      return
    }
    setVideos([])
  }, [serialId, translatorId, seasonId, episodeId])

  function onClickOnTranslator (translatorId) {
    setSeasonId(null);
    setEpisodeId(null);
    setTranslatorId(translatorId)

    onUpdateState({ translator: translatorId })
  }

  function onClickOnSeason (seasonId) {
    setSeasonId(seasonId)
    setEpisodeId(1);

    onUpdateState({ season: seasonId })
  }

  function onClickOnEpisode (episodeId) {
    setEpisodeId(episodeId)

    onUpdateState({ episode: episodeId })
    onCurrentTimeChange(0)
  }

  function onClickOnQuality (quality) {
    setQuality(quality)

    onUpdateState({ quality })
  }

  function getVideoSrc (quality) {
    const video = videos.find(value => {
      return value.quality === quality
    })

    if (video) {
      return video.video
    }

    return undefined
  }

  function onCurrentTimeChange (time) {
    onUpdateState({ time })
  }

  function onVolumeChange (volume) {
    onUpdateState({ volume })
  }

  const onEnded = useCallback(() => {
    const nextEpisodeId = episodeId + 1
    const nextEpisode = seasonEpisodes.find(item => {
      return item.episode === nextEpisodeId
    })
    if (nextEpisode) {
      onClickOnEpisode(nextEpisode.episode)
      setAutoPlay(true)
    } else {
      const nextSeasonId = seasonId + 1
      const nextSeason = serialData.data.seasons.find(item => {
        return item.id === nextSeasonId
      })
      if (nextSeason) {
        onClickOnSeason(nextSeasonId);
        setAutoPlay(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, seasonId, seasonEpisodes, serialData])

  return (
    <>
      <div className="mt-1">
        <Translators
          serialId={serialId}
          translatorId={translatorId}
          onClickOnTranslator={onClickOnTranslator}
        />
      </div>
      <div className="mt-1">
        <Seasons
          seasonId={seasonId}
          seasons={(serialData && serialData.data.seasons) || []}
          onClickOnSeason={onClickOnSeason}
        />
      </div>
      {seasonId && (
        <div className="mt-1">
          <Episodes
            episodeId={episodeId}
            episodes={seasonEpisodes}
            onClickOnEpisode={onClickOnEpisode}
          />
        </div>
      )}
      {videos.length > 0 && (
        <>
          <div className="mt-1">
            <QualityChoices
              quality={quality}
              qualities={videos}
              onClickOnQuality={onClickOnQuality}
            />
          </div>
          {serialId && quality && (
            <div className="mt-1">
              <Player
                movieId={serialId}
                src={getVideoSrc(quality)}
                currentTime={playerTime}
                volume={playerVolume}
                onCurrentTimeChange={onCurrentTimeChange}
                onChangeVolume={onVolumeChange}
                onEnded={onEnded}
                autoPlay={autoPlay === true ? autoPlay : playerAutoPlay}
              />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Serial
