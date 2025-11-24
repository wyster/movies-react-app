import { useEffect, useState } from 'react'
import Translators from './Translators'
import QualityChoices from './Video/QualityChoices'
import Player from './Video/Player'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client/react'
import {prepareUri} from "../utils/UriHelper";

const GET_PLAYER = gql`
  query MoviePlayer($filmId: Number, $translatorId: Number) {
    data(filmId: $filmId, translatorId: $translatorId) @rest(type: "MoviePlayer", path: "movie/player?id={args.filmId}&translator_id={args.translatorId}") {
      url
    }
  }
`

function Film ({
  filmId,
  translators,
  onUpdateState,
  playerTime = 0,
  playerVolume = 100,
  translatorId: propTranslatorId,
  quality: propQuality,
}) {
  const [getPlayerData, { data: playerData }] = useLazyQuery(GET_PLAYER);
  const [translatorId, setTranslatorId] = useState(null)
  const [videos, setVideos] = useState([])
  const [quality, setQuality] = useState(null)

  useEffect(() => {
    setTranslatorId(propTranslatorId)
  }, [propTranslatorId])

  useEffect(() => {
    setQuality(propQuality)
  }, [propQuality])

  useEffect(() => {
    if (!playerData) {
      return;
    }
    setVideos(prepareUri(playerData.data.url));
  }, [playerData])

  useEffect(() => {
    if (translatorId === null) {
      return
    }
    getPlayerData({ variables: { filmId, translatorId} })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, translatorId])

  function onClickOnTranslator (translatorId) {
    setTranslatorId(translatorId)

    onUpdateState({ translator: translatorId })
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
                quality={quality}
                qualities={videos}
                onClickOnQuality={onClickOnQuality}
              />
            </div>
            {filmId && quality && (
              <div className="mt-1">
                <Player
                  movieId={filmId}
                  src={getVideoSrc(quality)}
                  currentTime={playerTime}
                  volume={playerVolume}
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
