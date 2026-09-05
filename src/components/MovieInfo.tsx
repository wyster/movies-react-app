import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMovieDetails } from '../api'
import Serial from './Serial'
import Film from './Film'
import * as yup from 'yup'


interface Translator {
  id: number
  title: string
}

interface MovieInfoData {
  isSerial: boolean
  name: string
  description: string
  poster: string
  translators: Translator[]
  originalName: string
  year: number
}

interface QueryState {
  translator: number | null
  episode: number | null
  season: number | null
  quality: string | null
  time: number
  volume: number
  autoPlay: boolean
}

type StateUpdate = Partial<QueryState>

const querySchema = yup.object({
  translator: yup.number().nullable(),
  episode: yup.number().nullable(),
  season: yup.number().nullable(),
  quality: yup.string().nullable(),
  time: yup.number().nullable(),
  volume: yup.number().nullable(),
  autoPlay: yup.bool().nullable(),
})

const defaultQuery: QueryState = {
  translator: null,
  episode: null,
  season: null,
  quality: null,
  time: 0,
  volume: 100,
  autoPlay: false,
}

interface MovieInfoProps {
  id: number
}

function MovieInfo({ id }: MovieInfoProps) {
  const { isLoading: loading, error, data } = useQuery<MovieInfoData>({ queryKey: ['movie-details', id], queryFn: () => getMovieDetails(id), enabled: Boolean(id) })
  const [query, setQuery] = useState<QueryState>(defaultQuery)

  const onUpdateState = useCallback((values: StateUpdate) => {
    setQuery(current => ({ ...defaultQuery, ...current, ...values }))

    const searchParams = new URLSearchParams(window.location.search)
    Object.entries(values).forEach(([name, value]) => {
      searchParams.set(name, String(value))
    })
    const newQuery = `?${searchParams.toString()}`
    if (window.location.search === newQuery) return

    const historyData = { ...window.history.state, ...values }
    window.history.pushState(historyData, document.title, newQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  function buildDocumentTitle(movie: MovieInfoData, queryData: QueryState) {
    const title = [movie.name]
    if (queryData.season) title.push(`Сезон ${queryData.season}`)
    if (queryData.episode) title.push(`Серия ${queryData.episode}`)
    document.title = title.join(' / ')
  }

  useEffect(() => {
    if (data) buildDocumentTitle(data, query)
  }, [data, query])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const castQuery = querySchema.cast(Object.fromEntries(searchParams))
    setQuery(current => ({
      ...current,
      ...castQuery,
      time: castQuery.time ?? current.time,
      volume: castQuery.volume ?? current.volume,
      autoPlay: castQuery.autoPlay ?? current.autoPlay,
    }))

    const onPopState = (event: PopStateEvent) => {
      if (event.state === null) return
      const castState = querySchema.cast(event.state)
      setQuery({
        ...defaultQuery,
        ...castState,
        time: castState.time ?? defaultQuery.time,
        volume: castState.volume ?? defaultQuery.volume,
        autoPlay: castState.autoPlay ?? defaultQuery.autoPlay,
      })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  if (!id) return <p>No ID</p>
  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    )
  }
  if (error) return `Error! ${error}`

  const movieInfo = data
  if (!movieInfo) return null

  return (
    <>
      <h4>
        {movieInfo.originalName || movieInfo.name} ({movieInfo.year})
      </h4>
      {movieInfo.isSerial ? (
        <Serial
          serialId={id}
          translatorId={query.translator}
          episodeId={query.episode}
          seasonId={query.season}
          quality={query.quality}
          onUpdateState={onUpdateState}
          playerTime={query.time}
          playerVolume={query.volume}
          playerAutoPlay={query.autoPlay}
        />
      ) : (
        <Film
          filmId={id}
          translatorId={query.translator}
          translators={movieInfo.translators}
          quality={query.quality}
          onUpdateState={onUpdateState}
          playerTime={query.time}
          playerVolume={query.volume}
        />
      )}
      <ul>
        <li><b>Movie ID:</b> {id}</li>
        {Object.entries(movieInfo).map(([label, value]) => (
          <li key={label}>
            <b style={{ marginRight: 10 }}>{label}:</b>
            {Array.isArray(value) && JSON.stringify(value)}
            {typeof value === 'string' && value}
            {typeof value === 'boolean' && (value ? 'Yes' : 'No')}
            {typeof value === 'number' && value}
          </li>
        ))}
      </ul>
    </>
  )
}

export default MovieInfo
