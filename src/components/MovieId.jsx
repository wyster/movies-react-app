import { useCallback, useEffect, useState } from 'react'

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
    fetch(`${process.env.REACT_APP_API_URL}/id-from-url?url=${value}`).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json()
    }).then(data => {
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
    <div>
      <label>
        <div className='input-group input-group-lg'>
          <div className="input-group-prepend">
            <span className="input-group-text">Movie URL or ID</span>
          </div>
          <input
            onChange={(e) => onChange(e.target.value)}
            value={movieUrl}
            className='form-control'
          />
          {movieUrl && (
            <div className="input-group-append">
              <button
                onClick={() => onChange('')}
                className='btn btn-success'
              >
                Reset
              </button>
            </div>
          )}
        </div>
        {movieId && (
          <p>ID: {movieId}</p>
        )}
      </label>
    </div>
  )
}

export default MovieId