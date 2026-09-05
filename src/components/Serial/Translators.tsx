import { useQuery } from '@tanstack/react-query'
import { getMovieDetails } from '../../api'
import { default as List} from '../Translators'


interface Translator {
  id: number
  title: string
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
  const { isLoading: loading, error, data } = useQuery<{ translators: Translator[] }>({ queryKey: ['movie-details', serialId], queryFn: () => getMovieDetails(serialId) })

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

  const { translators } = data

  return (
    <List translators={translators} translatorId={translatorId} onClickOnTranslator={onClickOnTranslator} />
  )
}

export default Translators
