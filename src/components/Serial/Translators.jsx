import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const GET_MOVIE_TRANSLATORS = gql`
  query MovieTranslators($id: Number) {
    movie(id: $id) @rest(type: "Translator", path: "movie/{args.id}") {
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
    <>
      {translators.length > 0 && (
        <nav className="nav nav-pills">
          {translators.map(translator => (
            <a
              key={translator.id}
              className={`nav-link ${translatorId === translator.id ? 'active' : ''}`}
              href="#"
              onClick={e => {
                e.preventDefault();
                onClickOnTranslator(translator.id)
              }}
            >
              {translator.title}
            </a>
          ))}
        </nav>
      )}
    </>
  )
}

export default Translators