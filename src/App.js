import { useEffect, useState } from 'react'
import * as yup from 'yup'
import './App.css'
import MovieId from './components/MovieId'
import MovieInfo from './components/MovieInfo'
import Serial from './components/Serial'

const querySchema = yup.object().shape({
  translator: yup.number().nullable(),
  episode: yup.number().nullable(),
  season: yup.number().nullable(),
  quality: yup.string().nullable(),
  time: yup.number().nullable()
})

function App () {
  const [movieId, setMovieId] = useState(null)
  const [movieInfo, setMovieInfo] = useState(null)
  const [query, setQuery] = useState({
    translator: null,
    episode: null,
    season: null,
    quality: null,
    time: 0
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setQuery(q => ({ ...q, ...querySchema.cast(Object.fromEntries(searchParams)) }))

    window.addEventListener('popstate', event => {
      setQuery(q => ({ ...q, ...querySchema.cast(event.state) }))
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
    const newQuery = `?${searchParams.toString()}`
    if (window.location.search === newQuery) {
      return
    }
    window.history.pushState(values, document.title, newQuery)
  }

  return (
    <div className="container-fluid mt-5 mb-5">
      <MovieId onChangeMovieId={onChangeMovieId}/>
      {movieInfo && movieInfo.isSerial && (
        <Serial
          serialId={movieId}
          translatorId={query.translator}
          episodeId={query.episode}
          seasonId={query.season}
          quality={query.quality}
          onUpdateState={onUpdateState}
          playerTime={query.time}
        />
      )}
      {movieId && (
        <MovieInfo movieId={movieId} onChangeMovieInfo={onChangeMovieInfo}/>
      )}
    </div>
  )
}

export default App
