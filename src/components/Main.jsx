import { useEffect, useState, useCallback } from 'react'
import * as yup from 'yup'
import MovieId from './MovieId'
import Serial from './Serial'
import { Link } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Film from './Film'

const GET_MOVIE_DETAILS = gql`
  query MovieDetails($id: Number) {
    details(id: $id) @rest(type: "MovieDetails", path: "details?id={args.id}") {
      isSerial,
      name,
      translators
    }
  }
`

const querySchema = yup.object().shape({
  translator: yup.number().nullable(),
  episode: yup.number().nullable(),
  season: yup.number().nullable(),
  quality: yup.string().nullable(),
  time: yup.number().nullable(),
  volume: yup.number().nullable(),
  autoPlay: yup.bool().nullable()
})

function Main () {
  const defaultQuery = {
    translator: null,
    episode: null,
    season: null,
    quality: null,
    time: 0,
    volume: 100,
    autoPlay: false
  };
  const [movieId, setMovieId] = useState(null)
  const [movieInfo, setMovieInfo] = useState(null)
  const [query, setQuery] = useState(defaultQuery)
  const [loadMovieDetails, { data: movieData }] = useLazyQuery(GET_MOVIE_DETAILS)

  useEffect(() => {
    if (!movieData) {
      return
    }
    setMovieInfo(movieData.details)
  }, [movieData])

  useEffect(() => {
    if (!movieInfo) {
      return
    }
    document.title = movieInfo.name
  }, [movieInfo])

  useEffect(() => {
    if (!movieInfo || !query) {
      return
    }
    buildDocumentTitle(movieInfo, query)
  }, [movieInfo, query])

  useEffect(() => {
    if (movieId === null) {
      return
    }
    loadMovieDetails({ variables: { id: movieId } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setQuery(q => ({ ...q, ...querySchema.cast(Object.fromEntries(searchParams)) }))

    window.addEventListener('popstate', event => {
      if (event.state === null) {
        return
      }
      setQuery(q => ({...defaultQuery, ...querySchema.cast(event.state) }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onChangeMovieId (value) {
    setMovieId(value)
    if (value === null) {
      setMovieInfo(null)
    }
  }

  const onUpdateState = useCallback(values => {
    setQuery(q => ({...defaultQuery, ...q, ...values }))

    const searchParams = new URLSearchParams(window.location.search)
    Object.entries(values).forEach(item => {
      const [name, value] = item
      searchParams.set(name, value)
    })
    const newQuery = `?${searchParams.toString()}`
    if (window.location.search === newQuery) {
      return
    }
    const data = {...window.history.state, ...values};
    window.history.pushState(data, document.title, newQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function buildDocumentTitle(movieInfo, queryData) {
    const title = [movieInfo.name];
    if (queryData.season) {
      title.push(`Сезон ${queryData.season}`)
    }
    if (queryData.episode) {
      title.push(`Серия ${queryData.episode}`)
    }

    document.title = title.join(' / ')
  }

  return (
    <div className="container-fluid mt-5 mb-5">
      <MovieId onChangeMovieId={onChangeMovieId}/>
      <div className="clearfix mb-4" />
      {movieInfo && movieInfo.isSerial && (
        <Serial
          serialId={movieId}
          translatorId={query.translator}
          episodeId={query.episode}
          seasonId={query.season}
          quality={query.quality}
          onUpdateState={onUpdateState}
          playerTime={query.time}
          playerVolume={query.volume}
          playerAutoPlay={query.autoPlay}
        />
      )}
      {movieInfo && !movieInfo.isSerial && (
        <Film
          filmId={movieId}
          translatorId={query.translator}
          translators={movieInfo.translators}
          quality={query.quality}
          onUpdateState={onUpdateState}
          playerTime={query.time}
          playerVolume={query.volume}
          playerAutoPlay={query.autoPlay}
        />
      )}
      {movieId && (
        <Link to={`/movie/${movieId}`}>Movie info</Link>
      )}
    </div>
  )
}

export default Main
