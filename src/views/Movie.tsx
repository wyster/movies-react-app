import MovieInfo from '../components/MovieInfo'
import { useParams } from 'react-router'

function Movie() {
  const { id } = useParams<{ id: string }>()

  return (
    <MovieInfo id={Number.parseInt(id ?? '', 10)} />
  )
}

export default Movie
