import { useEffect, useState } from 'react'

function MovieId ({ onChangeMovieId }) {
  const [movieId, setMovieId] = useState(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    findIdByUrl(searchParams.get('movieUrl'))
  }, [])

  function findIdByUrl (value) {
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
  }

  function onChange (e) {
    const value = e.target.value
    window.history.pushState({}, document.title, `?movieUrl=${value}`);
    findIdByUrl(value)
  }

  return (
    <div>
      <label>
        <p>Movie url</p>
        <input onChange={onChange}/>
        {movieId && (
          <p>ID: {movieId}</p>
        )}
      </label>
    </div>
  )
}

export default MovieId