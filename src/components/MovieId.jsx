import { useCallback, useEffect, useState } from 'react'

function MovieId ({ onChangeMovieId }) {
  const [movieUrl, setMovieUrl] = useState('');
  const [movieId, setMovieId] = useState(null)

  const findIdByUrl = useCallback(value => {
    if (!value) {
      setMovieId(null)
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
    if (movieUrl) {
      return;
    }
    const searchParams = new URLSearchParams(window.location.search)
    const url = searchParams.get('movieUrl');
    if (url) {
      findIdByUrl(url)
      setMovieUrl(url);
    }
  }, [findIdByUrl, movieUrl])

  function onChange (e) {
    const value = e.target.value
    window.history.pushState({}, document.title, `?movieUrl=${value}`);
    findIdByUrl(value)
  }

  return (
    <div>
      <label>
        <p>Movie url</p>
        <input onChange={onChange} value={movieUrl}/>
        {movieId && (
          <p>ID: {movieId}</p>
        )}
      </label>
    </div>
  )
}

export default MovieId