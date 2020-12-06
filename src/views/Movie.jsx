import MovieInfo from '../components/MovieInfo'

function Movie ({ match }) {
  return (
    <MovieInfo id={match.params.id}/>
  )
}

export default Movie