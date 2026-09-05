import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMovieId } from '../api'


interface MovieIdData {
  movie?: {
    id: number
  } | null
}

interface MovieIdProps {
  onChangeMovieId: (id: number | null) => void
}

function MovieId({ onChangeMovieId }: MovieIdProps) {
  const [movieUrl, setMovieUrl] = useState('')
  const { isLoading: loading, error, data } = useQuery<MovieIdData>({ queryKey: ['movie-id', movieUrl], queryFn: () => getMovieId(movieUrl), enabled: Boolean(movieUrl) })

  useEffect(() => {
    if (data?.movie && movieUrl) {
      onChangeMovieId(data.movie.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (movieUrl) {
    }
  }, [movieUrl])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const url = searchParams.get('movieUrl')
    if (url) setMovieUrl(url)
  }, [])

  function onChange(value: string) {
    if (!value) {
      window.history.pushState({}, document.title, window.location.pathname)
      onChangeMovieId(null)
    } else {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('movieUrl', value)
      window.history.pushState(
        {},
        document.title,
        `?${searchParams.toString()}`,
      )
    }
    setMovieUrl(value)
  }

  return (
    <label className="w-100">
      <div className="input-group input-group-lg">
        <div className="input-group-text">Movie URL or ID</div>
        <input
          onChange={event => onChange(event.target.value)}
          value={movieUrl}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
        {loading && (
          <div className="input-group-text">
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {movieUrl && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="btn btn-success"
          >
            Reset
          </button>
        )}
      </div>
    </label>
  )
}

export default MovieId
