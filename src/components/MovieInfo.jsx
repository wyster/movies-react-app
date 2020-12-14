import { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const GET_MOVIE_DETAILS = gql`
  query MovieDetails($id: Number) {
    movie(id: $id) @rest(type: "MovieDetails", path: "details?id={args.id}") {
      isSerial
    }
  }
`

function MovieInfo ({
  id,
  onChangeMovieInfo = () => {}
}) {
  const { loading, error, data } = useQuery(GET_MOVIE_DETAILS, { variables: { id } })

  useEffect(() => {
    if (!data) {
      return;
    }
    onChangeMovieInfo(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    )
  }

  if (error) {
    return `Error! ${error}`
  }

  const { movie } = data

  return (
    <>
      <p>Movie info</p>
      <ul>
        <li><b>Movie ID:</b> {id}</li>
        {Object.entries(movie).map(([label, value]) => (
          <li key={label}>
            <b style={{ marginRight: 10 }}>{label}:</b>
            {Array.isArray(value) && JSON.stringify(value)}
            {typeof value === 'string' && value}
            {typeof value === 'boolean' && (value ? 'Yes' : 'No')}
          </li>
        ))}
      </ul>
    </>
  )
}

export default MovieInfo