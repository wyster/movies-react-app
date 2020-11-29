import { useEffect, useState } from 'react'
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
  playerTime = 0
}) {
  const [translatorId, setTranslatorId] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [seasons, setSeasons] = useState([])
  const [videos, setVideos] = useState([])
  const [seasonId, setSeasonId] = useState(null)
  const [episodeId, setEpisodeId] = useState(null)
  const [quality, setQuality] = useState(null)

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
    getEpisodesFromServer(serialId, translatorId)
  }, [serialId, translatorId])

  useEffect(() => {
    if (translatorId == null || seasonId == null || episodeId === null) {
      return
    }
    getVideoInfoFromServer({ serialId, translatorId, seasonId, episodeId })
  }, [serialId, translatorId, seasonId, episodeId])

  function onClickOnTranslator (translatorId) {
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

  function getEpisodes (seasonId) {
    return episodes.filter(value => {
      return value.season === seasonId
    })
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
    onUpdateState({time});
  }

  return (
    <>
      <Translators serialId={serialId} translatorId={translatorId} onClickOnTranslator={onClickOnTranslator}/>
      <Seasons seasonId={seasonId} seasons={seasons} onClickOnSeason={onClickOnSeason}/>
      {seasonId && (
        <Episodes episodeId={episodeId} episodes={getEpisodes(seasonId)} onClickOnEpisode={onClickOnEpisode}/>
      )}
      {videos.length > 0 && (
        <>
          <QualityChoices quality={quality} qualities={videos} onClickOnQuality={onClickOnQuality}/>
          {quality && (
            <Player src={getVideoSrc(quality)} currentTime={playerTime} onCurrentTimeChange={onCurrentTimeChange}/>
          )}
        </>
      )}
    </>
  )
}

export default Serial