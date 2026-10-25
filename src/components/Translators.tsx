interface Translator {
  id: number
  title: string
  isDirector: boolean
  lang?: string
}

interface TranslatorsProps {
  translators: Translator[]
  translatorId: number | null | undefined
  onClickOnTranslator: (translatorId: Translator) => void
}

function Translators({
  translators,
  translatorId,
  onClickOnTranslator,
}: TranslatorsProps) {
  const ukrainianTranslators = translators.filter(translator => translator.lang === 'uk')
  const visibleTranslators = ukrainianTranslators.length > 0
    ? ukrainianTranslators
    : translators.length === 1
      ? translators
      : []

  return (
    <>
      {visibleTranslators.length > 0 && (
        <nav className="nav nav-pills">
          {visibleTranslators.map(translator => (
            <button
              type="button"
              key={translator.id}
              className={`btn btn-link nav-link ${translatorId === translator.id ? 'active' : ''}`}
              onClick={(event) => {
                event.preventDefault()
                onClickOnTranslator(translator)
              }}
            >
              {translator.title}
            </button>
          ))}
        </nav>
      )}
    </>
  )
}

export default Translators
