import { useEffect, useState } from 'react'

function MovieInfo ({ movieId, onChangeMovieInfo }) {
  const [movieInfo, setMovieInfo] = useState(null)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/details?id=${movieId}`).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json()
    }).then(data => {
      setMovieInfo(data)
      onChangeMovieInfo(data);
    }).catch(() => {})
  }, [movieId])

  return (
    <div>
      <label>
        <p>Movie info</p>
        {movieInfo && (
          <ul>
            {Object.entries(movieInfo).map(([label, value]) => (
              <li key={label}>
                <b style={{marginRight: 10}}>{label}:</b>
                {Array.isArray(value) && JSON.stringify(value)}
                {typeof value === 'string' && value}
                {typeof value === 'boolean' && (value ? 'Yes' : 'No')}
              </li>
            ))}
          </ul>
        )}
      </label>
    </div>
  )
}

export default MovieInfo