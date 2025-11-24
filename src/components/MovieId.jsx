import { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client/react'

const GET_MOVIE_ID = gql`
  query MovieId($url: String) {
    movie(url: $url) @rest(type: "MovieId", path: "id-from-url?url={args.url}") {
      id
    }
  }
`

function MovieId ({ onChangeMovieId }) {
  const [load, { loading, error, data }] = useLazyQuery(GET_MOVIE_ID)
  const [movieUrl, setMovieUrl] = useState('')

  useEffect(() => {
    if (!data || !movieUrl) {
      return
    }
    if (!data.movie) {
      return;
    }
    const { id }  = data.movie
    onChangeMovieId(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (!movieUrl) {
      return
    }
    load({ variables: { url: movieUrl } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieUrl])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const url = searchParams.get('movieUrl')
    if (url) {
      setMovieUrl(url)
    }
  }, [])

  function onChange (value) {
    if (!value) {
      window.history.pushState({}, document.title, window.location.pathname)
      onChangeMovieId(null);
    } else {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('movieUrl', value)
      window.history.pushState({}, document.title, `?${searchParams.toString()}`)
      load({ variables: { url: value } })
    }
    setMovieUrl(value)
  }

  return (
    <label className="w-100">
      <div className="input-group input-group-lg">
        <div className="input-group-text">Movie URL or ID</div>
        <input
          onChange={(e) => onChange(e.target.value)}
          value={movieUrl}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
        {loading && (
          <div className="input-group-text">
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {movieUrl && (
          <button
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
