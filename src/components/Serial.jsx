import { useEffect, useState, useCallback } from 'react'
import Translators from './Serial/Translators'
import Seasons from './Serial/Seasons'
import Episodes from './Serial/Episodes'
import QualityChoices from './Video/QualityChoices'
import Player from './Video/Player'

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
  const [translatorId, setTranslatorId] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [seasonEpisodes, setSeasonEpisodes] = useState([])
  const [seasons, setSeasons] = useState([])
  const [videos, setVideos] = useState([])
  const [seasonId, setSeasonId] = useState(null)
  const [episodeId, setEpisodeId] = useState(null)
  const [quality, setQuality] = useState(null)
  const [autoPlay, setAutoPlay] = useState(false)

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
      setSeasons([]);
      return
    }
    getEpisodesFromServer(serialId, translatorId)
  }, [serialId, translatorId])

  useEffect(() => {
    setSeasonEpisodes(episodes.filter(item => {
      return item.season === seasonId
    }))
  }, [episodes, seasonId])

  useEffect(() => {
    if (translatorId === null || seasonId === null || episodeId === null) {
      return
    }
    getVideoInfoFromServer({ serialId, translatorId, seasonId, episodeId })
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

  function getEpisodesFromServer (serialId, translatorId) {
    fetch(`${process.env.REACT_APP_API_URL}/serial/episodes?id=${serialId}&translator_id=${translatorId}`).then(response => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json()
    }).then(data => {
      setEpisodes(data.episodes)
      setSeasons(data.seasons)
    }).catch(() => {})
  }

  function getVideoInfoFromServer ({ serialId, translatorId, seasonId, episodeId }) {
    const url = `${process.env.REACT_APP_API_URL}/serial/player?id=${serialId}&translator_id=${translatorId}&episode=${episodeId}&season=${seasonId}`
    fetch(url).then(response => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json()
    }).then(data => {
      setVideos(data.uri)
    }).catch(() => {})
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, seasonEpisodes])

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
          seasons={seasons}
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
          {quality && (
            <div className="mt-1">
              <Player
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