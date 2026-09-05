import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { default as List} from '../Translators'

const GET_MOVIE_TRANSLATORS = gql`
  query MovieTranslators($id: Number) {
    details(id: $id) @rest(type: "MovieDetails", path: "details?id={args.id}") {
      translators {
        id,
        title
      }
    }
  }
`

interface Translator {
  id: number
  title: string
}

interface TranslatorsData {
  details: {
    translators: Translator[]
  }
}

interface TranslatorsProps {
  serialId: number
  translatorId: number
  onClickOnTranslator: (translatorId: number) => void
}

function Translators({
  serialId,
  translatorId,
  onClickOnTranslator,
}: TranslatorsProps) {
  const { loading, error, data } = useQuery<TranslatorsData>(GET_MOVIE_TRANSLATORS, {
    variables: { id: serialId },
  })

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

  if (!data) {
    return null
  }

  const { translators } = data.details

  return (
    <List translators={translators} translatorId={translatorId} onClickOnTranslator={onClickOnTranslator} />
  )
}

export default Translators
