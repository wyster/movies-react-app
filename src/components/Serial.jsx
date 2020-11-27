import { useEffect, useState } from 'react'
import SerialTranslators from './SerialTranslators'

function Serial ({ serialId }) {
  const [translatorId, setTranslatorId] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [seasons, setSeasons] = useState([])
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    onClickOnTranslator(searchParams.get('translator'))
  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    onClickOnEpisode({ episode: searchParams.get('episode'), season: searchParams.get('season') })
  }, [translatorId])

  function onClickOnTranslator (value) {
    if (value === null) {
      return
    }
    setTranslatorId(value)
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('translator', value)
    window.history.pushState({}, document.title, `?${searchParams.toString()}`)
    fetch(`${process.env.REACT_APP_API_URL}/serial/episodes?id=${serialId}&translator_id=${value}`).then(response => {
      return response.json()
    }).then(data => {
      setEpisodes(data.episodes)
      setSeasons(data.seasons)
    })
  }

  function onClickOnEpisode ({ episode, season }) {
    if (episode === null || season === null || translatorId === null) {
      return
    }
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('episode', episode)
    searchParams.set('season', season)
    window.history.pushState({}, document.title, `?${searchParams.toString()}`)
    fetch(`${process.env.REACT_APP_API_URL}/serial/player?id=${serialId}&translator_id=${translatorId}&episode=${episode}&season=${season}`).then(response => {
      return response.json()
    }).then(data => {
      setVideos(data.uri)
    })
  }

  return (
    <div>
      <SerialTranslators serialId={serialId} onClickOnTranslator={onClickOnTranslator}/>
      {seasons.length > 0 && (
        <>
          <p>Serial seasons</p>
          <ul>
            {seasons.map(item => (
              <li key={item.id}>
                {item.title}
              </li>
            ))}
          </ul>
        </>
      )}
      {episodes.length > 0 && (
        <>
          <p>Serial episodes</p>
          <ul>
            {episodes.map(item => (
              <li key={item.episode + '' + item.season}>
                <a onClick={() => onClickOnEpisode(item)}>
                  Episode {item.episode} Season {item.season}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      {videos.length > 0 && (
        <>
          <p>Videos</p>
          <ul>
            {videos.map(item => (
              <div key={item.quality}>
                <div>Quality: {item.quality}</div>
                <video controls>
                  <source src={item.video}/>
                </video>
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default Serial