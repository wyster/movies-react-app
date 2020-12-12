import { useCallback, useEffect, useState } from 'react'
import { findMovieId } from '../service/MovieService'

function MovieId ({ onChangeMovieId }) {
  const [movieUrl, setMovieUrl] = useState('')
  const [movieId, setMovieId] = useState(null)

  const findIdByUrl = useCallback(value => {
    if (value === movieUrl) {
      return
    }
    if (!value) {
      setMovieId(null)
      onChangeMovieId(null)
      return
    }
    if (Number.isInteger(parseInt(value, 10))) {
      setMovieId(parseInt(value, 10));
      onChangeMovieId(parseInt(value, 10))
      return
    }
    findMovieId(value).then(data => {
      setMovieId(data.id)
      onChangeMovieId(data.id)
    }).catch(() => {})
  }, [onChangeMovieId])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const url = searchParams.get('movieUrl')
    if (url) {
      findIdByUrl(url)
      setMovieUrl(url)
    }
  }, [])

  function onChange (value) {
    if (!value) {
      window.history.pushState({}, document.title, window.location.pathname)
    } else {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('movieUrl', value)
      window.history.pushState({}, document.title, `?${searchParams.toString()}`)
    }
    findIdByUrl(value)
    setMovieUrl(value)
  }

  return (
    <label className="w-100">
      <div className="input-group input-group-lg">
        <div className="input-group-text">Movie URL or ID</div>
        <input
          onChange={(e) => onChange(e.target.value)}
          value={movieUrl}
          className='form-control'
        />
        {movieUrl && (
          <button
            onClick={() => onChange('')}
            className='btn btn-success'
          >
            Reset
          </button>
        )}
      </div>
    </label>
  )
}

export default MovieId