import { useEffect, useState } from 'react'
import './App.css'
import MovieId from './components/MovieId'
import MovieInfo from './components/MovieInfo'
import Serial from './components/Serial'

function App () {
  const [movieId, setMovieId] = useState(null)
  const [movieInfo, setMovieInfo] = useState(null)
  const [query, setQuery] = useState({
    translator: null,
    episode: null,
    season: null,
    quality: null
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setQuery(Object.fromEntries(searchParams))

    window.addEventListener('popstate', event => {
      setQuery(q => ({ ...q, ...event.state }))
    })
  }, [])

  function onChangeMovieId (value) {
    setMovieId(value)
    if (value === null) {
      setMovieInfo(null)
    }
  }

  function onChangeMovieInfo (value) {
    setMovieInfo(value)
  }

  function onUpdateState (values) {
    setQuery(q => ({ ...q, ...values }))

    const searchParams = new URLSearchParams(window.location.search)
    Object.entries(values).forEach(item => {
      const [name, value] = item
      searchParams.set(name, value)
    })
    window.history.pushState(values, document.title, `?${searchParams.toString()}`)
  }

  return (
    <div className="container-fluid mt-5 mb-5">
      <MovieId onChangeMovieId={onChangeMovieId}/>
      {movieId && (
        <MovieInfo movieId={movieId} onChangeMovieInfo={onChangeMovieInfo}/>
      )}
      {movieInfo && movieInfo.isSerial && (
        <Serial
          serialId={movieId}
          translatorId={query.translator}
          episodeId={query.episode}
          seasonId={query.season}
          quality={query.quality}
          onUpdateState={onUpdateState}
        />
      )}
    </div>
  )
}

export default App
