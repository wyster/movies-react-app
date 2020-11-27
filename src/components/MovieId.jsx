import { useCallback, useEffect, useState } from 'react'

function MovieId ({ onChangeMovieId }) {
  const [movieUrl, setMovieUrl] = useState('');
  const [movieId, setMovieId] = useState(null)

  const findIdByUrl = useCallback(value => {
    if (value === movieUrl) {
      return;
    }
    if (!value) {
      setMovieId(null)
      onChangeMovieId(null)
      return
    }
    fetch(`${process.env.REACT_APP_API_URL}/id-from-url?url=${value}`).then(response => {
      return response.json()
    }).then(data => {
      setMovieId(data.id)
      onChangeMovieId(data.id)
    })
  }, [onChangeMovieId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const url = searchParams.get('movieUrl');
    if (url) {
      findIdByUrl(url)
      setMovieUrl(url);
    }
  }, [])

  function onChange (value) {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('movieUrl', value);
    window.history.pushState({}, document.title, `?${searchParams.toString()}`);
    findIdByUrl(value)
    setMovieUrl(value);
  }

  return (
    <div>
      <label>
        <p>Movie url</p>
        <input onChange={(e) => onChange(e.target.value)} value={movieUrl}/>
        <button onClick={() => onChange('')}>Reset</button>
        {movieId && (
          <p>ID: {movieId}</p>
        )}
      </label>
    </div>
  )
}

export default MovieId