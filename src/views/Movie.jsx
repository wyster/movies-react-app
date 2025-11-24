import MovieInfo from '../components/MovieInfo'
import {useParams} from "react-router";

function Movie () {
  const { id } = useParams();
  return (
    <MovieInfo id={parseInt(id)} />
  )
}

export default Movie
