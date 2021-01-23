import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { default as List} from '../Translators'

const GET_MOVIE_TRANSLATORS = gql`
  query MovieTranslators($id: Number) {
    movie(id: $id) @rest(type: "MovieTranslators", path: "movie/{args.id}") {
      translators {
        id,
        title
      }
    }
  }
`

function Translators ({ serialId, translatorId, onClickOnTranslator }) {
  const { loading, error, data } = useQuery(GET_MOVIE_TRANSLATORS, { variables: { id: serialId } })

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

  const { translators } = data.movie;

  return (
    <List translators={translators} translatorId={translatorId} onClickOnTranslator={onClickOnTranslator} />
  )
}

export default Translators