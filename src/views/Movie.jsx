import MovieInfo from '../components/MovieInfo'

function Movie ({ match }) {
  if (!match.params.id) {
    return 'Error';
  }
  return (
    <MovieInfo id={parseInt(match.params.id)}/>
  )
}

export default Movie