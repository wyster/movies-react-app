import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const GET_MOVIE_DETAILS = gql`
  query MovieDetails($id: Number) {
    movie(id: $id) @rest(type: "Movie", path: "details?id={args.id}") {
      isSerial
    }
  }
`

function MovieInfo ({
  id,
  onChangeMovieInfo = () => {}
}) {
  const [load, { called, loading, error, data }] = useLazyQuery(
    GET_MOVIE_DETAILS
  )

  useEffect(() => {
    load({ variables: { id } })
  }, [id])

  useEffect(() => {
    onChangeMovieInfo(data)
  }, [data])

  if (!called || loading) {
    return 'Loading...'
  }

  if (error) {
    return `Error! ${error}`
  }

  return (
    <>
      <p>Movie info</p>
      <ul>
        <li><b>Movie ID:</b> {id}</li>
        {Object.entries(data.movie).map(([label, value]) => (
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