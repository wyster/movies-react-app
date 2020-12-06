import { useEffect, useState } from 'react'
import { getMovieDetails } from '../service/MovieService'

function MovieInfo ({
  id,
  onChangeMovieInfo = () => {}
}) {
  const [movieInfo, setMovieInfo] = useState([])

  useEffect(() => {
    getMovieDetails(id).then(data => {
      setMovieInfo(data)
      onChangeMovieInfo(data);
    }).catch(() => {})
  }, [id])

  return (
    <div>
      <label>
        <p>Movie info</p>
        {movieInfo && (
          <ul>
            <li><b>Movie ID:</b> {id}</li>
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